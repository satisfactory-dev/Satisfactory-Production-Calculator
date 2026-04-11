import {
	object_has_property,
} from '@satisfactory-dev/predicates.ts';

import type {
	production_item,
	recipe_selection,
} from './types.ts';

import type {
	ProductionData,
} from './production-data.ts';

import type {
	supported_imports,
} from './production-data/types.ts';

import {
	ProductionResolver,
} from './production-resolver.ts';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import {
	faux_recipe,
} from './faux-recipe.ts';

class Item<
	T_Imports extends supported_imports,
> {
	readonly item: production_item;

	readonly parents: production_item[];

	readonly production_data: ProductionData<T_Imports>;

	readonly recipe_selection: recipe_selection;

	readonly result: Item<T_Imports>[] = [];

	constructor(
		production_data: Item<T_Imports>['production_data'],
		item: production_item,
		recipe_selection: recipe_selection,
		parents: production_item[],
	) {
		this.production_data = production_data;
		this.item = item;
		this.recipe_selection = recipe_selection;
		this.parents = parents;

		if (!(this instanceof Recursive)) {
			this.result = this.#calculate();
		}
	}

	is_recursive(): boolean {
		return !!this.result.find((maybe) => maybe.is_recursive());
	}

	#calculate(): Item<T_Imports>[] {
		const {
			known_not_sourced_from_recipe,
			recipes,
			resources,
		} = this.production_data.data;

		if ((known_not_sourced_from_recipe as string[]).includes(this.item)) {
			return [];
		}

		const ingredients: production_item[] = [];

		const production_resolver = new ProductionResolver(
			this.production_data,
			this.item,
			this.recipe_selection,
		);

		const recipe = production_resolver.recipe;

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

			for (const maybe_ingredient of mIngredients || []) {
				const ingredient = ProductionResolver.verify_ingredient(
					this.production_data,
					maybe_ingredient,
				);

				if (!object_has_property(ingredient, 'ItemClass')) {
					continue;
				}
				const Desc_C = get_string_C(
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
			(maybe) => !(maybe in resources),
		).map((item) => {
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

class Recursive<
	T_Imports extends supported_imports,
> extends Item<T_Imports> {
	is_recursive() {
		return true;
	}
}

export class Root<
	T_Imports extends supported_imports,
> extends Item<T_Imports> {
	private static cache: WeakMap<
		recipe_selection,
		{[key: string]: boolean}
	> = new WeakMap();

	constructor(
		production_data: ProductionData<T_Imports>,
		item: production_item,
		recipe_selection: recipe_selection,
	) {
		super(
			production_data,
			item,
			recipe_selection,
			[],
		);
	}

	static is_recursive<
		T_Imports extends supported_imports,
	>(
		production_data: ProductionData<T_Imports>,
		item: production_item,
		recipe_selection: recipe_selection,
	): boolean {
		if (!this.cache.has(recipe_selection)) {
			this.cache.set(recipe_selection, {});
		}

		if (
			!(item in (
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
