import type {
	ProductionData,
} from './production-data.ts';

import type {
	supported_imports,
} from './production-data/types.ts';

import {
	ProductionResolver,
} from './production-resolver.ts';

import type {
	production_item,
	recipe_selection,
} from './types.ts';

export class DeferredProductionResolver<
	T_Imports extends supported_imports,
> {
	#production_data: ProductionData<T_Imports>;

	#recipe_selection: recipe_selection;

	#resolves: {[key: string]: ProductionResolver<T_Imports>} = {};

	constructor(
		production_data: ProductionData<T_Imports>,
		recipe_selection: recipe_selection,
	) {
		this.#production_data = production_data;
		this.#recipe_selection = recipe_selection;
	}

	resolve(item: production_item): ProductionResolver<T_Imports> {
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
