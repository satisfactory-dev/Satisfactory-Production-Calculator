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
	verbose: false,
	logger: false,
	allErrors: true,
	code: {
		source: true,
		esm: true,
		lines: true,
		optimize: 2,
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
		`import fast_deep_equal from 'fast-deep-equal';`,
	].join('')).replace(
		'require("ajv/dist/runtime/equal").default',
		'fast_deep_equal'
	)
);
