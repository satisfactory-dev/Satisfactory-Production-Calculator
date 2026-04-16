install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@./node_modules/.bin/tsc --skipLibCheck --project ./tsconfig.app.json

generate: generate--skip-checks lint generate--post-build build

generate--skip-checks: generate--skip-checks--update8 generate--skip-checks--version-1 generate--skip-checks--version-1-1 generate--skip-checks--version-1-2 build

generate--skip-checks--update8:
	@echo 'running ./generate-Docs.json.ts'
	@node ./generate-Docs.json.ts en-US --skip-types

generate--skip-checks--version-1:
	@echo 'running ./generate-Docs.json-version-1.ts'
	@node ./generate-Docs.json-version-1.ts en-US --skip-types

generate--skip-checks--version-1-1:
	@echo 'running ./generate-Docs.json-version-1-1.ts'
	@node ./generate-Docs.json-version-1-1.ts en-US --skip-types

generate--skip-checks--version-1-2:
	@echo 'running ./generate-Docs.json-version-1-2.ts'
	@node ./generate-Docs.json-version-1-2.ts en-US --skip-types

generate--post-build:
	@./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/oxlint --fix --quiet

generate--validators:
	@node ./generate-validators.ts
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/update8/production_request_schema.mjs --outDir ./validator/update8/
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/1.0/production_request_schema.mjs --outDir ./validator/1.0/
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/1.1/production_request_schema.mjs --outDir ./validator/1.1/
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/1.2/production_request_schema.mjs --outDir ./validator/1.2/

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
