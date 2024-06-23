import Ajv from "ajv/dist/2020";
import standalone from 'ajv/dist/standalone';
import {
	writeFile,
} from 'node:fs/promises';
import production_request_schema from
	// eslint-disable-next-line max-len
	'./generated-schemas/production-request.json' with {type: 'json'};
import recipe_selection_schema from
	'./generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';
import {
	esmify,
} from '@satisfactory-clips-archive/docs.json.ts/lib/AjvUtilities';

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
	`${__dirname}/validator/production_request_schema.mjs`,
	esmify(standalone(
		ajv,
		ajv.compile(production_request_schema)
	))
);
