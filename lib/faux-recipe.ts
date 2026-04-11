import assert from 'assert';

import {
	IntermediaryNumber,
} from '@signpostmarv/intermediary-number';

import type {
	ProductionData,
} from './production-data.ts';

import type {
	supported_imports,
} from './production-data/types.ts';

import type {
	production_set,
} from './types.ts';

export function faux_recipe<
	T_Imports extends supported_imports,
>(
	production_data: ProductionData<T_Imports>,
	recipe: string,
): production_set {
	if (
		!/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
			.test(recipe)
	) {
		return {};
	}

	const {
		faux_ingredients_list: faux_recipe_keys,
	} = production_data.data;

	const [
		,
		,
		,
		faux_ingredient,
		faux_amount,
	] = recipe.split('--');

	assert.strictEqual(
		faux_recipe_keys.includes(faux_ingredient),
		true,
		new Error(
			`Supported faux-recipe found, but missing item (${
				faux_ingredient
			})!`,
		),
	);

	return {
		[faux_ingredient]: IntermediaryNumber.create(faux_amount),
	};
}
