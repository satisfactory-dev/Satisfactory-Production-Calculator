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
	instance as u8_production_data,
} from './tests/utilities/production-data';
import {
	instance as v1_production_data,
} from './tests/utilities/production-data-1.0';
import {
	instance as v1p1_production_data,
} from './tests/utilities/production-data-1.1';

const __dirname = import.meta.dirname;

await writeFile(
	`${__dirname}/validator/update8/production_request_schema.mjs`,
	GenerateValidators.toStandalone(
		GenerateSchemas.factory(u8_production_data),
		new Ajv({
			verbose: false,
			logger: false,
			allErrors: true,
			code: {
				source: true,
				esm: true,
				lines: true,
				optimize: 2,
			},
		}),
	),
);

await writeFile(
	`${__dirname}/validator/1.0/production_request_schema.mjs`,
	GenerateValidators.toStandalone(
		GenerateSchemas.factory(v1_production_data),
		new Ajv({
			verbose: false,
			logger: false,
			allErrors: true,
			code: {
				source: true,
				esm: true,
				lines: true,
				optimize: 2,
			},
		}),
	),
);

await writeFile(
	`${__dirname}/validator/1.1/production_request_schema.mjs`,
	GenerateValidators.toStandalone(
		GenerateSchemas.factory(v1p1_production_data),
		new Ajv({
			verbose: false,
			logger: false,
			allErrors: true,
			code: {
				source: true,
				esm: true,
				lines: true,
				optimize: 2,
			},
		}),
	),
);
