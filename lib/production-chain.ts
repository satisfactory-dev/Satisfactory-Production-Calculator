import assert from 'assert';
import {
	ProductionData,
} from './production-data';
import type {
	production_item,
	recipe_selection,
} from './types';
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
import {
	GenerateSchemas,
} from './generate-schemas';
import {
	object_has_property,
} from '@satisfactory-dev/predicates.ts';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';

class Item<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = (
		| FGPowerShardDescriptor__type
		| undefined
	),
>
{
	readonly item:production_item;
	readonly parents:production_item[];
	readonly production_data:ProductionData<FGPowerShardDescriptor>;
	readonly recipe_selection:recipe_selection;
	readonly result: Item[] = []

	constructor(
		production_data: ProductionData<FGPowerShardDescriptor>,
		item:production_item,
		recipe_selection:recipe_selection,
		parents:production_item[],
	) {
		this.production_data = production_data;
		this.item = item;
		this.recipe_selection = recipe_selection;
		this.parents = parents;

		if (!(this instanceof Recursive)) {
			this.result = this.calculate();
		}
	}

	is_recursive(): boolean
	{
		return !!this.result.find(maybe => maybe.is_recursive());
	}

	private calculate(): Item[]
	{
		const {
			ammo,
			biomass,
			consumable,
			equipment,
			items,
			known_not_sourced_from_recipe,
			recipes,
			resources,
		} = this.production_data.data;

		const {
			recipe_selection: recipe_selection_schema,
		} = GenerateSchemas.factory(this.production_data);

		if ((known_not_sourced_from_recipe as string[]).includes(this.item)) {
			return [];
		}

		const ingredients:production_item[] = [];

		let maybe_recipe:string|undefined = undefined;

		if (this.item in this.recipe_selection) {
			maybe_recipe = this.recipe_selection[this.item];
		} else if (this.item in recipe_selection_schema.properties) {
			maybe_recipe = recipe_selection_schema.properties[
				this.item as keyof typeof recipe_selection_schema.properties
			].default;
		}

		assert.strictEqual(
			undefined !== maybe_recipe,
			true,
			new Error(`Could not find recipe for ${this.item}`),
		);

		const recipe = maybe_recipe as string;

		if (undefined === recipes[recipe]) {
			if (
				/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
					.test(recipe)
			) {
				const faux_result = faux_recipe(
					this.production_data,
					recipe,
				);

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

			if ('' === mIngredients) {
				throw new Error('Empty ingredient found!');
			}

			const ingredient_amounts = mIngredients.map(
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
					(e): [string, number_arg] => [
						UnrealEngineString_right_x_C_suffix(
							e.ItemClass,
						),
						amend_ItemClass_amount(
							this.production_data,
							e,
						).Amount,
					],
				),
			);

			assert.strictEqual(
				this.item in mapped_product_amounts,
				true,
				new NoMatchError(
					{
						production: this.item,
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

			for (const ingredient of mIngredients) {
				if (!object_has_property(ingredient, 'ItemClass')) {
					continue;
				}
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass,
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
						`Supported ingredient found (${Desc_C}) but missing item!`,
					),
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
			maybe => !(maybe in resources),
		).map(item => {
			if (next_parents.includes(item)) {
				return new Recursive(
					this.production_data,
					item,
					this.recipe_selection,
					next_parents,
				);
			}

			return new Item(
				this.production_data,
				item,
				this.recipe_selection,
				next_parents,
			);
		});
	}
}

class Recursive extends Item
{
	is_recursive()
	{
		return true;
	}
}

export class Root<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = undefined,
> extends Item
{
	private static cache:WeakMap<
		recipe_selection,
		{[key: string]: boolean}
	> = new WeakMap();

	constructor(
		production_data: ProductionData<FGPowerShardDescriptor>,
		item:production_item,
		recipe_selection:recipe_selection,
	) {
		super(
			production_data,
			item,
			recipe_selection,
			[],
		);
	}

	static is_recursive<
		FGPowerShardDescriptor extends (
			| FGPowerShardDescriptor__type
			| undefined
		) = undefined,
	>(
		production_data: ProductionData<FGPowerShardDescriptor>,
		item:production_item,
		recipe_selection:recipe_selection,
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
				new Root(production_data, item, recipe_selection)
			).is_recursive();
		}

		return (
			this.cache.get(recipe_selection) as {[key: string]: boolean}
		)[item];
	}
}
