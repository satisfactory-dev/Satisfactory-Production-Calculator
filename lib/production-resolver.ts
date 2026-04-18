import assert from 'assert';

import {
	object_has_property,
} from '@satisfactory-dev/predicates.ts';

import type {
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';

import type {
	production_item,
	recipe_selection,
} from './types.ts';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import {
	amend_ItemClass_amount,
} from './amend-itemclass-amount.ts';

import {
	amend_ItemClass_amount_deferred,
} from './amend-itemclass-amount--deferred.ts';

import {
	GenerateSchemas,
} from './generate-schemas.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

type amended_amounts<
	Version extends supported_versions,
> = {
	ingredient_amounts: number_arg[],
	mapped_product_amounts: {[key: string]: operand_types},
	mIngredients: null|(by_version[Version]['ItemClass_Amount_list_item'][]),
	mProduct: null|(by_version[Version]['ItemClass_Amount_list_item'][]),
	product_amounts: operand_types[],
};

export class ProductionResolver<
	Version extends supported_versions,
> {
	private item: production_item;

	private production_data: by_version[Version]['ProductionData'];

	private recipe_selection: recipe_selection;

	private static allowed_empty_ingredients = new WeakMap<
		by_version[supported_versions]['ProductionData'],
		`Recipe_${string}_C`[]
	>();

	constructor(
		production_data: by_version[Version]['ProductionData'],
		item: production_item,
		recipe_selection: recipe_selection,
	) {
		this.production_data = production_data;
		this.item = item;
		this.recipe_selection = recipe_selection;
	}

	get amended_amounts(): amended_amounts<
		Version
	> {
		const recipe = this.recipe;
		const production = this.item;

		const {
			recipes,
		} = this.production_data.data;

		assert.strictEqual(
			object_has_property(recipes, recipe),
			true,
			new Error(
				`Unsupported recipe found! (${recipe})`,
			),
		);

		const {
			mIngredients,
			mProduct,
		} = recipes[recipe];

		if (
			null === mIngredients
			&& !ProductionResolver.get_allowed_empty_ingredients(
				this.production_data,
			).includes(recipe)
		) {
			throw new Error('Empty ingredient found!');
		}

		const ingredient_amounts = (
			(
				null === mIngredients
					? []
					: mIngredients
			) as by_version[Version]['ItemClass_Amount_list_item'][]
		).map(
			(item) => {
				return amend_ItemClass_amount<
					Version
				>(
					this.production_data,
					item,
				).Amount;
			},
		);

		const mapped_product_amounts: {
			[key: string]: operand_types,
		} = Object.fromEntries(
			(
				(
					mProduct
						? mProduct
						: []
				) as by_version[Version]['ItemClass_Amount_list_item'][]
			).map(
				(e): [
					string,
					operand_types,
				] => [
					get_string_C(e.ItemClass),
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
			new Error(
				'Production item not found in mapped product amounts!',
			),
		);

		const product_amounts: operand_types[] = Object.values(
			mapped_product_amounts,
		);

		const amounts = [
			...ingredient_amounts,
			...product_amounts,
		];

		if (
			ProductionResolver.get_allowed_empty_ingredients(
				this.production_data,
			).includes(recipe)
			&& null === recipes[recipe].mIngredients
		) {
			assert.strictEqual(
				ingredient_amounts.length,
				0,
				// eslint-disable-next-line @stylistic/max-len
				'Recipes with no ingredients should have no ingredient amounts!',
			);
			assert.strictEqual(
				product_amounts.length >= 1,
				true,
				// eslint-disable-next-line @stylistic/max-len
				'Recipes with no ingredients should have at least one product!',
			);
		} else {
			assert.strictEqual(
				amounts.length >= 2,
				true,
				new Error(
					'Expected at least two numbers!',
				),
			);
		}

		return {
			ingredient_amounts,
			mapped_product_amounts,
			mIngredients: mIngredients as amended_amounts<Version>[
				'mIngredients'
			],
			mProduct: mProduct as amended_amounts<Version>[
				'mProduct'
			],
			product_amounts,
		};
	}

	get recipe(): `${string}_C` {
		const {
			recipe_selection: recipe_selection_schema,
		} = GenerateSchemas.factory(this.production_data);

		let maybe_recipe: `${string}_C`|undefined = undefined;

		if (this.item in this.recipe_selection) {
			maybe_recipe = this.recipe_selection[this.item];
		} else if (this.item in recipe_selection_schema.properties) {
			maybe_recipe = recipe_selection_schema.properties[
				this.item
			].default;
		}

		if (undefined === maybe_recipe) {
			throw new Error(`Could not find recipe for ${this.item}`);
		}

		return maybe_recipe;
	}

	static get_allowed_empty_ingredients<
		Version extends supported_versions,
	>(
		production_data: by_version[Version]['ProductionData'],
	): string[] {
		let allowed_empty_ingredients: (
			| undefined
			| (`Recipe_${string}_C`[])
		) = this.allowed_empty_ingredients.get(production_data);

		if (!allowed_empty_ingredients) {
			allowed_empty_ingredients = [];
			const supported_empty_ingredient_recipes: (
				`Recipe_${string}_C`[]
			) = [
				'Recipe_QuantumEnergy_C',
				'Recipe_VehiclePath_Universal_C',
				'Recipe_VehiclePath_FactoryCart_C',
				'Recipe_VehiclePath_Explorer_C',
				'Recipe_VehiclePath_Truck_C',
				'Recipe_VehiclePath_Tractor_C',
			];

			for (const recipe of supported_empty_ingredient_recipes) {
				if (
					recipe in production_data.data.recipes
					&& null === production_data.data.recipes[
						recipe
					].mIngredients
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
		Version extends supported_versions,
	>(
		production_data: by_version[Version]['ProductionData'],
		ingredient: string|by_version[Version]['ItemClass_Amount_list_item'],
	): string|by_version[Version]['ItemClass_Amount_list_item'] {
		if ('string' === typeof ingredient) {
			return ingredient;
		}

		const Desc_C = get_string_C(
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
			new Error(
				`Supported ingredient found (${Desc_C}) but missing item!`,
			),
		);

		return ingredient;
	}
}
