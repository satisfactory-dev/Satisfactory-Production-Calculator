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
	UnrealEngineString_right_x_C_suffix,
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
				const Desc_c = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass
				);

				assert.equal(Desc_c in items, true, new NoMatchError(
					{
						recipe,
						ingredient: ingredient.ItemClass.right,
						expected: Desc_c,
					},
					'Supported ingredient found but missing item!'
				));

				if (!(Desc_c in ingredients)) {
					ingredients[Desc_c] = '0';
				}

				ingredients[Desc_c] = Math.append_multiply(
					ingredients[Desc_c],
					ingredient.Amount,
					amount
				);
			}

			for (const product of mProduct) {
				const Desc_c = UnrealEngineString_right_x_C_suffix(
					product.ItemClass
				);

				assert.equal(
					(
						Desc_c in buildings
						|| Desc_c in items
						|| Desc_c in resources
					),
					true,
					new NoMatchError(
						{
							recipe,
							product: product.ItemClass.right,
							expected: Desc_c,
						},
						'Supported product found but missing item!'
					)
				);

				if (!(Desc_c in output)) {
					output[Desc_c] = '0';
				}

				output[Desc_c] = Math.append_multiply(
					output[Desc_c],
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
