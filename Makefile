install:
	@NODE_OPTIONS='' npm install

build:
	@echo 'building from ./tsconfig.app.json'
	@./node_modules/.bin/tsc --skipLibCheck --project ./tsconfig.app.json

generate: generate--skip-checks lint generate--post-build build

generate--skip-checks: generate--skip-checks--update8 generate--skip-checks--version-1 generate--skip-checks--version-1-1 build

generate--skip-checks--update8:
	@echo 'running ./generate-Docs.json.ts'
	@node ./generate-Docs.json.ts en-US --skip-types

generate--skip-checks--version-1:
	@echo 'running ./generate-Docs.json-version-1.ts'
#	@node ./generate-Docs.json-version-1.ts af --skip-types
#	@node ./generate-Docs.json-version-1.ts ar --skip-types
#	@node ./generate-Docs.json-version-1.ts bg --skip-types
#	@node ./generate-Docs.json-version-1.ts ca --skip-types
#	@node ./generate-Docs.json-version-1.ts cs --skip-types
#	@node ./generate-Docs.json-version-1.ts da --skip-types
#	@node ./generate-Docs.json-version-1.ts de --skip-types
#	@node ./generate-Docs.json-version-1.ts el --skip-types
#	@node ./generate-Docs.json-version-1.ts en-AE --skip-types
#	@node ./generate-Docs.json-version-1.ts en-AU --skip-types
#	@node ./generate-Docs.json-version-1.ts en-CA --skip-types
#	@node ./generate-Docs.json-version-1.ts en-GB --skip-types
	@node ./generate-Docs.json-version-1.ts en-US --skip-types
#	@node ./generate-Docs.json-version-1.ts eo --skip-types
#	@node ./generate-Docs.json-version-1.ts es-419 --skip-types
#	@node ./generate-Docs.json-version-1.ts es-ES --skip-types
#	@node ./generate-Docs.json-version-1.ts et --skip-types
#	@node ./generate-Docs.json-version-1.ts fa --skip-types
#	@node ./generate-Docs.json-version-1.ts fi --skip-types
#	@node ./generate-Docs.json-version-1.ts fr --skip-types
#	@node ./generate-Docs.json-version-1.ts he --skip-types
#	@node ./generate-Docs.json-version-1.ts hi --skip-types
#	@node ./generate-Docs.json-version-1.ts hr --skip-types
#	@node ./generate-Docs.json-version-1.ts hu --skip-types
#	@node ./generate-Docs.json-version-1.ts ia-001 --skip-types
#	@node ./generate-Docs.json-version-1.ts id --skip-types
#	@node ./generate-Docs.json-version-1.ts ie --skip-types
#	@node ./generate-Docs.json-version-1.ts io --skip-types
#	@node ./generate-Docs.json-version-1.ts it --skip-types
#	@node ./generate-Docs.json-version-1.ts ja --skip-types
#	@node ./generate-Docs.json-version-1.ts ko --skip-types
#	@node ./generate-Docs.json-version-1.ts kw --skip-types
#	@node ./generate-Docs.json-version-1.ts lb --skip-types
#	@node ./generate-Docs.json-version-1.ts lt --skip-types
#	@node ./generate-Docs.json-version-1.ts lv --skip-types
#	@node ./generate-Docs.json-version-1.ts mt --skip-types
#	@node ./generate-Docs.json-version-1.ts nl --skip-types
#	@node ./generate-Docs.json-version-1.ts no --skip-types
#	@node ./generate-Docs.json-version-1.ts pl --skip-types
#	@node ./generate-Docs.json-version-1.ts pt-BR --skip-types
#	@node ./generate-Docs.json-version-1.ts pt-PT --skip-types
#	@node ./generate-Docs.json-version-1.ts ro --skip-types
#	@node ./generate-Docs.json-version-1.ts ru --skip-types
#	@node ./generate-Docs.json-version-1.ts sk --skip-types
#	@node ./generate-Docs.json-version-1.ts sr-Cyrl --skip-types
#	@node ./generate-Docs.json-version-1.ts sr-Latn --skip-types
#	@node ./generate-Docs.json-version-1.ts sv --skip-types
#	@node ./generate-Docs.json-version-1.ts th --skip-types
#	@node ./generate-Docs.json-version-1.ts tr --skip-types
#	@node ./generate-Docs.json-version-1.ts uk --skip-types
#	@node ./generate-Docs.json-version-1.ts vi --skip-types
#	@node ./generate-Docs.json-version-1.ts vo --skip-types
#	@node ./generate-Docs.json-version-1.ts vun --skip-types
#	@node ./generate-Docs.json-version-1.ts zh-Hans --skip-types
#	@node ./generate-Docs.json-version-1.ts zh-Hant --skip-types

generate--skip-checks--version-1-1:
	@echo 'running ./generate-Docs.json-version-1-1.ts'
#	@node ./generate-Docs.json-version-1-1.ts af --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ar --skip-types
#	@node ./generate-Docs.json-version-1-1.ts bg --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ca --skip-types
#	@node ./generate-Docs.json-version-1-1.ts cs --skip-types
#	@node ./generate-Docs.json-version-1-1.ts da --skip-types
#	@node ./generate-Docs.json-version-1-1.ts de --skip-types
#	@node ./generate-Docs.json-version-1-1.ts el --skip-types
#	@node ./generate-Docs.json-version-1-1.ts en-AE --skip-types
#	@node ./generate-Docs.json-version-1-1.ts en-AU --skip-types
#	@node ./generate-Docs.json-version-1-1.ts en-CA --skip-types
#	@node ./generate-Docs.json-version-1-1.ts en-GB --skip-types
	@node ./generate-Docs.json-version-1-1.ts en-US --skip-types
#	@node ./generate-Docs.json-version-1-1.ts eo --skip-types
#	@node ./generate-Docs.json-version-1-1.ts es-419 --skip-types
#	@node ./generate-Docs.json-version-1-1.ts es-ES --skip-types
#	@node ./generate-Docs.json-version-1-1.ts et --skip-types
#	@node ./generate-Docs.json-version-1-1.ts fa --skip-types
#	@node ./generate-Docs.json-version-1-1.ts fi --skip-types
#	@node ./generate-Docs.json-version-1-1.ts fr --skip-types
#	@node ./generate-Docs.json-version-1-1.ts he --skip-types
#	@node ./generate-Docs.json-version-1-1.ts hi --skip-types
#	@node ./generate-Docs.json-version-1-1.ts hr --skip-types
#	@node ./generate-Docs.json-version-1-1.ts hu --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ia-001 --skip-types
#	@node ./generate-Docs.json-version-1-1.ts id --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ie --skip-types
#	@node ./generate-Docs.json-version-1-1.ts io --skip-types
#	@node ./generate-Docs.json-version-1-1.ts it --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ja --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ko --skip-types
#	@node ./generate-Docs.json-version-1-1.ts kw --skip-types
#	@node ./generate-Docs.json-version-1-1.ts lb --skip-types
#	@node ./generate-Docs.json-version-1-1.ts lt --skip-types
#	@node ./generate-Docs.json-version-1-1.ts lv --skip-types
#	@node ./generate-Docs.json-version-1-1.ts mt --skip-types
#	@node ./generate-Docs.json-version-1-1.ts nl --skip-types
#	@node ./generate-Docs.json-version-1-1.ts no --skip-types
#	@node ./generate-Docs.json-version-1-1.ts pl --skip-types
#	@node ./generate-Docs.json-version-1-1.ts pt-BR --skip-types
#	@node ./generate-Docs.json-version-1-1.ts pt-PT --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ro --skip-types
#	@node ./generate-Docs.json-version-1-1.ts ru --skip-types
#	@node ./generate-Docs.json-version-1-1.ts sk --skip-types
#	@node ./generate-Docs.json-version-1-1.ts sr-Cyrl --skip-types
#	@node ./generate-Docs.json-version-1-1.ts sr-Latn --skip-types
#	@node ./generate-Docs.json-version-1-1.ts sv --skip-types
#	@node ./generate-Docs.json-version-1-1.ts th --skip-types
#	@node ./generate-Docs.json-version-1-1.ts tr --skip-types
#	@node ./generate-Docs.json-version-1-1.ts uk --skip-types
#	@node ./generate-Docs.json-version-1-1.ts vi --skip-types
#	@node ./generate-Docs.json-version-1-1.ts vo --skip-types
#	@node ./generate-Docs.json-version-1-1.ts vun --skip-types
#	@node ./generate-Docs.json-version-1-1.ts zh-Hans --skip-types
#	@node ./generate-Docs.json-version-1-1.ts zh-Hant --skip-types

generate--post-build:
	@./node_modules/.bin/tsc --project ./tsconfig.generated-types-check.json
	@./node_modules/.bin/oxlint --fix --quiet

generate--validators:
	@node ./generate-validators.ts
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/update8/production_request_schema.mjs --outDir ./validator/update8/
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/1.0/production_request_schema.mjs --outDir ./validator/1.0/
	@./node_modules/.bin/tsc --allowJs --declaration --emitDeclarationOnly --skipLibCheck ./validator/1.1/production_request_schema.mjs --outDir ./validator/1.1/

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
