#!/usr/bin/env python3
"""Safely extract the Base44 ZIP export into the repository root.

Run from the repository root:
    python scripts/import_base44_zip.py

The original ZIP is preserved as a backup. Generated folders and local secrets
are excluded from extraction.
"""

from __future__ import annotations

import shutil
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ZIP_NAME = "cognita-ai-academy.zip"
EXCLUDED_TOP_LEVEL = {".git", "node_modules", "dist", "dist-ssr", ".vite"}
EXCLUDED_FILES = {".env", ".env.local", ".env.production", ".DS_Store"}


def safe_member_path(name: str) -> PurePosixPath:
    path = PurePosixPath(name)
    if path.is_absolute() or ".." in path.parts:
        raise ValueError(f"Unsafe ZIP member path: {name}")
    return path


def should_extract(path: PurePosixPath) -> bool:
    if not path.parts:
        return False
    if path.parts[0] in EXCLUDED_TOP_LEVEL:
        return False
    if path.name in EXCLUDED_FILES:
        return False
    return True


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    zip_path = repo_root / ZIP_NAME

    if not zip_path.is_file():
        print(f"Missing {ZIP_NAME} in repository root.", file=sys.stderr)
        return 1

    with tempfile.TemporaryDirectory(prefix="cognita-base44-") as temp_dir:
        temp_root = Path(temp_dir)

        with zipfile.ZipFile(zip_path) as archive:
            members = []
            for info in archive.infolist():
                member_path = safe_member_path(info.filename)
                if should_extract(member_path):
                    members.append(info)
            archive.extractall(temp_root, members=members)

        extracted_files = 0
        for source in temp_root.rglob("*"):
            relative = source.relative_to(temp_root)
            destination = repo_root / relative

            if source.is_dir():
                destination.mkdir(parents=True, exist_ok=True)
                continue

            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            extracted_files += 1

    print(f"Imported {extracted_files} files from {ZIP_NAME}.")
    print("The ZIP was preserved. Review changes, then run npm ci and npm run build.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
