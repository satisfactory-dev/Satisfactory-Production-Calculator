# Satisfactory Production Calculator

Production Calculator for Satisfactory built upon [Docs.json.ts](https://github.com/Satisfactory-Clips-Archive/Docs.json.ts).

## Using

### Requirements

-   Docker
    -   vscode recommended to use devcontainer support
-   A copy of Update 's `Docs.json` file

### Setup

1. Checkout locally
1. Load in devcontainer-supporting IDE
    - devcontainer setup should automatically run `make install`
    - `NODE_OPTIONS` env var may require opening a fresh terminal if you
      receieve an error along the lines of
      `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`
1. Copy `Docs.json` to `./data/`
1. Run `make generate`
1. Run `make generate--validators` (needed to build the typescript definition file for the Ajv validator)

## Documentation

No documentation as of yet 😬

Please refer to the tests in the meantime.

## Issues

Issue tracker for both the calculator and the UI built atop the calculator are [available on GitHub](https://github.com/users/SignpostMarv/projects/1).

## Implementations

-   [SignpostMarv's Experimental Production Planner](https://tools.satisfactory.video/experimental-production-planner/)
