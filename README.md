# Satisfactory Production Calculator

Production Calculator for Satisfactory built upon [Docs.json.ts](https://github.com/satisfactory-dev/Docs.json.ts).

## Using

### Requirements

- Docker
    - vscode recommended to use devcontainer support
- A copy of Update 's `Docs.json` file

### Setup

1. Checkout locally
1. Load in devcontainer-supporting IDE
    - devcontainer setup should automatically run `make install`
    - `NODE_OPTIONS` env var may require opening a fresh terminal if you
      receieve an error along the lines of
      `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`
1. Copy the game's Docs export for each version you want to support to
   `./data/<version>/Docs/`, converted to UTF-8:
    - `0.8.3.3`: `Docs.utf8.json` (from `CommunityResources/Docs/Docs.json`)
    - `1.0.1.4`, `1.1.2.2`, `1.2.2.0`: `en-US.utf8.json`
      (from `CommunityResources/Docs/en-US.json`)
    - the game ships these files as UTF-16LE; convert with e.g.
      `iconv -f UTF-16 -t UTF-8 en-US.json > en-US.utf8.json`
1. Run `make generate`
1. Run `make generate--validators` (needed to build the typescript definition file for the Ajv validator)

### Working with a single game version

`make generate` and `make generate--validators` expect Docs exports for
every supported version. If you only have one, use the single-version
targets instead, e.g. for 1.2:

```sh
make generate--version--1-2
```

This runs the data generation and validator generation for that version
only. The other variants are `generate--version--update8`,
`generate--version--1` and `generate--version--1-1`. Tests that depend on
missing versions will fail; the rest run normally.

## Documentation

No documentation as of yet 😬

Please refer to the tests in the meantime.

## Issues

Issue tracker for both the calculator and the UI built atop the calculator are [available on GitHub](https://github.com/orgs/satisfactory-dev/projects/1).

## Implementations

- [SignpostMarv's Experimental Production Planner](https://u8.satisfactory.dev/planner/)
