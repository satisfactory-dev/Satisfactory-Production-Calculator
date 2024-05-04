import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import BigNumber from 'bignumber.js';
import {
	AmountSplitter,
	production_item,
	production_set,
	ProductionDestination,
	ProductionMerger,
} from '../../lib/production-flinging';

function stringify(
	production_set:production_set
): {[key in production_item]: string} {
	return Object.fromEntries(Object.entries(
		production_set
	).map(
		e => [e[0], e[1].toString()]
	));
}

void describe('AmountSplitter', () => {
	void describe('receive_output', () => {
		const main_output = new ProductionDestination([
			'Desc_IronIngot_C',
			'Desc_CopperIngot_C',
		]);
		const surplus_output = new ProductionDestination([
			'Desc_IronIngot_C',
			'Desc_CopperIngot_C',
		]);
		const instance = new AmountSplitter(
			{
				Desc_IronIngot_C: BigNumber(10),
				Desc_CopperIngot_C: BigNumber(15),
			},
			main_output,
			surplus_output
		);

		const data_sets:[production_set, production_set, production_set][] = [
			[
				{
					Desc_IronIngot_C: BigNumber(1),
				},
				{
					Desc_IronIngot_C: BigNumber(1),
					Desc_CopperIngot_C: BigNumber(0),
				},
				{
					Desc_IronIngot_C: BigNumber(0),
					Desc_CopperIngot_C: BigNumber(0),
				},
			],
			[
				{
					Desc_IronIngot_C: BigNumber(10),
				},
				{
					Desc_IronIngot_C: BigNumber(10),
					Desc_CopperIngot_C: BigNumber(0),
				},
				{
					Desc_IronIngot_C: BigNumber(0),
					Desc_CopperIngot_C: BigNumber(0),
				},
			],
			[
				{
					Desc_IronIngot_C: BigNumber(11),
				},
				{
					Desc_IronIngot_C: BigNumber(10),
					Desc_CopperIngot_C: BigNumber(0),
				},
				{
					Desc_IronIngot_C: BigNumber(1),
					Desc_CopperIngot_C: BigNumber(0),
				},
			],
			[
				{
					Desc_IronIngot_C: BigNumber(11),
					Desc_CopperIngot_C: BigNumber(20),
				},
				{
					Desc_IronIngot_C: BigNumber(10),
					Desc_CopperIngot_C: BigNumber(15),
				},
				{
					Desc_IronIngot_C: BigNumber(1),
					Desc_CopperIngot_C: BigNumber(5),
				},
			],
			[
				{
					Desc_IronIngot_C: BigNumber(-100),
					Desc_CopperIngot_C: BigNumber(-100),
				},
				{
					Desc_IronIngot_C: BigNumber(0),
					Desc_CopperIngot_C: BigNumber(0),
				},
				{
					Desc_IronIngot_C: BigNumber(0),
					Desc_CopperIngot_C: BigNumber(0),
				},
			],
		];

		for (const data_set of data_sets) {
			const [input, main, surplus] = data_set;

			const input_stringified = stringify(input);
			const main_expected = stringify(main);
			const surplus_expected = stringify(surplus);

			void it(
				`AmountSplitter.receive_output(${
					JSON.stringify(input_stringified)
				}) distributes to ${
					JSON.stringify(main_expected)
				} and ${
					JSON.stringify(surplus_expected)
				}`,
				() => {
					instance.receive_output(input);

					const main_actual = stringify(
						main_output.production_output()
					);
					const surplus_actual = stringify(
						surplus_output.production_output()
					);

					assert.deepEqual(main_actual, main_expected);
					assert.deepEqual(surplus_actual, surplus_expected);

					const main_actual_2 = stringify(
						main_output.production_output()
					);

					assert.deepEqual(main_actual_2, main_actual);
					assert.notEqual(main_actual_2, main_actual);

					main_output.clear();

					assert.deepEqual(
						stringify(main_output.production_output()),
						stringify(
							Object.fromEntries(
								Object.entries(
									main_expected
								).map(e => [
									e[0],
									BigNumber(0),
								])
							)
						)
					);
				}
			)
		}
	})
})

void describe('ProductionMerger', () => {
	void describe('receive_output', () => {
		const data_sets:[
			[production_item, ...production_item[]],
			[production_set, ...production_set[]],
			production_set,
		][] = [
			[
				[
					'Desc_IronIngot_C',
					'Desc_CopperIngot_C',
				],
				[
					{
						Desc_IronIngot_C: BigNumber(3),
					},
					{
						Desc_OreIron_C: BigNumber(5),
					},
					{
						Desc_IronIngot_C: BigNumber(7),
						Desc_CopperIngot_C: BigNumber(9),
					},
					{
						Desc_IronIngot_C: BigNumber(11),
					},
				],
				{
					Desc_IronIngot_C: BigNumber(21),
					Desc_CopperIngot_C: BigNumber(9),
				},
			],
		];

		for (const data_set of data_sets) {
			const [items, inputs, expectation] = data_set;

			void it (
				`${inputs.map(
					e => `ProductionMerger.receive_output(${
						JSON.stringify(stringify(e))
					})`
				).join(', ')} with ${
					items.join(', ')
				} results in ${
					JSON.stringify(stringify(expectation))
				}`,
				() => {
					const destination = new ProductionDestination(items);
					const instance = new ProductionMerger(items, destination);

					for (const input of inputs) {
						instance.receive_output(input, []);
					}

					assert.deepEqual(
						stringify(destination.production_output()),
						stringify(expectation)
					);
				}
			)
		}
	})
})
