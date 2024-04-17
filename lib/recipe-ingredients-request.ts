import assert from 'node:assert/strict';

import Ajv, {
	SchemaObject,
} from 'ajv/dist/2020';

import recipe_ingredients_request_schema from
	'../generated-schemas/recipe-ingredients-request.json' with {type: 'json'};
import {
	NoMatchError,
} from '../Docs.json.ts/lib/Exceptions';
import {
	FGItemDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptor';
import {
	FGItemDescriptor__FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe,
} from '../generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGRecipe__type,
} from '../generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	amount_string,
	Math,
	number_arg,
} from './Math';
import {
	PlannerRequest,
} from './planner-request';

const recipes:{
	[
		key in FGRecipe__type[
			'ClassName'
		]
	]: FGRecipe__type
} = Object.fromEntries(
	FGRecipe.Classes.map(e => [e.ClassName, e])
);
const items:{
	[
		key in FGItemDescriptor__FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGItemDescriptor__FGResourceDescriptor__type;
} = Object.fromEntries(
	FGItemDescriptor.Classes.map(e => [e.ClassName, e])
);

declare type recipe_ingredients_request = {
	recipe: keyof typeof recipes,
	amount: number_arg,
}[];

export type recipe_ingredients_request_result = {
	item: keyof typeof items,
	amount: amount_string,
};

export class RecipeIngredientsRequest extends PlannerRequest<
	recipe_ingredients_request,
	recipe_ingredients_request_result[]
> {
	constructor(ajv:Ajv)
	{
		super(ajv, recipe_ingredients_request_schema as SchemaObject);
	}

	protected calculate_validated(
		data:recipe_ingredients_request
	): recipe_ingredients_request_result[] {
		const result:{
			[key in keyof typeof items]: amount_string;
		} = {};

		for (const entry of data) {
			const {recipe, amount} = entry;

			const {mIngredients} = recipes[recipe];

			for (const ingredient of mIngredients) {
				const maybe_match = /^(?:\/[^/]+)+\/(Desc_[^.]+).(\1_C)/.exec(
					ingredient.ItemClass.right
				);

				assert.notEqual(maybe_match, null, new NoMatchError(
					{
						recipe,
						ingredient: ingredient.ItemClass.right,
					},
					'Recipe contains unsupported ingredients!'
				));

				const match = maybe_match as RegExpExecArray;

				assert.equal(match[2] in items, true, new NoMatchError(
					{
						recipe,
						ingredient: ingredient.ItemClass.right,
						expected: match[2],
					},
					'Supported ingredient found but missing item!'
				));

				if (!(match[2] in result)) {
					result[match[2]] = '0';
				}

				result[match[2]] = Math.append_multiply(
					result[match[2]],
					ingredient.Amount,
					amount
				);
			}
		}

		return Object.entries(result).map(e => {
			return {
				item: e[0],
				amount: e[1],
			};
		});
	}
}
