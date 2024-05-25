
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';
import {
	writeFile,
} from 'fs/promises';

import {
	ammo,
	biomass,
	consumable,
	equipment,
	fuel_nuclear,
	items,
	resources,
} from './lib/production-data';

const __dirname = __dirname_from_meta(import.meta);

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
