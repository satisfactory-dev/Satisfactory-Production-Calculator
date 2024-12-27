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
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	object_has_property,
} from '@satisfactory-dev/predicates.ts';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel';
import {
	ProductionResolver,
} from './production-resolver';

class Item<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = (
		| FGPowerShardDescriptor__type
		| undefined
	),
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	) = (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	),
>
{
	readonly item:production_item;
	readonly parents:production_item[];
	readonly production_data:ProductionData<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel
	>;
	readonly recipe_selection:recipe_selection;
	readonly result: Item[] = []

	constructor(
		production_data: ProductionData<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel
		>,
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
			known_not_sourced_from_recipe,
			recipes,
			resources,
		} = this.production_data.data;

		if ((known_not_sourced_from_recipe as string[]).includes(this.item)) {
			return [];
		}

		const ingredients:production_item[] = [];

		const production_resolver = new ProductionResolver(
			this.production_data,
			this.item,
			this.recipe_selection,
		);

		const recipe = production_resolver.recipe

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
			} = production_resolver.amended_amounts;

			for (const maybe_ingredient of mIngredients) {
				const ingredient = ProductionResolver.verify_ingredient(
					this.production_data,
					maybe_ingredient,
					recipe,
				);

				if (!object_has_property(ingredient, 'ItemClass')) {
					continue;
				}
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass,
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
	) = (
		| FGPowerShardDescriptor__type
		| undefined
	),
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	) = (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	),
> extends Item
{
	private static cache:WeakMap<
		recipe_selection,
		{[key: string]: boolean}
	> = new WeakMap();

	constructor(
		production_data: ProductionData<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel
		>,
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
		) = (
			| FGPowerShardDescriptor__type
			| undefined
		),
		FGItemDescriptorPowerBoosterFuel extends (
			| FGItemDescriptorPowerBoosterFuel__type
			| undefined
		) = (
			| FGItemDescriptorPowerBoosterFuel__type
			| undefined
		),
	>(
		production_data: ProductionData<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel
		>,
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
