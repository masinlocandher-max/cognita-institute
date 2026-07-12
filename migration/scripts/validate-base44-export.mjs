#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationDirectory = path.resolve(scriptDirectory, "..");
const entityMap = JSON.parse(
  await readFile(path.join(migrationDirectory, "entity-map.json"), "utf8"),
);

const exportDirectory = process.argv[2];
const writeReport = process.argv.includes("--write");

if (!exportDirectory) {
  console.error(
    "Usage: node migration/scripts/validate-base44-export.mjs <export-directory> [--write]",
  );
  process.exit(1);
}

const absoluteExportDirectory = path.resolve(exportDirectory);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(fullPath));
    else files.push(fullPath);
  }

  return files;
}

function normalizeEntityName(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  return baseName
    .replace(/[-_ ]?(export|records|entities|data)$/i, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function getRecords(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.data)) return parsed.data;
  if (Array.isArray(parsed?.items)) return parsed.items;
  if (Array.isArray(parsed?.results)) return parsed.results;
  if (parsed && typeof parsed === "object") return [parsed];
  return [];
}

function recordIdentifier(record) {
  return record?.id ?? record?._id ?? record?.uuid ?? record?.entity_id ?? null;
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function inspectJson(filePath) {
  const buffer = await readFile(filePath);
  const parsed = JSON.parse(buffer.toString("utf8"));
  const records = getRecords(parsed);
  const identifiers = records.map(recordIdentifier).filter(Boolean).map(String);
  const duplicateIdentifiers = identifiers.filter(
    (identifier, index) => identifiers.indexOf(identifier) !== index,
  );

  return {
    relativePath: path.relative(absoluteExportDirectory, filePath),
    format: "json",
    bytes: buffer.length,
    sha256: sha256(buffer),
    recordCount: records.length,
    recordsWithIdentifier: identifiers.length,
    missingIdentifierCount: records.length - identifiers.length,
    duplicateIdentifiers: [...new Set(duplicateIdentifiers)].slice(0, 100),
    topLevelShape: Array.isArray(parsed) ? "array" : typeof parsed,
    sampleKeys: records[0] && typeof records[0] === "object"
      ? Object.keys(records[0]).sort()
      : [],
  };
}

async function inspectCsv(filePath) {
  const buffer = await readFile(filePath);
  const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
  const nonEmptyLines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const header = nonEmptyLines[0] || "";

  return {
    relativePath: path.relative(absoluteExportDirectory, filePath),
    format: "csv",
    bytes: buffer.length,
    sha256: sha256(buffer),
    recordCount: Math.max(nonEmptyLines.length - 1, 0),
    header,
    warning: "CSV record count is line-based and must be rechecked if fields contain embedded line breaks.",
  };
}

const sourceStats = await stat(absoluteExportDirectory).catch(() => null);
if (!sourceStats?.isDirectory()) {
  console.error(`Export directory not found: ${absoluteExportDirectory}`);
  process.exit(1);
}

const files = await listFiles(absoluteExportDirectory);
const supportedFiles = files.filter((filePath) => [".json", ".csv"].includes(path.extname(filePath).toLowerCase()));

const knownEntityNames = new Map(
  Object.keys(entityMap.entities).map((entityName) => [
    entityName.replace(/[^a-z0-9]/gi, "").toLowerCase(),
    entityName,
  ]),
);

const inspections = [];
const errors = [];

for (const filePath of supportedFiles) {
  try {
    const extension = path.extname(filePath).toLowerCase();
    const inspection = extension === ".json"
      ? await inspectJson(filePath)
      : await inspectCsv(filePath);

    const normalizedName = normalizeEntityName(filePath);
    const matchedEntity = knownEntityNames.get(normalizedName) || null;
    inspection.matchedEntity = matchedEntity;
    inspection.target = matchedEntity ? entityMap.entities[matchedEntity].target : null;
    inspections.push(inspection);
  } catch (error) {
    errors.push({
      relativePath: path.relative(absoluteExportDirectory, filePath),
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const matchedEntities = new Set(inspections.map((item) => item.matchedEntity).filter(Boolean));
const missingMappedEntities = Object.keys(entityMap.entities).filter(
  (entityName) => !matchedEntities.has(entityName) && entityMap.entities[entityName].strategy !== "defer",
);
const unknownFiles = inspections.filter((item) => !item.matchedEntity).map((item) => item.relativePath);

const report = {
  generatedAt: new Date().toISOString(),
  sourceDirectory: absoluteExportDirectory,
  mapVersion: entityMap.version,
  supportedFileCount: supportedFiles.length,
  totalRecordCount: inspections.reduce((sum, item) => sum + item.recordCount, 0),
  matchedEntities: [...matchedEntities].sort(),
  missingMappedEntities,
  unknownFiles,
  parseErrors: errors,
  files: inspections,
  verdict: errors.length === 0 ? "REVIEW_REQUIRED" : "FAILED",
  notes: [
    "This validator does not import or modify source data.",
    "Unknown files and missing entities require manual review before transformation.",
    "Record counts, identifiers, timestamps, relationships, money, and file checksums must be reconciled after import.",
  ],
};

const serialized = `${JSON.stringify(report, null, 2)}\n`;
console.log(serialized);

if (writeReport) {
  const reportPath = path.join(absoluteExportDirectory, "cognita-migration-validation-report.json");
  await writeFile(reportPath, serialized, "utf8");
  console.error(`Report written to ${reportPath}`);
}

if (errors.length > 0) process.exitCode = 2;
