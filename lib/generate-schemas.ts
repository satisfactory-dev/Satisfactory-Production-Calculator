import type {
	SchemaObject,
} from 'ajv/dist/2020.js';

import type {
	recipe_selection_properties_with_defaults,
} from './production-data/types.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

type recipe_selection<
	Version extends supported_versions = supported_versions,
> = SchemaObject & {
	$id: `docs.json.ts--production-planner--lib--${Version}--recipe-selection`,
	type: 'object',
	additionalProperties: false,
	properties: recipe_selection_properties_with_defaults,
};

type production_request<
	Version extends supported_versions = supported_versions,
> = SchemaObject & {
	$id: `docs.json.ts--production-planner--lib--${
		Version
	}--production-request`,
	type: 'object',
	required: ['pool'],
	additionalProperties: false,
	$defs: {
		item_amount_object: {
			type: 'object',
			propertyNames: {
				type: 'string',
				enum: (keyof recipe_selection_properties_with_defaults)[],
			},
			additionalProperties: {

				// oxlint-disable-next-line @stylistic/max-len
				$ref: 'docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/number_arg',
			},
		},
	},
	properties: {
		input: {
			type: 'object',
			minProperties: 1,
			patternProperties: {
				'^(?:Desc|BP|Foundation)_[^.]+_C$': {

					// oxlint-disable-next-line @stylistic/max-len
					$ref: 'docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/number_arg',
				},
			},
		},
		recipe_selection: {
			$ref: `docs.json.ts--production-planner--lib--${
				Version
			}--recipe-selection`,
		},
		pool: {
			$ref: '#/$defs/item_amount_object',
		},
	},
};

export class GenerateSchemas<
	Version extends supported_versions,
> {
	#data: by_version[Version]['ProductionData'];

	#version: Version;

	readonly production_request: production_request;

	readonly recipe_selection: recipe_selection;

	static #instances: WeakMap<
		by_version[supported_versions]['ProductionData'],
		GenerateSchemas<supported_versions>
	> = new WeakMap();

	private constructor(
		version: Version,
		production_data: by_version[Version]['ProductionData'],
	) {
		this.#data = production_data;
		this.#version = version;

		const {
			recipe_selection,
			production_request,
		} = this.#generate_schemas();

		this.recipe_selection = {
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			...recipe_selection,
		};
		this.production_request = {
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			...production_request,
		};
	}

	#generate_schemas() {
		const {
			recipe_selection_enums,
		} = this.#data.data;

		const recipe_selection: recipe_selection = {
			$id: `docs.json.ts--production-planner--lib--${
				this.#version
			}--recipe-selection`,
			type: 'object',
			additionalProperties: false,
			properties: recipe_selection_enums,
		};

		const production_request: production_request = {
			$id: `docs.json.ts--production-planner--lib--${
				this.#version
			}--production-request`,
			type: 'object',
			required: ['pool'],
			additionalProperties: false,
			$defs: {
				item_amount_object: {
					type: 'object',
					propertyNames: {
						type: 'string',
						enum: Object.keys(
							recipe_selection_enums,
						).sort((a, b) => {
							return a.localeCompare(b);
						}),
					},
					additionalProperties: {

						// oxlint-disable-next-line @stylistic/max-len
						$ref: 'docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/number_arg',
					},
				},
			},
			properties: {
				input: {
					type: 'object',
					minProperties: 1,
					patternProperties: {
						'^(?:Desc|BP|Foundation)_[^.]+_C$': {

							// oxlint-disable-next-line @stylistic/max-len
							$ref: 'docs.json.ts--production-planner--lib--CanConvertTypeJsonDefs#/$defs/number_arg',
						},
					},
				},
				recipe_selection: {
					// oxlint-disable-next-line @stylistic/max-len
					$ref: `docs.json.ts--production-planner--lib--${
						this.#version
					}--recipe-selection`,
				},
				pool: {
					$ref: '#/$defs/item_amount_object',
				},
			},
		};

		return {
			recipe_selection,
			production_request,
		};
	}

	static factory<
		Version extends supported_versions,
	>(
		version: Version,
		production_data: by_version[Version]['ProductionData'],
	): GenerateSchemas<Version> {
		let existing = this.#instances.get(production_data);

		if (!existing) {
			existing = new this(version, production_data);
			this.#instances.set(production_data, existing);
		}

		return existing as GenerateSchemas<Version>;
	}
}
