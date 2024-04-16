install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app.json

clean:
	@echo 'running ./clean.ts'
	@./node_modules/.bin/ts-node ./clean.ts

generate: lint generate--skip-checks generate--post-build

generate--skip-checks: build
	@echo 'running ./generate-Docs.json.ts'
	@./node_modules/.bin/ts-node ./generate-Docs.json.ts

generate--post-build:
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/eslint \
		--config ./generated-types/.eslintrc.json \
		--cache-location ./generated-types/update8/.eslintcache \
		--cache \
		./generated-types/

lint--tsc:
	@echo 'running syntax check'
	@NODE_OPTIONS='' ./node_modules/.bin/tsc --project ./tsconfig.app-check.json

lint--prettier:
	@echo 'running prettier'
	@./node_modules/.bin/prettier . --check

lint--eslint:
	@echo 'checking eslint for fixable issues'
	@./node_modules/.bin/eslint --cache './*.ts' --fix-dry-run
	@echo 'checking eslint for all issues'
	@./node_modules/.bin/eslint --cache './*.ts'

lint: lint--prettier lint--tsc lint--eslint

lint-fix:
	@echo 'fixing prettier issues'
	@./node_modules/.bin/prettier . --write
	@echo 'fixing eslint issues'
	@./node_modules/.bin/eslint --cache './*.ts' --fix

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
