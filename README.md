# Asana Task Status Updater GitHub Action

This GitHub Action updates the status of Asana tasks based on pull request events in your GitHub repository. It supports updating the task status to "CODE REVIEW" when a pull request is opened or reopened, and to "READY FOR QA" when a pull request review is approved.

## Prerequisites

Before using this GitHub Action, ensure you have the following:

1. An Asana account.
2. Asana tasks with custom fields for status, specifically with the options "CODE REVIEW" and "READY FOR QA".
3. A GitHub repository where you want to use this action.

## Setup

1. **Create Asana Custom Fields**:
   - In your Asana project, create a custom field named "Dev Status" (or "Status").
   - Add the following options to this custom field:
     - CODE REVIEW
     - READY FOR QA

2. **Generate Asana Personal Access Token**:
   - Go to your Asana account settings and generate a personal access token. This token will be used to authenticate API requests. [Generate Token](https://app.asana.com/0/my-apps)

3. **Add Secrets to GitHub**:
   - In your GitHub repository, go to `Settings` > `Secrets` and add the following secrets:
     - `ASANA_TOKEN`: Your Asana personal access token.

## Usage

To use this GitHub Action, create a workflow file in your GitHub repository (e.g., `.github/workflows/asana-task-status-updater.yml`).

### Example Workflow

```yaml
name: Asana Task Status Updater

on:
  pull_request:
    types: [opened, reopened]
  pull_request_review:

jobs:
  change-dev-status:
    runs-on: ubuntu-latest
    steps:
      - uses: nennogabriel/asana-gh-custom-act@v1.0.0
        with:
          asana-token: ${{ secrets.ASANA_TOKEN }}
              
            