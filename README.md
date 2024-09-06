# Asana GitHub Custom Action

This GitHub Action integrates with Asana, automating workflows triggered by GitHub events such as pull requests. It is built using TypeScript, leveraging the GitHub Actions API and Asana API.

## Table of Contents

- [Setup](#setup)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)

## Setup

### 1. Create Asana Personal Access Token

To use this action, you need an Asana Personal Access Token.

1. Go to your Asana account settings.
2. Navigate to the **Developer Apps** tab.
3. Create a new personal access token.

Make sure to store this token as a secret in your GitHub repository.

### 2. Add the Asana Token to GitHub Secrets

1. Go to your GitHub repository.
2. Click on **Settings** > **Secrets and Variables** > **Actions**.
3. Add a new secret called `ASANA_SECRET` and paste the Asana Personal Access Token.

## Installation

To add this action to your workflow, include it in your `.github/workflows` directory. Create or modify a workflow YAML file.

For example:

```yaml
name: Asana Integration
on:
  pull_request:
    types: [opened, reopened]
  pull_request_review:
    types: [submitted]

jobs:
  asana-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./
        with:
          asana-token: ${{ secrets.ASANA_SECRET }}
```

### Workflow Explanation:

- **`on.pull_request.types`**: This triggers the action when a pull request is opened or reopened.
- **`on.pull_request_review.types`**: This triggers the action when a pull request review is submitted.
- **`uses: actions/checkout@v4`**: Checks out the repository content so the Action can access it.
- **`uses: ./`**: Uses the current repository's custom action.
- **`with.asana-token`**: Passes the Asana token stored in GitHub Secrets.

## Configuration

You can pass input values to customize the behavior of the action. In the example above, the action accepts the following input:

- **`asana-token`**: This is the personal access token generated from Asana. It is required for authenticating API calls to Asana.

You may add additional inputs as needed by extending the code in `index.js` or modifying the workflow file.

## Development

### Building

The project is written in TypeScript. To build the code, run:

```
npm run build
```

This will compile the TypeScript code and bundle it using `@vercel/ncc`.

### Code Quality

The project uses `eslint` and `prettier` for linting and code formatting. Before committing, it's a good practice to run the linter:

```
npm run lint
```

You can also use `husky` and `lint-staged` for pre-commit hooks to automatically format and lint code on commit.

### Testing

The project uses `jest` for unit testing. To run the tests, execute:

```
npm run test
```

You can add more tests to ensure the reliability of the Action by writing additional unit tests in the `__tests__` directory.
