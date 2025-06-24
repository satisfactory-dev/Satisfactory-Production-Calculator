import {
	UnrealEngineString,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/utils/validators';
import {
	integer_string__type,
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/scalar';
import {
	ItemClass__amount_required__type,
	ItemClass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/unassigned';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib/index';

import {
	object_has_property,
} from '@satisfactory-dev/predicates.ts';

import {
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';

import assert from 'assert';

import {
	ProductionData_Type,
} from './production-data';
import {
	GenerateSchemas,
} from './generate-schemas';
import {
	production_item,
	recipe_selection,
} from './types';
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	amend_ItemClass_amount,
	amend_ItemClass_amount_deferred,
} from './amend-itemclass-amount';

type ItemClass__type__item = {
	ItemClass: UnrealEngineString;
	Amount?: integer_string__type;
};

type amended_amounts = {
	ingredient_amounts: number_arg[],
	mapped_product_amounts: {[key: string]: operand_types},
	mIngredients: ''|ItemClass__type,
	mProduct: ('' | ItemClass__type) & ItemClass__amount_required__type,
	product_amounts: operand_types[],
};

export class DeferredProductionResolver<
	T_ProductionData extends ProductionData_Type,
> {
	#production_data: T_ProductionData;
	#recipe_selection: recipe_selection;

	#resolves:{[key: string]: ProductionResolver<
		T_ProductionData
	>} = {};

	constructor(
		production_data: T_ProductionData,
		recipe_selection: recipe_selection,
	) {
		this.#production_data = production_data;
		this.#recipe_selection = recipe_selection;
	}

	resolve(item: production_item): ProductionResolver<
		T_ProductionData
	> {
		if (!(item in this.#resolves)) {
			this.#resolves[item] = new ProductionResolver(
				this.#production_data,
				item,
				this.#recipe_selection,
			);
		}

		return this.#resolves[item];
	}
}

export class ProductionResolver<
	T_ProductionData extends ProductionData_Type,
> {
	private item: production_item;
	private production_data: T_ProductionData;
	private recipe_selection: recipe_selection;

	private static allowed_empty_ingredients = new WeakMap<
		ProductionData_Type,
		`Recipe_${string}_C`[]
	>();

	constructor(
		production_data: T_ProductionData,
		item: production_item,
		recipe_selection: recipe_selection,
	) {
		this.production_data = production_data;
		this.item = item;
		this.recipe_selection = recipe_selection;
	}

	get amended_amounts(): amended_amounts {
		const recipe = this.recipe;
		const production = this.item;

		const {
			recipes,
		} = this.production_data.data;

		assert.strictEqual(
			object_has_property(recipes, recipe),
			true,
			new NoMatchError(
				{
					recipes,
					recipe,
				},
				`Unsupported recipe found! (${recipe})`,
			),
		);

		const {
			mIngredients,
			mProduct,
		} = recipes[recipe];

		if (
			'' === mIngredients
			&& !ProductionResolver.get_allowed_empty_ingredients(
				this.production_data,
			).includes(recipe)
		) {
			throw new Error('Empty ingredient found!');
		}

		const ingredient_amounts = (
			'' === mIngredients
				? []
				: mIngredients
		).map(
			({
				ItemClass,
				Amount,
			}) => {
				if (undefined === Amount) {
					throw new Error('No amount found!');
				}

				return amend_ItemClass_amount(
					this.production_data,
					{
						ItemClass,
						Amount,
					},
				).Amount;
			},
		);

		const mapped_product_amounts = Object.fromEntries(
			mProduct.map(
				(e): [string, (
						| operand_types
				)] => [
					UnrealEngineString_right_x_C_suffix(e.ItemClass),
					amend_ItemClass_amount_deferred(
						this.production_data,
						e,
					).Amount,
				],
			),
		);

		assert.strictEqual(
			production in mapped_product_amounts,
			true,
			new NoMatchError(
				{
					production,
					mapped_product_amounts,
				},
				'Production item not found in mapped product amounts!',
			),
		);

		const product_amounts = Object.values(mapped_product_amounts);

		const amounts = [
			...ingredient_amounts,
			...product_amounts,
		];

		if (
			ProductionResolver.get_allowed_empty_ingredients(
				this.production_data,
			).includes(recipe)
			&& '' === recipes[recipe].mIngredients
		) {
			assert.strictEqual(
				ingredient_amounts.length,
				0,
				// eslint-disable-next-line max-len
				'Recipes with no ingredients should have no ingredient amounts!',
			);
			assert.strictEqual(
				product_amounts.length >= 1,
				true,
				// eslint-disable-next-line max-len
				'Recipes with no ingredients should have at least one product!',
			);
		} else {
			assert.strictEqual(
				amounts.length >= 2,
				true,
				new NoMatchError(
					{
						amounts,
					},
					'Expected at least two numbers!',
				),
			);
		}

		return {
			ingredient_amounts,
			mapped_product_amounts,
			mIngredients,
			mProduct,
			product_amounts,
		};
	}

	get recipe(): string
	{
		const {
			recipe_selection: recipe_selection_schema,
		} = GenerateSchemas.factory(this.production_data);

		let maybe_recipe:string|undefined = undefined;

		if (this.item in this.recipe_selection) {
			maybe_recipe = this.recipe_selection[this.item];
		} else if (this.item in recipe_selection_schema.properties) {
			maybe_recipe = recipe_selection_schema.properties[
				this.item as keyof typeof recipe_selection_schema.properties
			].default;
		}

		if (undefined === maybe_recipe) {
			throw new Error(`Could not find recipe for ${this.item}`);
		}

		return maybe_recipe;
	}

	static get_allowed_empty_ingredients<
		T_ProductionData extends ProductionData_Type
	> (
		production_data: T_ProductionData,
	): string[] {
		let allowed_empty_ingredients:(undefined|(`Recipe_${string}_C`[])) = this.allowed_empty_ingredients.get(production_data);

		if (!allowed_empty_ingredients) {
			allowed_empty_ingredients = [];
			const supported_empty_ingredient_recipes:`Recipe_${string}_C`[] = [
				'Recipe_QuantumEnergy_C',
			];

			for (const recipe of supported_empty_ingredient_recipes) {
				if (
					recipe in production_data.data.recipes
					&& '' === production_data.data.recipes[recipe].mIngredients
				) {
					allowed_empty_ingredients.push(recipe);
				}
			}

			this.allowed_empty_ingredients.set(
				production_data,
				allowed_empty_ingredients,
			);
		}

		return allowed_empty_ingredients;
	}

	static verify_ingredient<
		T_ProductionData extends ProductionData_Type
	>(
		production_data: T_ProductionData,
		ingredient: string|ItemClass__type__item,
		recipe: string,
	): string|ItemClass__type__item {
		if ('string' === typeof ingredient) {
			return ingredient;
		}

		const Desc_C = UnrealEngineString_right_x_C_suffix(
			ingredient.ItemClass,
		);
		const {
			ammo,
			biomass,
			consumable,
			equipment,
			items,
			resources,
			power_shards,
		} = production_data.data;

		assert.strictEqual(
			(
				Desc_C in ammo
				|| Desc_C in biomass
				|| Desc_C in consumable
				|| Desc_C in equipment
				|| Desc_C in items
				|| Desc_C in resources
				|| (power_shards && Desc_C in power_shards)
			),
			true,
			new NoMatchError(
				{
					recipe,
					ingredient: ingredient.ItemClass.right,
					expected: Desc_C,
				},
				`Supported ingredient found (${Desc_C}) but missing item!`,
			),
		);

		return ingredient;
	}
}
