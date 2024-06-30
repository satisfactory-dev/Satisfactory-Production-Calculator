import assert from 'assert';
import {
	ammo,
	biomass,
	consumable,
	equipment,
	items,
	known_not_sourced_from_recipe,
	recipes,
	resources,
} from './production-data';
import type {
	production_item,
	recipe_selection,
} from './types';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	faux_recipe,
} from './faux-recipe';
import {
	number_arg,
} from '@signpostmarv/intermediary-number';
import {
	amend_ItemClass_amount,
} from './amend-itemclass-amount';
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib/index';

class Item
{
	readonly item:production_item;
	readonly parents:production_item[];
	readonly recipe_selection:recipe_selection;
	readonly result: Item[] = [];

	constructor(
		item:production_item,
		recipe_selection:recipe_selection,
		parents:production_item[]
	) {
		this.item = item;
		this.recipe_selection = recipe_selection;
		this.parents = parents;

		if (!(this instanceof Recursive)) {
			this.result = this.calculate();
		}
	}

	get is_recursive(): boolean
	{
		return !!this.result.find(maybe => maybe.is_recursive);
	}

	private calculate(): Item[]
	{
		if (known_not_sourced_from_recipe.includes(this.item)) {
			return [];
		}

		const ingredients:production_item[] = [];

		const maybe_recipe = this.item in this.recipe_selection
			? this.recipe_selection[this.item]
			: (
				this.item in recipe_selection_schema.properties
					? recipe_selection_schema.properties[
						this.item as keyof typeof recipe_selection_schema[
							'properties'
						]
					].default
					: undefined
			);

		assert.strictEqual(
			undefined !== maybe_recipe,
			true,
			new Error(`Could not find recipe for ${this.item}`)
		);

		const recipe = maybe_recipe as string;

		if (undefined === recipes[recipe]) {
			if (
				/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
					.test(recipe)
			) {
				const faux_result = faux_recipe(recipe);

				for (const faux_ingredient of Object.keys(faux_result)) {
					if (!ingredients.includes(faux_ingredient)) {
						ingredients.push(faux_ingredient);
					}
				}
			}
		} else {
			const {
				mIngredients,
				mProduct,
			} = recipes[recipe];

			const ingredient_amounts = mIngredients.map(
				e => amend_ItemClass_amount(
					e
				).Amount
			);

			const mapped_product_amounts = Object.fromEntries(mProduct.map(
				(e): [string, number_arg] => [
					UnrealEngineString_right_x_C_suffix(e.ItemClass),
					amend_ItemClass_amount(
						e
					).Amount,
				]
			));

			assert.strictEqual(
				this.item in mapped_product_amounts,
				true,
				new NoMatchError(
					{
						production: this.item,
						mapped_product_amounts,
					},
					'Production item not found in mapped product amounts!'
				)
			);

			const product_amounts = Object.values(mapped_product_amounts);

			const amounts = [
				...ingredient_amounts,
				...product_amounts,
			];

			assert.strictEqual(
				amounts.length >= 2,
				true,
				new NoMatchError(
					{
						amounts,
					},
					'Expected at least two numbers!'
				)
			);

			for (const ingredient of mIngredients) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass
				);

				assert.strictEqual(
					(
						Desc_C in ammo
						|| Desc_C in biomass
						|| Desc_C in consumable
						|| Desc_C in equipment
						|| Desc_C in items
						|| Desc_C in resources
					),
					true,
					new NoMatchError(
						{
							recipe,
							ingredient: ingredient.ItemClass.right,
							expected: Desc_C,
						},
						`Supported ingredient found (${Desc_C}) but missing item!`
					)
				);

				if (!ingredients.includes(Desc_C)) {
					ingredients.push(Desc_C);
				}
			}
		}

		const next_parents = [...this.parents];

		if (!next_parents.includes(this.item)) {
			next_parents.push(this.item);
		}

		return ingredients.filter(
			maybe => !(maybe in resources)
		).map(item => {
			if (next_parents.includes(item)) {
				return new Recursive(
					item,
					this.recipe_selection,
					next_parents
				);
			}

			return new Item(
				item,
				this.recipe_selection,
				next_parents
			);
		});
	}
}

class Recursive extends Item
{
	get is_recursive()
	{
		return true;
	}
}

export class Root extends Item
{
	private static cache:WeakMap<
		recipe_selection,
		{[key: string]: boolean}
	> = new WeakMap();

	constructor(
		item:production_item,
		recipe_selection:recipe_selection,
	) {
		super(item, recipe_selection, []);
	}

	static is_recursive(
		item:production_item,
		recipe_selection:recipe_selection
	): boolean {
		if (!this.cache.has(recipe_selection)) {
			this.cache.set(recipe_selection, {});
		}

		if (
			! (item in (
				this.cache.get(recipe_selection) as {[key: string]: boolean}
			))
		) {
			(
				this.cache.get(recipe_selection) as {[key: string]: boolean}
			)[item] = (
				new Root(item, recipe_selection)
			).is_recursive;
		}

		return (
			this.cache.get(recipe_selection) as {[key: string]: boolean}
		)[item];
	}
}
