import {
	SchemaObject,
} from 'ajv/dist/2020';

import {
	object_keys,
} from '@satisfactory-dev/predicates.ts';

import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel';

import {
	ProductionData,
} from './production-data';
import {
	recipe_selection_properties_with_defaults,
} from './production-data/types';

type recipe_selection = SchemaObject & {
	type: 'object',
	additionalProperties: false,
	properties: recipe_selection_properties_with_defaults,
};

type production_request = SchemaObject & {
	type: 'object',
	required: ['pool'],
	additionalProperties: false,
	$defs: {
		amount_string: {
			type: 'string',
			pattern: string,
		},
		amount_string_flexible: {
			oneOf: [
				{$ref: '#/$defs/amount_string'},
				{
					type: 'string',
					pattern: string,
				},
				{
					type: 'string',
					pattern: string,
				},
			],
		},
		numeric_string: {
			type: 'string',
			pattern: string,
		},
		number_arg: {
			oneOf: [
				{type: 'number', minimum: 0, multipleOf: 0.000001},
				{$ref: '#/$defs/amount_string'},
				{$ref: '#/$defs/CanConvertTypeJson'},
			],
		},
		item_amount_object: {
			type: 'object',
			propertyNames: {
				type: 'string',
				enum: (keyof recipe_selection_properties_with_defaults)[],
			},
			additionalProperties: {
				$ref: '#/$defs/number_arg',
			},
		},
		IntermediaryNumber: {
			type: 'object',
			required: ['type', 'value'],
			additionalProperties: false,
			properties: {
				type: {type: 'string', const: 'IntermediaryNumber'},
				value: {
					oneOf: [
						{$ref: '#/$defs/amount_string_flexible'},
						{$ref: '#/$defs/numeric_string'},
						{
							type: 'string',
							pattern: string,
						},
					],
				},
			},
		},
		IntermediaryCalculation: {
			type: 'object',
			required: ['type', 'left', 'operation', 'right'],
			additionalProperties: false,
			properties: {
				type: {
					type: 'string',
					const: 'IntermediaryCalculation',
				},
				left: {$ref: '#/$defs/CanConvertTypeJson'},
				operation: {
					type: 'string',
					enum: [
						'+',
						'-',
						'*',
						'x',
						'/',
						'%',
					],
				},
				right: {$ref: '#/$defs/CanConvertTypeJson'},
			},
		},
		TokenScan: {
			type: 'object',
			required: ['type', 'value'],
			additionalProperties: false,
			properties: {
				type: {type: 'string', const: 'TokenScan'},
				value: {type: 'string'},
			},
		},
		CanConvertTypeJson: {
			oneOf: [
				{$ref: '#/$defs/IntermediaryNumber'},
				{$ref: '#/$defs/IntermediaryCalculation'},
				{$ref: '#/$defs/TokenScan'},
			],
		},
	},
	properties: {
		input: {
			type: 'object',
			minProperties: 1,
			patternProperties: {
				"^(?:Desc|BP|Foundation)_[^.]+_C$": {
					$ref: '#/$defs/number_arg',
				},
			},
		},
		recipe_selection: {
			$ref: 'recipe-selection',
		},
		pool: {
			$ref: '#/$defs/item_amount_object',
		},
	},
};

export class GenerateSchemas<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = (
		| FGPowerShardDescriptor__type
		| undefined
	),
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	) = (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	),
>
{
	#data:ProductionData<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel
	>;

	readonly production_request: production_request;
	readonly recipe_selection: recipe_selection;

	static #instances:WeakMap<
		ProductionData<
			(
				| FGPowerShardDescriptor__type
				| undefined
			),
			(
				| FGItemDescriptorPowerBoosterFuel__type
				| undefined
			)
		>,
		GenerateSchemas<
			(
				| FGPowerShardDescriptor__type
				| undefined
			),
			(
				| FGItemDescriptorPowerBoosterFuel__type
				| undefined
			)
		>
	> = new WeakMap();

	private constructor(
		production_data: ProductionData<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel
		>,
	)
	{
		this.#data = production_data;
		const {
			recipe_selection,
			production_request,
		} = this.#generate_schemas();

		this.recipe_selection = {
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'recipe-selection',
			...recipe_selection,
		};
		this.production_request = {
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'production-request',
			...production_request,
		};
	}

	#generate_schemas()
	{
		const {
			recipe_selection_enums,
		} = this.#data.data;

		const recipe_selection:recipe_selection = {
			type: 'object',
			additionalProperties: false,
			properties: recipe_selection_enums,
		};

		const production_request:production_request = {
			type: 'object',
			required: ['pool'],
			additionalProperties: false,
			$defs: {
				amount_string: {
					type: 'string',
					pattern: '^\\d+(?:\\.\\d{1,6})?$',
				},
				amount_string_flexible: {
					oneOf: [
						{$ref: '#/$defs/amount_string'},
						{
							type: 'string',
							pattern: '^\\d*(?:\\.\\d{1,6})$',
						},
						{
							type: 'string',
							pattern: '^\\d+$',
						},
					],
				},
				numeric_string: {
					type: 'string',
					pattern: '^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$',
				},
				number_arg: {
					oneOf: [
						{type: 'number', minimum: 0, multipleOf: 0.000001},
						{$ref: '#/$defs/amount_string'},
						{$ref: '#/$defs/CanConvertTypeJson'},
					],
				},
				item_amount_object: {
					type: 'object',
					propertyNames: {
						type: 'string',
						enum: object_keys(
							recipe_selection_enums,
						).sort((a, b) => {
							return a.localeCompare(b);
						}),
					},
					additionalProperties: {
						$ref: '#/$defs/number_arg',
					},
				},
				IntermediaryNumber: {
					type: 'object',
					required: ['type', 'value'],
					additionalProperties: false,
					properties: {
						type: {type: 'string', const: 'IntermediaryNumber'},
						value: {
							oneOf: [
								{$ref: '#/$defs/amount_string_flexible'},
								{$ref: '#/$defs/numeric_string'},
								{
									type: 'string',
									// eslint-disable-next-line max-len
									pattern: '^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$',
								},
							],
						},
					},
				},
				IntermediaryCalculation: {
					type: 'object',
					required: ['type', 'left', 'operation', 'right'],
					additionalProperties: false,
					properties: {
						type: {
							type: 'string',
							const: 'IntermediaryCalculation',
						},
						left: {$ref: '#/$defs/CanConvertTypeJson'},
						operation: {
							type: 'string',
							enum: [
								'+',
								'-',
								'*',
								'x',
								'/',
								'%',
							],
						},
						right: {$ref: '#/$defs/CanConvertTypeJson'},
					},
				},
				TokenScan: {
					type: 'object',
					required: ['type', 'value'],
					additionalProperties: false,
					properties: {
						type: {type: 'string', const: 'TokenScan'},
						value: {type: 'string'},
					},
				},
				CanConvertTypeJson: {
					oneOf: [
						{$ref: '#/$defs/IntermediaryNumber'},
						{$ref: '#/$defs/IntermediaryCalculation'},
						{$ref: '#/$defs/TokenScan'},
					],
				},
			},
			properties: {
				input: {
					type: 'object',
					minProperties: 1,
					patternProperties: {
						"^(?:Desc|BP|Foundation)_[^.]+_C$": {
							$ref: '#/$defs/number_arg',
						},
					},
				},
				recipe_selection: {
					$ref: 'recipe-selection',
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
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = (
		| FGPowerShardDescriptor__type
		| undefined
	),
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	) = (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	),
	>(production_data: ProductionData<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel
	>)
	{
		let existing = this.#instances.get(production_data);

		if (!existing) {
			existing = new this(production_data);
			this.#instances.set(production_data, existing);
		}

		return existing;
	}
}
