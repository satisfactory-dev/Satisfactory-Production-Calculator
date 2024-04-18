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
	filter_UnrealEngineString_right_x_C_suffix,
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
import {
	integer_string__type,
} from '../generated-types/update8/common/unassigned';
import {
	UnrealEngineString,
} from '../generated-types/update8/utils/validators';
import BigNumber from 'bignumber.js';

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

export type recipe_ingredients_request_ingredient<
T extends amount_string|BigNumber = amount_string
> = {
	item: keyof typeof items,
	amount: T,
};
export type recipe_ingredients_request_output<
	T extends amount_string|BigNumber = amount_string
> = {
	item: (
		keyof (
			| typeof buildings
			| typeof items
			| typeof resources
		)
	),
	type: (
		| 'FGBuildingDescriptor'
		| 'FGItemDescriptor'
		| 'FGResourceDescriptor'
	),
	amount: T,
};

export type production_ingredients_request_result<
	T extends amount_string|BigNumber = amount_string
> = {
	ingredients: recipe_ingredients_request_ingredient<T>[],
	output: recipe_ingredients_request_output<T>[],
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

	protected amend_ItemClass_amount(
		ItemClass:{
			ItemClass: UnrealEngineString;
			Amount: integer_string__type;
		}
	): {
		ItemClass: UnrealEngineString;
		Amount: number_arg;
	} {

		const Desc_c = UnrealEngineString_right_x_C_suffix(
			ItemClass.ItemClass
		);

		return {
			ItemClass: ItemClass.ItemClass,
			Amount: (
				(
				(
					Desc_c in resources
					&& 'RF_SOLID' !== resources[Desc_c].mForm
				)
					|| (
						Desc_c in items
						&& 'RF_SOLID' !== items[Desc_c].mForm
					)
				)
					? Math.divide(ItemClass.Amount, 1000)
					: ItemClass.Amount
			),
		};
	}

	protected calculate_precisely(
		data:production_ingredients_request,
		recursively_already_checked?:[string, ...string[]]
	): production_ingredients_request_result<BigNumber> {
		const ingredients:{
			[key in keyof typeof items]: BigNumber;
		} = {};
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: BigNumber;
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
					output[
						production as keyof typeof resources
					] = BigNumber(0);
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

			const ingredient_amounts = mIngredients.map(
				e => this.amend_ItemClass_amount(e).Amount
			);

			const product_amounts = mProduct.map(
				e => this.amend_ItemClass_amount(e).Amount
			);

			const amounts = [
				...ingredient_amounts,
				...product_amounts,
			];

			assert.equal(
				amounts.length >= 2,
				true,
				new NoMatchError(
					{
						amounts,
					},
					'Expected at least two numbers!'
				)
			);

			const divisor = product_amounts.find(
				e => 0 !== BigNumber(e).comparedTo(1)
			)
				? Math.least_common_multiple(
					amounts as [number_arg, number_arg, ...number_arg[]]
				) : 1;

			for (const ingredient of mIngredients) {
				const Desc_c = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass
				);

				assert.equal(
					(
						Desc_c in items
						|| Desc_c in resources
					),
					true,
					new NoMatchError(
					{
						recipe,
						ingredient: ingredient.ItemClass.right,
						expected: Desc_c,
					},
						`Supported ingredient found (${Desc_c}) but missing item!`
				));

				if (!(Desc_c in ingredients)) {
					ingredients[Desc_c] = BigNumber(0);
				}

				ingredients[Desc_c] = Math.append_multiply(
					ingredients[Desc_c],
					Math.divide(ingredient.Amount, divisor),
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
					output[Desc_c] = BigNumber(0);
				}

				output[Desc_c] = Math.append_multiply(
					output[Desc_c],
					Math.divide(
						this.amend_ItemClass_amount(product).Amount,
						divisor
					),
					amount
				);
			}
		}

		for (
			const Desc_C of Object.keys(
				ingredients
			).filter(
				(maybe) => !recursively_already_checked?.includes(maybe)
			)
		) {
			const fresh_check:[string, ...string[]] = [Desc_C];
			if (recursively_already_checked) {
				fresh_check.push(...recursively_already_checked);
			}

			assert.equal(
				Desc_C in recipe_selection_schema['properties'],
				true,
				new NoMatchError(
					Desc_C,
					'Item not found in recipe selection!'
				)
			);

			const recursive = this.calculate_precisely(
				{
					recipe_selection: data.recipe_selection,
					pool: [
						{
							production: Desc_C as (
								keyof typeof recipe_selection_schema[
									'properties'
								]
							),
							amount: ingredients[Desc_C],
						},
					],
				},
				fresh_check
			);

			for (const ingredient of recursive.ingredients) {
				if (!(ingredient.item in ingredients)) {
					ingredients[ingredient.item] = ingredient.amount;
				} else {
					ingredients[ingredient.item] = Math.add(
						ingredients[ingredient.item],
						ingredient.amount
					);
				}
			}

			for (const entry of recursive.output) {
				if (entry.item === Desc_C) {
					continue;
				}

				if (!(entry.item in output)) {
					output[entry.item] = entry.amount;
				} else {
					output[entry.item] = Math.add(
						output[entry.item],
						entry.amount
					);
				}
			}
		}

		const result:production_ingredients_request_result<BigNumber> = {
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

		return result;
	}

	protected calculate_validated(
		data:production_ingredients_request
	): production_ingredients_request_result {
		const result = this.calculate_precisely(data);

		return {
			ingredients: result.ingredients.map(e => {
				return {
					item: e.item,
					amount: Math.round_off(e.amount),
				};
			}),
			output: result.output.map(e => {
				return {
					item: e.item,
					type: e.type,
					amount: Math.round_off(e.amount),
				};
			}),
		};
	}

	protected requires_recursion(
		maybe:UnrealEngineString_right_x_C_suffix
	): boolean {
		return !(maybe in resources);
	}
}
