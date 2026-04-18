import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';

import factory from '../utilities/production-data.ts';

import {
	faux_recipe,
} from '../../lib/faux-recipe.ts';

import {
	is_supported_from,
} from '../../lib/supported.ts';

void describe('faux_recipe', () => {
	for (const semver of Object.keys(is_supported_from)) {
		void it(`returns an empty object with ${semver}`, async () => {
			const production_data = await factory(semver, 'en-US');

			assert.deepStrictEqual(
				faux_recipe(
					production_data,
					'not a faux recipe',
				),
				{},
			);
		});
	}
});
