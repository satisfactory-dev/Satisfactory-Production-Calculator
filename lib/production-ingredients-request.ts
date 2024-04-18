import assert from 'node:assert/strict';

import Ajv, {
	SchemaObject,
} from 'ajv/dist/2020';

import production_ingredients_request_schema from
	'../generated-schemas/production-ingredients-request.json' with {type: 'json'};
import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
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

declare type production_ingredients_request = {
	recipe_selection?: {
		[key in `${'Desc'|'BP'|'Foundation'}_${string}_C`]: `${'Recipe'|'Build'}_${string}_C`
	},
	pool: {
	production: keyof typeof recipe_selection_schema['properties'],
	amount: number_arg,
	}[],
};

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

export type production_ingredients_request_result = {
	ingredients: recipe_ingredients_request_ingredient[],
	output: recipe_ingredients_request_output[],
};

export class ProductionIngredientsRequest extends PlannerRequest<
	production_ingredients_request,
	production_ingredients_request_result
> {
	constructor(ajv:Ajv)
	{
		ajv.addSchema(recipe_selection_schema);
		(production_ingredients_request_schema
			.properties
			.pool
			.items
			.properties
			.production
			.enum as unknown) = Object.keys(
				recipe_selection_schema.properties
			);
		super(ajv, production_ingredients_request_schema as SchemaObject);
	}

	protected calculate_validated(
		data:production_ingredients_request
	): production_ingredients_request_result {
		const ingredients:{
			[key in keyof typeof items]: amount_string;
		} = {};
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: amount_string;
		} = {};

		for (const entry of data.pool) {
			const {production, amount} = entry;

			const recipe = (
				data.recipe_selection && production in data.recipe_selection
					? data.recipe_selection[production]
					: recipe_selection_schema.properties[production].default
			);

			if (undefined === recipes[recipe]) {
				assert.equal(
					recipe.startsWith('Build_'),
					true,
					new NoMatchError(
						{
							production,
							amount,
							recipe,
						},
						'Expecting to find a building recipe!'
					)
				);

				assert.equal(production in resources, true, new NoMatchError(
					{
						recipe,
						expected: production,
					},
					`Supported ingredient found but missing item!`
				));

				if (!(production in output)) {
					output[production as keyof typeof resources] = '0';
				}

				output[
					production as keyof typeof resources
				] = Math.append_multiply(
					output[production as keyof typeof resources],
					1,
					amount
				);

				continue;
			}

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
