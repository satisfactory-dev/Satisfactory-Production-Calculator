import assert from 'assert';

import {
	IntermediaryNumber,
} from '@satisfactory-dev/intermediary-number';

import type {
	production_set,
} from './types.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

export function faux_recipe<
	Version extends supported_versions,
>(
	production_data: by_version[Version]['ProductionData'],
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
