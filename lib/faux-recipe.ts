import assert from 'assert';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib/index';
import type {
	production_set,
} from './types';
// eslint-disable-next-line max-len
import {
	IntermediaryNumber,
} from '@signpostmarv/intermediary-number';
import {
	ProductionData,
} from './production-data';

export function faux_recipe(
	production_data: ProductionData,
	recipe:string,
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
		new NoMatchError(
			{
				recipe,
				faux_ingredient,
			},
			`Supported faux-recipe found, but missing item (${faux_ingredient})!`,
		),
	);

	return {
		[faux_ingredient]: IntermediaryNumber.create(faux_amount),
	};
}
