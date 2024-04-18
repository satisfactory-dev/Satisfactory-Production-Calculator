import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	amount_string,
	Math,
	number_arg,
} from '../../lib/Math';
import {
	require_non_empty_array,
} from '../../Docs.json.ts/lib/ArrayUtilities';
import {
	integer_string__type,
} from '../../generated-types/update8/common/unassigned';
import BigNumber from 'bignumber.js';

void describe('Math', () => {
	void describe('add', () => {
		const data_sets: [number_arg, number_arg, string][] = [
			[1,2, '3' as string],
			[0, 22.5000001, '22.5000001'],
			[0, 22.50000001, '22.50000001'],
		];

		for (const entry of data_sets) {
			const [a, b, expectation] = entry;
			void it(
				`Math.add(${
					a.toString()
				}, ${
					b.toString()
				}) returns ${
					expectation
				}`,
				() => {
					assert.equal(
						BigNumber(expectation).comparedTo(Math.add(a, b)),
						0
					);
				}
			)
		}
	})

	void describe('amount_string', () => {
		const expectations: [
			string,
			(true|{[key: string]: unknown}),
		][] = [
			['0', true],
			['1', true],
			['1.1', true],
			['-1', {
				property: '-1',
				message: 'Not a supported amount string!',
			}],
		];

		for (const entry of expectations) {
			const [input, expectation] = entry;

			void it(
				`${
					true === expectation
						? 'behaves'
						: 'throws'
				} with ${
					JSON.stringify(input)
				}`,
				() => {
					const get_result = () => Math.amount_string(input);

					if (true === expectation) {
						assert.doesNotThrow(get_result);
						assert.equal(get_result(), input);
					} else {
						assert.throws(get_result, expectation);
					}
				}
			)
		}
	})

	void describe('append_multiply', () => {
		type data_set = [
			BigNumber,
			(
				| BigNumber
				| [BigNumber, ...BigNumber[]]
			),
			BigNumber,
			BigNumber,
			amount_string|null
		];
		const unmapped_expectations:[
			string,
			(
				| string
				| [string, ...string[]]
			),
			string,
			string,
			string|null,
		][] = [
			['1', '2', '3', '7', null],
			['1', ['2', '3'], '4', '21', null],
			['0', '22.5', '1.000001', '22.5000225', '22.500023'],
			['0', '45', '1.000001', '45.000045', null],
		];
		const expectations:data_set[] = unmapped_expectations.map((
			data_set
		) : data_set => {
			return [
				BigNumber(data_set[0]),
				(
					data_set[1] instanceof Array
						? require_non_empty_array(data_set[1].map(
							(e:string) => BigNumber(e)
						))
						: BigNumber(data_set[1])
				),
				BigNumber(data_set[2]),
				BigNumber(data_set[3]),
				null === data_set[4] ? null : Math.amount_string(data_set[4]),
			];
		});

		for (const entry of expectations) {
			const [append_to, a, b, expectation, rounded_off] = entry;
			void it (
				`Math.append_multiply(${
					append_to.toString()
				}, ${
					a instanceof Array ? JSON.stringify(a) : a.toString()
				}, ${
					b.toString()
				}) returns ${
					expectation.toString()
				}`,
				() => {
					const get_result = () => Math.append_multiply(
						append_to,
						a,
						b
					);

					assert.doesNotThrow(get_result);
					const result = get_result();
					assert.equal(
						BigNumber(expectation).comparedTo(result),
						0,
						`Expecting ${expectation.toString()}, receieved ${result.toString()}`
					);
					if (null !== rounded_off) {
						assert.equal(
							Math.round_off(result),
							rounded_off
						);
					}
				}
			)
		}
	})

	void describe('divide', () => {
		const data_sets:[number_arg, number_arg, string][] = [
			[2, 3, '0.666667'],
		];

		for (const entry of data_sets) {
			const [a, b, expectation] = entry;

			void it(
				`Math.divide(${
					a.toString()
				}, ${
					b.toString()
				}) returns ${
					expectation
				}`,
				() => {
					assert.equal(
						BigNumber(expectation).comparedTo(Math.divide(a, b)),
						0
					);
				}
			)
		}
	})

	void describe('greatest_common_denominator', () => {
		const data_set:[number_arg, number_arg, amount_string][] = [
			[1, 2, '1' as integer_string__type],
			[2, 3, '1' as integer_string__type],
			[7, 14, '7' as integer_string__type],
		];

		for (const entry of data_set) {
			const [a, b, expectation] = entry;

			void it(
				`Math.greatest_common_denominator(${
					a.toString()
				}, ${
					b.toString()
				}) returns ${
					expectation
				}`,
				() => {
					assert.equal(
						Math.greatest_common_denominator(a, b).toString(),
						expectation
					);
				}
			)
		}
	})

	void describe('least_common_multiple', () => {
		const data_set:[
			[number_arg, number_arg, ...number_arg[]],
			string,
		][] = [
			[
				[1, 2],
				'2',
			],
			[
				[30, 50, 65], // iron ingot recipes as of April 2024
				'1950',
			],
			[
				[37.5, 22.5],
				'112.5',
			],
		];

		for (const entry of data_set) {
			const [numbers, expectation] = entry;
			void it(
				`Math.least_common_multiple(${
					JSON.stringify(numbers)
				}) returns ${expectation}`,
				() => {
					assert.equal(
						BigNumber(expectation).comparedTo(
							Math.least_common_multiple(numbers)
						),
						0
					);
				}
			)
		}
	})

	void describe('round_off', () => {
		const data_sets:[number_arg, string][] = [
			[22.50000001, '22.5'],
		];

		for (const entry of data_sets) {
			const [input, expectation] = entry;

			void it(
				`Math.round_off(${
					input.toString()
				}) returns ${
					expectation
				}`,
				() => {
					assert.equal(
						Math.round_off(BigNumber(input)),
						expectation
					)
				}
			)
		}
	})

	void describe('sub', () => {
		const data_sets:[number_arg, number_arg, string][] = [
			[1.0000001, 0.0000001, '1'],
			[3, 2, '1'],
		];

		for (const entry of data_sets) {
			const [a, b, expectation] = entry;

			void it(
				`Math.sub(${
					a.toString()
				}, ${
					b.toString()
				}) returns ${
					expectation
				}`,
				() => {
					assert.equal(
						BigNumber(expectation).comparedTo(Math.sub(a, b)),
						0
					);
				}
			)
		}
	})
})
