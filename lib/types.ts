import {
	CanConvertTypeJson,
	IntermediaryNumber,
	amount_string,
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';
import BigNumber from 'bignumber.js';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};

import {
	buildings,
	items,
	resources,
} from './production-data';

export type recipe_selection_schema_key = (
	keyof typeof recipe_selection_schema['properties']
);

export type production_pool<
	Amount extends (
		| number_arg
		| operand_types
	) = operand_types
> = Partial<{
	[key in recipe_selection_schema_key]: Amount;
}>;

export type production_request<
	T1 extends (
		| amount_string
		| operand_types
	) = operand_types,
	T2 extends (
		| number_arg
		| operand_types
	) = operand_types
> = {
	input?: production_set<T1>,
	recipe_selection?: recipe_selection,
	pool: production_pool<T2>,
};

export type production_request_json = {
	input?: production_set_json,
	recipe_selection?: recipe_selection,
	pool: production_set_json,
};

export type combined_production_entry<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	[key: production_item]: {
		output: T,
		surplus: T,
	}
};

export type combined_production_entry_json = {
	[key: production_item]: {
		output: CanConvertTypeJson,
		surplus: CanConvertTypeJson,
	}
};

export type production_result<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	ingredients: production_set<T>,
	output: production_set<T>,
	combined: combined_production_entry<T>,
	surplus?: production_set<T>,
};

export type production_result_json = {
	ingredients: production_set_json,
	output: production_set_json,
	combined: combined_production_entry_json,
	surplus?: production_set_json,
}

export type production_item = keyof (
	| typeof buildings
	| typeof items
	| typeof resources
);

export type recipe_selection = {[key in production_item]: `${'Recipe'|'Build'}_${string}_C`};

export type production_set<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {[key in production_item]: T};

export type production_set_json = {
	[key in production_item]: CanConvertTypeJson
};

export function production_set_to_json(
	data: production_set<(
		| amount_string
		| BigNumber
		| operand_types
	)>
): production_set_json {
	return Object.fromEntries(Object.entries(data).map(
		(e): [production_item, CanConvertTypeJson] => [
			e[0],
			IntermediaryNumber.reuse_or_create(e[1]).toJSON(),
		]
	))
}

export function production_set_json_to_production_set(
	data: production_set_json
): production_set {
	return Object.fromEntries(Object.entries(data).map(
		(e): [production_item, operand_types] => [
			e[0],
			IntermediaryNumber.fromJson(e[1]),
		]
	))
}

export function combined_production_entry_to_combined_production_entry_json(
	data: combined_production_entry
): combined_production_entry_json {
	return Object.fromEntries(Object.entries(data).map(
		(e): [
			production_item,
			{
				output: CanConvertTypeJson,
				surplus: CanConvertTypeJson,
			},
		] => [
			e[0],
			{
				output: e[1].output.toJSON(),
				surplus: e[1].surplus.toJSON(),
			},
		]
	))
}

export function combined_production_entry_json_to_combined_production_entry(
	data: combined_production_entry_json
): combined_production_entry {
	return Object.fromEntries(Object.entries(data).map(
		(e): [
			production_item,
			{
				output: operand_types,
				surplus: operand_types,
			},
		] => [
			e[0],
			{
				output: IntermediaryNumber.fromJson(e[1].output),
				surplus: IntermediaryNumber.fromJson(e[1].surplus),
			},
		]
	))
}
