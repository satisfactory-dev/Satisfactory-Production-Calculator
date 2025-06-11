install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

generate: generate--skip-checks lint generate--post-build build

generate--skip-checks: generate--skip-checks--common generate--skip-checks--update8 generate--skip-checks--version-1 generate--skip-checks--version-1-1 build

generate--skip-checks--common:
	@echo 'running ./generate-common-types.ts'
	@./node_modules/.bin/ts-node ./generate-common-types.ts

generate--skip-checks--update8:
	@echo 'running ./generate-Docs.json.ts'
	@./node_modules/.bin/ts-node ./generate-Docs.json.ts

generate--skip-checks--version-1:
	@echo 'running ./generate-Docs.json-version-1.ts'
	@./node_modules/.bin/ts-node ./generate-Docs.json-version-1.ts

generate--skip-checks--version-1-1:
	@echo 'running ./generate-Docs.json-version-1-1.ts'
	@./node_modules/.bin/ts-node ./generate-Docs.json-version-1-1.ts

generate--post-build:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/eslint \
		--config ./eslint.config.generated-types.mjs \
		--cache-location ./generated-types/.eslintcache \
		--cache-strategy content \
		--cache \
		'./generated-types/**/*.ts'

generate--validators: build
	@./node_modules/.bin/ts-node ./generate-validators.ts
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly ./validator/update8/production_request_schema.mjs --outDir ./validator/update8/
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly ./validator/1.0/production_request_schema.mjs --outDir ./validator/1.0/

lint--tsc:
	@echo 'running syntax check'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-check.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--eslint:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.eslint.json
	@echo 'checking eslint for all issues with config'
	@./node_modules/.bin/eslint --config eslint.config.js.mjs --cache './**/eslint.config*.mjs'
	@echo 'checking eslint for all issues'
	@./node_modules/.bin/eslint --cache './**/*.ts' --ignore-pattern 'generated-types'

lint: lint--prettier lint--tsc lint--eslint

.PHONY: tests
tests: build
	@./node_modules/.bin/ts-node ./tests.ts

tests--only-unstaged: build
	@./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

.PHONY: coverage
coverage: build
	@./node_modules/.bin/c8 ./node_modules/.bin/ts-node ./tests.ts

coverage--only-unstaged: build
	@./node_modules/.bin/c8 ./node_modules/.bin/ts-node ./tests--only-these.ts '$(shell git diff HEAD --name-only)'

npm-prep: lint tests
	@echo 'building from ./tsconfig.app-npm.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-npm.json
	@npm publish --dry-run
