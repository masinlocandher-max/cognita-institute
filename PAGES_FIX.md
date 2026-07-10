# GitHub Pages deployment fix

This repository is a Vite application and must be built before GitHub Pages can serve it.

The deployment now:

- builds the application into `dist`
- serves assets from `/cognita-institute/`
- uses hash-based routing only for GitHub Pages
- preserves browser routing for Base44 and local development
- deploys through the official GitHub Pages Actions workflow

This file may be removed after the first successful Pages deployment.
