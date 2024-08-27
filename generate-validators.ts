import Ajv from "ajv/dist/2020";
import {
	writeFile,
} from 'node:fs/promises';
import {
	GenerateSchemas,
} from './lib/generate-schemas';
import {
	GenerateValidators,
} from './lib/generate-validators';
import {
	instance as production_data,
} from './tests/utilities/production-data';

const __dirname = import.meta.dirname;

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

await writeFile(
	`${__dirname}/validator/production_request_schema.mjs`,
	GenerateValidators.toStandalone(
		GenerateSchemas.factory(production_data),
		ajv,
	),
);
