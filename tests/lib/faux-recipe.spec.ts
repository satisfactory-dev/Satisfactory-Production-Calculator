import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';

import {
	instance as production_data,
} from '../utilities/production-data';

import {
	faux_recipe,
} from '../../lib/faux-recipe';

void describe('faux_recipe', () => {
	void it('returns an empty object', () => {
		assert.deepStrictEqual(
			faux_recipe(
				production_data,
				'not a faux recipe'
			),
			{}
		)
	})
})
