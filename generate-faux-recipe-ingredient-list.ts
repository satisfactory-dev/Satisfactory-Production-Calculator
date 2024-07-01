import {
	writeFile,
} from 'fs/promises';

import {
	instance as production_data,
} from './tests/utilities/production-data';

const __dirname = import.meta.dirname;

const {
	ammo,
	biomass,
	consumable,
	equipment,
	fuel_nuclear,
	items,
	resources,
} = production_data.data;

await writeFile(
	`${__dirname}/data/faux-recipe-ingredient-list.json`,
	`${JSON.stringify([
		...Object.keys(ammo),
		...Object.keys(biomass),
		...Object.keys(consumable),
		...Object.keys(equipment),
		...Object.keys(fuel_nuclear),
		...Object.keys(items),
		...Object.keys(resources),
	], null, '\t')}\n`
)
