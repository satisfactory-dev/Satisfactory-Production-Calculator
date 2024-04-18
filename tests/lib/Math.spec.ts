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

void describe('Math', () => {
	void describe('add', () => {
		const data_sets: [number_arg, number_arg, amount_string][] = [
			[1,2, '3' as amount_string],
			[0, 22.5000001, '22.500001' as amount_string],
			[0, 22.50000001, '22.5' as amount_string],
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
						Math.add(a, b),
						expectation
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
			number_arg,
			(
				| number_arg
				| [number_arg, ...number_arg[]]
				| [amount_string, ...amount_string[]]
			),
			number_arg,
			number_arg,
		];
		const unmapped_expectations:[
			string,
			(
				| string
				| [string, ...string[]]
			),
			string,
			string,
		][] = [
			['1', '2', '3', '7'],
			['1', ['2', '3'], '4', '21'],
			['0', '22.5', '1.000001', '22.500023'],
			['0', '45', '1.000001', '45.000045'],
		];
		const expectations:data_set[] = unmapped_expectations.map((
			data_set
		) : data_set => {
			return [
				Math.amount_string(data_set[0]),
				(
					data_set[1] instanceof Array
						? require_non_empty_array(data_set[1].map(
							(e:string) => Math.amount_string(e)
						))
						: Math.amount_string(data_set[1])
				),
				Math.amount_string(data_set[2]),
				Math.amount_string(data_set[3]),
			];
		});

		for (const entry of expectations) {
			const [append_to, a, b, expectation] = entry;
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
					assert.equal(get_result(), expectation);
				}
			)
		}
	})

	void describe('divide', () => {
		const data_sets:[number_arg, number_arg, amount_string][] = [
			[2, 3, '0.666667' as amount_string],
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
						Math.divide(a, b),
						expectation
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
			amount_string,
		][] = [
			[
				[1, 2],
				'2' as integer_string__type,
			],
			[
				[30, 50, 65], // iron ingot recipes as of April 2024
				'1950' as integer_string__type,
			],
			[
				[37.5, 22.5],
				'112.5' as amount_string,
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
						Math.least_common_multiple(numbers),
						expectation
					);
				}
			)
		}
	})

	void describe('sub', () => {
		const data_sets:[number_arg, number_arg, amount_string][] = [
			[1.0000001, 0.0000001, '1' as amount_string],
			[3, 2, '1' as amount_string],
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
						Math.sub(a, b),
						expectation
					);
				}
			)
		}
	})
})
