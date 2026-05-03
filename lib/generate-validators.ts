import type {
	Ajv2020,
} from 'ajv/dist/2020.js';

import standalone from 'ajv/dist/standalone/index.js';

import type {
	Is,
} from '@satisfactory-dev/ajv-utilities';
import {
	typescriptify,
} from '@satisfactory-dev/ajv-utilities';

import type {
	production_request,
	recipe_selection,
} from './types.ts';

import type {
	GenerateSchemas,
} from './generate-schemas.ts';

import type {
	supported_versions,
} from './supported.ts';

// oxlint-disable-next-line @stylistic/max-len
import CanConvertTypeJsonDefs from '../schema/CanConvertTypeJsonDefs.json' with {
	type: 'json',
};

export class GenerateValidators {
	readonly validation_function: Is<
		production_request
	>;

	static #ajv_instances: WeakMap<
		GenerateSchemas<supported_versions>,
		WeakMap<
			Ajv2020,
			GenerateValidators
		>
	> = new WeakMap();

	private constructor(
		validation_function: Is<
			production_request
		>,
	) {
		this.validation_function = validation_function;
	}

	static #compile(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
	) {
		const {
			production_request,
			recipe_selection,
		} = schemas;

		ajv.addSchema(CanConvertTypeJsonDefs);
		ajv.addSchema(recipe_selection);

		return ajv.compile(production_request);
	}

	static fromCompile(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
	): GenerateValidators {
		let existing_outter = this.#ajv_instances.get(schemas);

		if (!existing_outter) {
			existing_outter = new WeakMap();
			this.#ajv_instances.set(schemas, existing_outter);
		}

		let existing = existing_outter.get(ajv);

		if (!existing) {
			existing = new this(this.#compile(schemas, ajv));
			existing_outter.set(ajv, existing);
		}

		return existing;
	}

	static async fromStandalone(module: Promise<{
		recipe_selection_validator: Is<recipe_selection>,
		production_request_validator: Is<production_request>,
	}>) {
		return new this((await module).production_request_validator);
	}

	static toStandalone(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
	): string {
		ajv.addSchema(CanConvertTypeJsonDefs);
		ajv.addSchema(schemas.recipe_selection);
		ajv.addSchema(schemas.production_request);


		const from_self = '@satisfactory-dev/docs.json.ts-production-planner';

		return typescriptify(
			standalone(
				ajv,
				{
					recipe_selection_validator: schemas.recipe_selection.$id,

					// oxlint-disable-next-line @stylistic/max-len
					production_request_validator: schemas.production_request.$id,
				},
			),
			{
				specify_types: {
					[schemas.recipe_selection.$id]: [
						'recipe_selection',
						from_self,
					],
					[schemas.production_request.$id]: [
						'production_request',
						from_self,
						[
							[
								{
									name: 'production_request',
									sub_type_chain: ['pool'],
								},
								from_self,
								{
									instancePath_partial: '/pool',
									parentDataProperty: 'pool',
								},
							],
							[
								'number_arg_json',
								from_self,
								{
									instancePath_partial: '/input/',
									parentDataProperty: null,
								},
								[
									[
										'CanConvertTypeJson',
										from_self,
										{
											instancePath: null,
											parentDataProperty: null,
										},
										[
											[
												'IntermediaryCalculation',
												from_self,
												{
													instancePath: null,
													parentDataProperty: null,
												},
											],
										],
									],
								],
							],
						],
					],
				},
				specify_types_by_inside_out_match: [
					[
						{
							name: 'IntermediaryNumber',
							sub_type_chain: ['value'],
						},
						'@satisfactory-dev/intermediary-number',
						{
							instancePath_partial: '/value',
							parentDataProperty: 'value',
						},
						[
							'IntermediaryNumber',
							'@satisfactory-dev/intermediary-number',
						],
					],
				],
			},
		);
	}
}
