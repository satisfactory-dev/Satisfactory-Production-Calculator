import {
	amount_string,
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';
import BigNumber from 'bignumber.js';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};

import {
	items,
	production_item,
	recipe_selection,
} from './production-data';

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
	input?: recipe_ingredients_request_output<T1>[],
	recipe_selection?: recipe_selection,
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: T2,
	}[],
};

export type recipe_ingredients_request_ingredient<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	item: keyof typeof items,
	amount: T,
};
export type recipe_ingredients_request_output<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	item: production_item,
	amount: T,
};

export type production_ingredients_request_result_surplus<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = [
	recipe_ingredients_request_output<T>,
	...recipe_ingredients_request_output<T>[],
];

export type combined_production_entry<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	item: production_item,
	output: T,
	surplus: T,
};

export type production_ingredients_request_result<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	ingredients: recipe_ingredients_request_ingredient<T>[],
	output: recipe_ingredients_request_output<T>[],
	combined: combined_production_entry<T>[],
	surplus?: production_ingredients_request_result_surplus<T>,
};
