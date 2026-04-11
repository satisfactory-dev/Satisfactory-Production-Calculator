import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__update8,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--0.8.3.3.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__v1p0,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--1.0.1.4.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__v1p1,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--1.1.2.2.js';

import type {
	amount_string,
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';

import type {
	recipe_selection_properties_with_defaults,
	supported_imports,
	update8_imports,
	version_1p0_imports,
} from './production-data/types.ts';

type recipe_selection_schema_key = (
	keyof recipe_selection_properties_with_defaults
);

type production_pool<
	Amount extends (
		| number_arg
		| operand_types
	) = operand_types,
> = Partial<{
	[key in recipe_selection_schema_key]: Amount;
}>;

type production_request<
	T1 extends (
		| amount_string
		| operand_types
	) = operand_types,
	T2 extends (
		| number_arg
		| operand_types
	) = operand_types,
> = {
	input?: production_set<T1>,
	recipe_selection?: recipe_selection,
	pool: production_pool<T2>,
};

type combined_production_entry<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types,
> = {
	[key: production_item]: {
		output: T,
		surplus: T,
	},
};

type production_result<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types,
> = {
	ingredients: production_set<T>,
	output: production_set<T>,
	combined: combined_production_entry<T>,
	surplus?: production_set<T>,
};

type production_item = `${string}_C`;

// eslint-disable-next-line @stylistic/max-len
type recipe_selection = {[key in production_item]: `${'Recipe'|'Build'}_${string}_C`};

type production_set<
	T extends (
		| amount_string
		| BigNumber
		| operand_types
	) = operand_types,
> = {[key in production_item]: T};


type ItemClass_Amount_list_item<
	T_Imports extends supported_imports,
> = (
	T_Imports extends update8_imports
		? ItemClass_Amount_list_item__update8
		: (
			T_Imports extends version_1p0_imports
				? ItemClass_Amount_list_item__v1p0
				: ItemClass_Amount_list_item__v1p1
		)
);

export type {
	combined_production_entry,
	ItemClass_Amount_list_item,
	production_item,
	production_pool,
	production_result,
	production_request,
	production_set,
	recipe_selection,
};
