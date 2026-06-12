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

type faux_recipe_string = `Recipe_--faux--Build_${
	string
}_C--Desc_${
	string
}_C--${
	number
}--_C`;

export class FauxRecipe {
	static is_faux_recipe(
		maybe: unknown,
	): maybe is faux_recipe_string {
		return (
			'string' === typeof maybe
			&& /^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
				.test(maybe)
		);
	}

	static maybe_from_string(
		recipe: unknown,
		faux_recipe_keys: string[],
	): production_set {
		if (!this.is_faux_recipe(recipe)) {
			return {};
		}

		return this.from_string(recipe, faux_recipe_keys);
	}

	static from_string(
		recipe: faux_recipe_string,
		faux_recipe_keys: string[],
	) {
		const [
			,
			,
			,
			faux_ingredient,
			faux_amount,
		] = recipe.split('--');

		if (!faux_recipe_keys.includes(faux_ingredient)) {
			throw new Error(
				`Supported faux-recipe found, but missing item (${
					faux_ingredient
				})!`,
			);
		}

		return {
			[faux_ingredient]: IntermediaryNumber.create(faux_amount),
		};
	}
}

export function faux_recipe<
	Version extends supported_versions,
>(
	production_data: by_version[Version]['ProductionData'],
	recipe: string,
): production_set {
	if (!FauxRecipe.is_faux_recipe(recipe)) {
		return {};
	}

	const {
		faux_ingredients_list: faux_recipe_keys,
	} = production_data.data;

	return FauxRecipe.from_string(recipe, faux_recipe_keys);
}
