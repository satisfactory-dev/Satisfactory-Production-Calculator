install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

generate: generate--skip-checks lint generate--post-build build

generate--skip-checks:
	@echo 'running ./generate-Docs.json.ts'
	@./node_modules/.bin/ts-node ./generate-Docs.json.ts
	@make build

generate--post-build:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/eslint \
		--config ./generated-types/.eslintrc.json \
		--cache-location ./generated-types/update8/.eslintcache \
		--cache-strategy content \
		--cache \
		./generated-types/

generate--validators: build
	@./node_modules/.bin/ts-node ./generate-validators.ts
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly ./validator/production_request_schema.mjs --outDir ./validator/

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

npm-prep: tests
	@echo 'building from ./tsconfig.app-npm.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-npm.json
	@npm publish --dry-run
