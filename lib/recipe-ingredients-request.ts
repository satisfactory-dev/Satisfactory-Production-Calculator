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
import {
	FGBuildingDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGBuildingDescriptor';
import {
	FGBuildingDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGResourceDescriptor';

const recipes:{
	[
		key in FGRecipe__type[
			'ClassName'
		]
	]: FGRecipe__type
} = Object.fromEntries(
	FGRecipe.Classes.map(e => [e.ClassName, e])
);
const buildings:{
	[
		key in FGBuildingDescriptor__type[
			'ClassName'
		]
	]: FGBuildingDescriptor__type
} = Object.fromEntries(
	FGBuildingDescriptor.Classes.map(e => [e.ClassName, e])
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
const resources:{
	[
		key in FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGResourceDescriptor__type
} = Object.fromEntries(
	FGResourceDescriptor.Classes.map(e => [e.ClassName, e])
);

declare type recipe_ingredients_request = {
	recipe: keyof typeof recipes,
	amount: number_arg,
}[];

export type recipe_ingredients_request_ingredient = {
	item: keyof typeof items,
	amount: amount_string,
};
export type recipe_ingredients_request_output = {
	item: (
		| keyof typeof buildings
	),
	type: (
		| 'FGBuildingDescriptor'
		| 'FGItemDescriptor'
		| 'FGResourceDescriptor'
	),
	amount: amount_string,
};

export type recipe_ingredients_request_result = {
	ingredients: recipe_ingredients_request_ingredient[],
	output: recipe_ingredients_request_output[],
};

export class RecipeIngredientsRequest extends PlannerRequest<
	recipe_ingredients_request,
	recipe_ingredients_request_result
> {
	constructor(ajv:Ajv)
	{
		super(ajv, recipe_ingredients_request_schema as SchemaObject);
	}

	protected calculate_validated(
		data:recipe_ingredients_request
	): recipe_ingredients_request_result {
		const ingredients:{
			[key in keyof typeof items]: amount_string;
		} = {};
		const output:{
			[key in keyof typeof buildings]: amount_string;
		} = {};

		for (const entry of data) {
			const {recipe, amount} = entry;

			const {
				mIngredients,
				mProduct,
			} = recipes[recipe];

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

				if (!(match[2] in ingredients)) {
					ingredients[match[2]] = '0';
				}

				ingredients[match[2]] = Math.append_multiply(
					ingredients[match[2]],
					ingredient.Amount,
					amount
				);
			}

			for (const product of mProduct) {
				const maybe_match = /^(?:\/[^/]+)+\/(Desc_[^.]+).(\1_C)/.exec(
					product.ItemClass.right
				);

				assert.notEqual(maybe_match, null, new NoMatchError(
					{
						recipe,
						product: product.ItemClass.right,
					},
					'Recipe contains unsupported products!'
				));

				const match = maybe_match as RegExpExecArray;

				assert.equal(
					(
						match[2] in buildings
						|| match[2] in items
						|| match[2] in resources
					),
					true,
					new NoMatchError(
						{
							recipe,
							product: product.ItemClass.right,
							expected: match[2],
						},
						'Supported product found but missing item!'
					)
				);

				if (!(match[2] in output)) {
					output[match[2]] = '0';
				}

				output[match[2]] = Math.append_multiply(
					output[match[2]],
					product.Amount,
					amount
				);
			}
		}

		return {
			ingredients: Object.entries(ingredients).map(e => {
			return {
				item: e[0],
				amount: e[1],
			};
			}),
			output: Object.entries(output).map(e => {
				return {
					item: e[0],
					amount: e[1],
					type: (
						e[0] in buildings
							? 'FGBuildingDescriptor'
							: (
								e[0] in items
									? 'FGItemDescriptor'
									: 'FGResourceDescriptor'
							)
					),
				};
			}),
		};
	}
}
