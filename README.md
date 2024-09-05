# Asana GitHub Custom Action

## Overview

The **Asana GitHub Custom Action** allows you to interact with the Asana API directly from your GitHub workflows. This action is designed to be triggered manually via the `workflow_dispatch` event, enabling you to integrate Asana tasks, projects, or other functionalities into your CI/CD pipelines.

## Features

- Interact with Asana API
- Manual trigger via GitHub Actions
- Easily configurable with a token

## Table of Contents

- [Asana GitHub Custom Action](#asana-github-custom-action)
  - [Overview](#overview)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Example Workflow](#example-workflow)

## Prerequisites

Before using this action, ensure you have the following:

1. **Asana Personal Access Token**: You need a token from Asana with the necessary permissions to interact with your Asana projects or tasks.

2. **GitHub Repository**: This action needs to be part of a GitHub repository where it will be used in a workflow.

## Setup

1. **Clone or Fork the Repository**

   To use this action, you need to have it available in your GitHub repository. Clone or fork this repository to get started.

2. **Install Dependencies**

   The dependencies are listed in the `package.json`. To install them, run:

   ```
   npm install
   ```

3. **Build the Action**

   Compile the TypeScript code and build the action using:

   ```
   npm run build
   ```

4. **Install Husky Hooks**

   To set up Git hooks, run:

   ```
   npm run prepare
   ```

## Usage

To use this GitHub Action in your workflows, follow these steps:

1. **Add the Action to Your Repository**

   Place the action in your GitHub repository. Typically, this is done by including the action in the `.github/actions` directory.

2. **Create or Update Your Workflow**

   Add the following code to your GitHub Actions workflow file (e.g., `.github/workflows/main.yml`):

   ```
   name: Manual trigger
   on:
     workflow_dispatch:

   jobs:
     hello:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: ./
           with:
             asana-token: ${{ secrets.ASANA_SECRET }}
   ```

## Configuration

In your workflow file, you can configure the action with the following input:

- `asana-token`: Your Asana Personal Access Token. This token should be stored as a secret in your GitHub repository settings. You can add it under **Settings > Secrets and variables > Actions**.

## Example Workflow

Here’s an example of how to set up a GitHub Actions workflow using this action:

```
name: Manual trigger
on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          asana-token: ${{ secrets.ASANA_SECRET }}
```

