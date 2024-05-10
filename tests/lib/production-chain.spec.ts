import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	Root,
} from '../../lib/production-chain';
import {
	production_item,
	recipe_selection,
} from '../../lib/production-data';

void describe('Root', () => {
	void describe('is_recursive', () => {
		const data_sets:[
			production_item,
			recipe_selection,
			boolean,
		][] = [
			[
				'Desc_IronScrew_C',
				{},
				false,
			],
			[
				'Desc_NuclearWaste_C',
				{},
				false,
			],
			[
				'Desc_Plastic_C',
				{
					Desc_Plastic_C: 'Recipe_Alternate_Plastic_1_C',
					Desc_Rubber_C: 'Recipe_Alternate_RecycledRubber_C',
				},
				true,
			],
		];

		for (const data_set of data_sets) {
			const [
				item,
				recipe_selection,
				expectation,
			] = data_set;

			void it(
				`(new Root(${
					item
				}, ${
					JSON.stringify(recipe_selection)
				})).is_recursive resolves to ${
					expectation ? 'true' : 'false'
				}`,
				() => {
					const root = new Root(item, recipe_selection);

					assert.strictEqual(
						root.is_recursive,
						expectation
					);
				}
			)
		}
	});

	void describe('throws', () => {
		const data_sets:[
			production_item,
			recipe_selection,
		][] = [
			[
				'foo',
				{},
			],
		];

		for (const data_set of data_sets) {
			const [item, recipe_selection] = data_set;

			assert.throws(() => new Root(item, recipe_selection));
		}
	});
});
