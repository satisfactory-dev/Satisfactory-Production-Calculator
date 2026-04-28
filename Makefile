install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@./node_modules/.bin/tsc --skipLibCheck --project ./tsconfig.app.json

generate: generate--skip-checks lint generate--post-build build

generate--skip-checks: generate--skip-checks--update8 generate--skip-checks--version-1 generate--skip-checks--version-1-1 generate--skip-checks--version-1-2 build

generate--skip-checks--update8:
	@DOCSDOTJSON_SEMVER=0.8.3.3 node ./generate-Docs.json.ts en-US

generate--skip-checks--version-1:
	@DOCSDOTJSON_SEMVER=1.0.1.4 node ./generate-Docs.json.ts en-US

generate--skip-checks--version-1-1:
	@DOCSDOTJSON_SEMVER=1.1.2.2 node ./generate-Docs.json.ts en-US

generate--skip-checks--version-1-2:
	@DOCSDOTJSON_SEMVER=1.2.1.0 node ./generate-Docs.json.ts en-US

generate--post-build:
	@./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/oxlint --fix --quiet

generate--validators:
	@node ./generate-validators.ts

lint--tsc:
	@echo 'running syntax check'
	@./node_modules/.bin/tsc --skipLibCheck --project ./tsconfig.app-check.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--oxlint:
	@echo 'checking oxlint for all issues'
	@./node_modules/.bin/oxlint

lint: lint--prettier lint--tsc lint--oxlint

.PHONY: tests
tests:
	@node --test

.PHONY: coverage
coverage:
	@node --experimental-test-coverage --test-coverage-include='${PWD}/lib/**/*.ts' --test

npm-prep: lint tests
	@echo 'building from ./tsconfig.app-npm.json'
	@./node_modules/.bin/tsc --skipLibCheck --project ./tsconfig.app-npm.json
	@npm publish --dry-run
