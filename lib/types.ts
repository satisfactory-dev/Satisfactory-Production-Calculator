import {
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
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: T2,
	}[],
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

export type production_result<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types
> = {
	ingredients: production_set<T>,
	output: recipe_ingredients_request_output<T>[],
	combined: combined_production_entry<T>[],
	surplus?: production_set<T>,
};

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
