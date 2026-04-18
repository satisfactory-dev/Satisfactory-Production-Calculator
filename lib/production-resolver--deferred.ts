import {
	ProductionResolver,
} from './production-resolver.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

import type {
	production_item,
	recipe_selection,
} from './types.ts';

export class DeferredProductionResolver<
	Version extends supported_versions,
> {
	#production_data: by_version[Version]['ProductionData'];

	#recipe_selection: recipe_selection;

	#resolves: {[key: string]: ProductionResolver<Version>} = {};

	constructor(
		production_data: by_version[Version]['ProductionData'],
		recipe_selection: recipe_selection,
	) {
		this.#production_data = production_data;
		this.#recipe_selection = recipe_selection;
	}

	resolve(item: production_item): ProductionResolver<Version> {
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
