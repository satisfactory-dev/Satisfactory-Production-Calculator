import Ajv from "ajv/dist/2020";
import standalone from 'ajv/dist/standalone';
import {
	writeFile,
} from 'node:fs/promises';
import production_ingredients_request_schema from
	'./generated-schemas/production-ingredients-request.json' with {type: 'json'};
import recipe_selection_schema from
	'./generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';

const __dirname = __dirname_from_meta(import.meta);

const ajv = new Ajv({
	verbose: true,
	code: {
		source: true,
		es5: false,
		esm: true,
		optimize: true,
	},
});
ajv.addSchema(recipe_selection_schema);

await writeFile(
	`${__dirname}/validator/production_ingredients_request_schema.mjs`,
	standalone(
		ajv,
		ajv.compile(production_ingredients_request_schema)
	).replace(/^"use strict";/, [
		'"use strict";',
		/*
		* adapted from solution on stackoverflow
		* https://stackoverflow.com/a/77047149/23528553
		*/
		'import { createRequire } from "module";',
		'const require = createRequire(import.meta.url);',
	].join(''))
);
