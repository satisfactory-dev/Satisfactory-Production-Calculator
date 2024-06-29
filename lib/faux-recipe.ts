import assert from 'assert';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts';
import type {
	production_set,
} from './types';
// eslint-disable-next-line max-len
import faux_recipe_keys from '../data/faux-recipe-ingredient-list.json' with {type: 'json'};
import {
	IntermediaryNumber,
} from '@signpostmarv/intermediary-number';

export function faux_recipe(recipe:string): production_set
{
	if (
		!/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
			.test(recipe)
	) {
		return {};
	}

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
			`Supported faux-recipe found, but missing item (${faux_ingredient})!`
		)
	);

	return {
		[faux_ingredient]: IntermediaryNumber.create(faux_amount),
	};
}
