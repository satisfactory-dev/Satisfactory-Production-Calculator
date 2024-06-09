import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';

import {
	faux_recipe,
} from '../../lib/faux-recipe';

void describe('faux_recipe', () => {
	void it('returns an empty object', () => {
		assert.deepStrictEqual(
			faux_recipe('not a faux recipe'),
			{}
		)
	})
})
