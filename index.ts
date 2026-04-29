import factory_in_update8 from './lib/version-specific/0.8.3.3/factory.ts';

import factory_in_release_1_0 from './lib/version-specific/1.0.1.4/factory.ts';

import factory_in_release_1_1 from './lib/version-specific/1.1.2.2/factory.ts';

import factory_in_release_1_2 from './lib/version-specific/1.2.2.0/factory.ts';

import {
	find as find_in_update8,
} from './lib/version-specific/0.8.3.3/find.ts';

import {
	find as find_in_release_1_0,
} from './lib/version-specific/1.0.1.4/find.ts';

import {
	find as find_in_release_1_1,
} from './lib/version-specific/1.1.2.2/find.ts';

import {
	find as find_in_release_1_2,
} from './lib/version-specific/1.2.2.0/find.ts';

export * from './lib/amend-itemclass-amount.ts';
export * from './lib/types.ts';
export * from './lib/supported.ts';
export * from './lib/production-data.ts';
export * from './lib/production-data/types.ts';
export * from './lib/ProductionCalculator.ts';
export * from './lib/Request.ts';
export * from './lib/faux-recipe.ts';
export * from './lib/utilities/get_string_C.ts';
export * from './lib/generate-schemas.ts';
export * from './lib/generate-validators.ts';

export {
	factory_in_update8,
	factory_in_release_1_0,
	factory_in_release_1_1,
	factory_in_release_1_2,
	find_in_update8,
	find_in_release_1_0,
	find_in_release_1_1,
	find_in_release_1_2,
};
