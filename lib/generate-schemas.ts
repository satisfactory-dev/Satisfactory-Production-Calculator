import {
	ProductionData,
} from './production-data';

export function generate_schemas(
	production_data: ProductionData
) {
	const {
		recipe_selection_enums,
	} = production_data.data;

	const recipe_selection = {
		type: 'object',
		additionalProperties: false,
		properties: recipe_selection_enums,
	};

	const production_request = {
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
					enum: Object.keys(recipe_selection_enums).sort((a, b) => {
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
					type: {type: 'string', const: 'IntermediaryCalculation'},
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
