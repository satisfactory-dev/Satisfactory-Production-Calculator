import type {
	Options,
} from 'ajv/dist/2020.js';

import Ajv from 'ajv/dist/2020.js';

import {
	writeFile,
} from 'node:fs/promises';

import {
	GenerateSchemas,
} from './lib/generate-schemas.ts';

import {
	GenerateValidators,
} from './lib/generate-validators.ts';

import production_data from './tests/utilities/production-data.ts';

import {
	is_supported_from,
} from './lib/supported.ts';

const ajv_options: Options = {
	verbose: false,
	logger: false,
	allErrors: true,
	code: {
		source: true,
		esm: true,
		lines: true,
		optimize: 2,
	},
};

for (const semver of Object.keys(is_supported_from)) {
	await writeFile(
		`${import.meta.dirname}/validator/${semver}.ts`,
		GenerateValidators.toStandalone(
			GenerateSchemas.factory(
				semver,
				await production_data(semver, 'en-US'),
			),
			new Ajv(ajv_options),
			{
				validate23: [
					'number_arg_json',
					'../lib/types.ts',
				],
				validate24: [
					'CanConvertTypeJson',
					'../lib/types.ts',
				],
				validate25: [
					'IntermediaryNumber',
					'../lib/types.ts',
				],
				validate26: [
					'amount_string_flexible',
					'../lib/types.ts',
				],
				validate29: [
					'IntermediaryCalculation',
					'../lib/types.ts',
				],
				validate33: [
					'production_pool',
					'../lib/types.ts',
				],
			},
		),
	);
}
