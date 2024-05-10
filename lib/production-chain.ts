import assert from 'assert';
import BigNumber from 'bignumber.js';
import {
	ammo,
	biomass,
	consumable,
	equipment,
	items,
	production_item,
	production_set,
	recipe_selection,
	recipes,
	resources,
} from './production-data';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	faux_recipe,
} from './faux-recipe';
import {
	number_arg,
	Numbers,
} from './Numbers';
import {
	amend_ItemClass_amount,
} from './amend-itemclass-amount';
import {
	UnrealEngineString_right_x_C_suffix,
} from './planner-request';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions';
import Fraction from 'fraction.js';

class Item
{
	readonly amount:BigNumber;
	readonly item:production_item;
	readonly parents:production_item[];
	readonly recipe_selection:recipe_selection;
	readonly result: Item[] = [];

	constructor(
		item:production_item,
		amount:BigNumber,
		recipe_selection:recipe_selection,
		parents:production_item[]
	) {
		this.amount = amount;
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
		const ingredients:production_set = {};

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

				for (const entry of Object.entries(faux_result)) {
					const [faux_ingredient, faux_amount] = entry;

					if (!(faux_ingredient in ingredients)) {
						ingredients[faux_ingredient] = BigNumber(0);
					}

					ingredients[faux_ingredient] = Numbers.append_multiply(
						ingredients[faux_ingredient],
						faux_amount,
						this.amount
					);
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

			let divisor = Numbers.least_common_multiple(
				[
					...product_amounts,
				] as [number_arg, number_arg, ...number_arg[]]
			);

			const divisor_pre_adjustment = divisor;

			divisor = Numbers.fraction_to_BigNumber(
				(new Fraction(divisor_pre_adjustment.toString())).div(
					(new Fraction(1)).div(
						(
							new Fraction(
								mapped_product_amounts[this.item].toString()
							)
						).div(divisor_pre_adjustment.toString())
					)
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

				if (!(Desc_C in ingredients)) {
					ingredients[Desc_C] = BigNumber(0);
				}

				ingredients[Desc_C] = Numbers.append_multiply(
					ingredients[Desc_C],
					BigNumber(
						amend_ItemClass_amount(
							ingredient
						).Amount
					).dividedBy(
						divisor
					),
					this.amount
				);
			}
		}

		const next_parents = [...this.parents];

		if (!next_parents.includes(this.item)) {
			next_parents.push(this.item);
		}

		return Object.entries(ingredients).filter(
			maybe => !(maybe[0] in resources)
		).map(e => {
			const [item, amount] = e;

			if (next_parents.includes(item)) {
				return new Recursive(
					item,
					amount,
					this.recipe_selection,
					next_parents
				);
			}

			return new Item(
				item,
				amount,
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
	constructor(
		item:production_item,
		recipe_selection:recipe_selection,
	) {
		super(item, BigNumber(1), recipe_selection, []);
	}
}
