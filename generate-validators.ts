import type {
	TypeScriptifyConfig,
} from '@satisfactory-dev/ajv-utilities';

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

import type {
	supported_versions,
} from './lib/supported.ts';
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

const specify_types_by_validate_function_name: Partial<{
	[key in supported_versions]: TypeScriptifyConfig[
		'specify_types_by_validate_function_name'
	];
}> = {
	'0.8.3.3': {
		validate22: [
			'numeric_triple',
			'../lib/types.ts',
		],
		validate23: [
			'operand_types',
			'@signpostmarv/intermediary-number',
		],
		validate24: [
			'IntermediaryNumber',
			'@signpostmarv/intermediary-number',
		],
		validate25: [
			'amount_string',
			'@signpostmarv/intermediary-number',
		],
		validate28: [
			'IntermediaryCalculation',
			'@signpostmarv/intermediary-number',
		],
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
			specify_types_by_validate_function_name[semver] || {},
		),
	);
}
