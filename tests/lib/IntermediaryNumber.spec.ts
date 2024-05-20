import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	CanConvertType,
	CanConvertTypeJson,
	DeferredCalculation,
	IntermediaryCalculation,
	IntermediaryNumber,
	math_types,
	NotValid,
	operand_types,
} from '../../lib/IntermediaryNumber';
import Fraction from 'fraction.js';
import BigNumber from 'bignumber.js';
import {
	NumberStrings,
} from '../../lib/NumberStrings';
import {
	is_instanceof,
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';
import {
	input_types,
	type_property_types,
} from '../../lib/IntermediaryNumberTypes';

void describe('IntermediaryNumber', () => {
	void describe('create', () => {
		const data_sets:[
			input_types,
			type_property_types|undefined,
		][] = [
			[
				'1',
				'amount_string',
			],
			[
				'lolnope',
				undefined,
			],
			[
				new Fraction(1/3),
				'Fraction',
			],
			[
				new BigNumber('999999999999999999999999999999999'),
				'BigNumber',
			],
			[
				'0.13r',
				'Fraction',
			],
			[
				'0.1(3)',
				'Fraction',
			],
			[
				'0.1(23)',
				'Fraction',
			],
			[
				'0.1[3]',
				'Fraction',
			],
			[
				'0.1[23]',
				'Fraction',
			],
			[
				'0.1(3)r',
				'Fraction',
			],
			[
				'0.1(23)r',
				'Fraction',
			],
			[
				'0.1[3]r',
				'Fraction',
			],
			[
				'0.1[23]r',
				'Fraction',
			],
		];

		for (const data_set of data_sets) {
			const [input, expectation] = data_set;

			void it(
				`IntermediaryNumber.create(${
					input.toString()
				})${
					undefined === expectation
						? ' throws'
						: `.type === ${expectation}`
				}`,
				() => {
					const get_value = () => IntermediaryNumber.create(input);

					const maybe = IntermediaryNumber.create_if_valid(
						input.toString()
					);

					if (undefined === expectation) {
						assert.throws(get_value);
						is_instanceof(maybe, NotValid);
					} else {
						assert.strictEqual(
							get_value().type,
							expectation
						);

						assert.strictEqual(
							(maybe instanceof NotValid),
							false,
							`Expecting "${input.toString()}" to be valid`
						);
					}
				}
			)
		}
	})
});

function random_ignore_string()
{
	const length = Math.max(
		1,
		Math.min(
			100,
			Math.round(
				Math.random() * 100
			)
		)
	);

	let result = '';

	for (let index = 0; index < length; ++index) {
		result += Math.random() > .5 ? '\t': ' ';
	}

	return result;
}

type from_string_data_set = [
	string,
	'IntermediaryNumber'|'IntermediaryCalculation'|undefined,
	string|undefined,
	string|undefined,
];

function expand_nesting(
	input:from_string_data_set
): [from_string_data_set, ...from_string_data_set[]] {
	const result:[from_string_data_set, ...from_string_data_set[]] = [input];

	const additional_nesting = Math.ceil(Math.random() * 10);

	result.push([
		`${
			'('.repeat(additional_nesting)
		}${
			input[0]
		}${
			')'.repeat(additional_nesting)
		}`,
		input[1],
		input[2],
		input[3],
	]);

	return result;
}

function maybe_expand_whitspace(
	input:from_string_data_set
): from_string_data_set[] {
	const result:from_string_data_set[] = [];

	const regex = /([\t ]+)/g;

	if (regex.test(input[0])) {
		result.push(...expand_nesting([
			input[0].replace(regex, random_ignore_string),
			input[1],
			input[2],
			input[3],
		]));
	} else {
		result.push(...expand_nesting([
			` ${input[0]}`.replace(regex, random_ignore_string),
			input[1],
			input[2],
			input[3],
		]));
		result.push(...expand_nesting([
			`${input[0]} `.replace(regex, random_ignore_string),
			input[1],
			input[2],
			input[3],
		]));
	}

	return result;
}

const regex_has_recursives = /(\d+.(?:\d*(?:\(\d+\)|\[\d+\])r?)|(\d+)r)/;

function expand_ignore_characters(
	input:from_string_data_set,
): [from_string_data_set, ...from_string_data_set[]] {
	const result:[from_string_data_set, ...from_string_data_set[]] = [
		...expand_nesting(input),
		...maybe_expand_whitspace(input),
	];

	if (regex_has_recursives.test(input[0])) {
		result.push(
			...maybe_expand_whitspace([
				input[0].replace(regex_has_recursives, ' $1'),
				input[1],
				input[2],
				input[3],
			]),
			...maybe_expand_whitspace([
				input[0].replace(regex_has_recursives, ' $1 '),
				input[1],
				input[2],
				input[3],
			]),
			...maybe_expand_whitspace([
				input[0].replace(regex_has_recursives, '$1 '),
				input[1],
				input[2],
				input[3],
			]),
		);
	}

	if (/[\t ]/.test(input[0])) {
		result.push([
			input[0].replace(/[\t ]+/g, ''),
			input[1],
			input[2],
			input[3],
		]);
	}

	return result;
}

function expand_fraction_string(
	fraction_string:`${number}.${number}(${number})`
): [from_string_data_set, ...from_string_data_set[]] {
	return [
		...expand_ignore_characters([
			fraction_string,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			`${fraction_string}r`,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			fraction_string.replace('(', '[').replace(')', ']'),
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			`${fraction_string.replace('(', '[').replace(')', ']')}r`,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
	];
}

const from_string_data_sets:from_string_data_set[] = [
	[
		'1',
		'IntermediaryNumber',
		'amount_string',
		'1',
	],
	[
		'1.2r',
		'IntermediaryNumber',
		'Fraction',
		'1.(2)',
	],
	...expand_fraction_string('1.1(23)'),
	...expand_ignore_characters([
		'1.1(23) + 1',
		'IntermediaryCalculation',
		'Fraction + amount_string',
		'2.1(23)',
	]),
	...expand_ignore_characters([
		'1.1(23) + 1 + 2',
		'IntermediaryCalculation',
		'IntermediaryCalculation + amount_string',
		'4.1(23)',
	]),
	...expand_ignore_characters([
		'1.1(23) + 1 * 2',
		'IntermediaryCalculation',
		'IntermediaryCalculation * amount_string',
		'4.2(46)',
	]),
	...expand_ignore_characters([
		'1.1(23) + (1 * 2)',
		'IntermediaryCalculation',
		'Fraction + IntermediaryCalculation',
		'3.1(23)',
	]),
	...expand_ignore_characters([
		'(1.1(23) + 1) * 2',
		'IntermediaryCalculation',
		'IntermediaryCalculation * amount_string',
		'4.2(46)',
	]),
	...expand_ignore_characters([
		'1 + 2 * 3 / 4 % 5 - 6 + 7 * 8 / 9',
		'IntermediaryCalculation',
		'IntermediaryCalculation / amount_string',
		'2.(8)',
	]),
	...expand_ignore_characters([
		'.1 - .2 + .3 * .4 / .5',
		'IntermediaryCalculation',
		'IntermediaryCalculation / amount_string',
		'0.16',
	]),
	...expand_ignore_characters([
		'3 x 5 % 9',
		'IntermediaryCalculation',
		'IntermediaryCalculation % amount_string',
		'6',
	]),
	...expand_ignore_characters([
		'1 + (2/3)',
		'IntermediaryCalculation',
		'amount_string + IntermediaryCalculation',
		'1.(6)',
	]),
	...expand_ignore_characters([
		'1 + 2',
		'IntermediaryCalculation',
		'amount_string + amount_string',
		'3',
	]),
];

void describe('IntermediaryCalculation', () => {
	void it ('does a better job of handling things than native', () => {
		assert.notStrictEqual(
			(0.8 - 0.1).toFixed(16),
			'0.7'
		);
		assert.strictEqual(
			IntermediaryNumber.create(0.8).minus(0.1).toString(),
			'0.7'
		);
		assert.notStrictEqual(
			BigNumber(
				NumberStrings.amount_string('0.333333')
			).times(3).toString(),
			'1'
		),
		assert.strictEqual(
			IntermediaryNumber.create('0.3r').times(3).toString(),
			'1'
		);
	});

	void describe('fromString', () => {
		for (const data_set_raw of from_string_data_sets) {
			const [
				raw_input_string,
				expected_result_type,
				expected_type_info,
				expected_result_string,
			] = data_set_raw;

			for (const input_string of [
				raw_input_string,
				`${random_ignore_string()}${raw_input_string}`,
				`${raw_input_string}${random_ignore_string()}`,
				`${random_ignore_string()}${raw_input_string}${random_ignore_string()}`,
			]) {
				void it (
					`IntermediaryCalculation.fromString(${
						JSON.stringify(input_string)
					}) ${
						undefined === expected_result_type
							? 'throws'
							: 'behaves'
					}`,
					() => {
						const parsed = IntermediaryCalculation.parseString(
							input_string
						);

						const actual_result_type =
							parsed.result?.constructor.name;

						assert.strictEqual(
							actual_result_type,
							expected_result_type
						);

						let result:
							| operand_types
							| undefined;

						const get_result = (
						) => {
							result = IntermediaryCalculation.fromString(
								input_string
							)
						};

						if (undefined === expected_result_type) {
							assert.throws(get_result);
						} else {
							assert.doesNotThrow(get_result);
							not_undefined(result);
							assert.strictEqual(
								result.constructor.name,
								expected_result_type
							);

							assert.strictEqual(
								result.resolve_type,
								expected_type_info
							);

							assert.strictEqual(
								result.toString(),
								expected_result_string
							);
						}
					}
				)
			}
		}
	});
})

void describe('DeferredCalculation', () => {
	void describe('resolve()', () => {
		for (const data_set_raw of from_string_data_sets) {
			const [
				raw_input_string,
				expected_result_type,
				expected_type_info,
				expected_result_string,
			] = data_set_raw;

			for (const input_string of [
				raw_input_string,
				`${random_ignore_string()}${raw_input_string}`,
				`${raw_input_string}${random_ignore_string()}`,
				`${random_ignore_string()}${raw_input_string}${random_ignore_string()}`,
			]) {
				void it (
					`(new DeferredCalculation(${
						JSON.stringify(input_string)
					})).resolve() ${
						undefined === expected_result_type
							? 'throws'
							: 'behaves'
					}`,
					() => {
						let result:
							| IntermediaryNumber
							| IntermediaryCalculation
							| undefined;

						const get_result = (
						) => {
							result = (new DeferredCalculation(
								input_string
							)).resolve()
						};

						const maybe = IntermediaryNumber.create_if_valid(
							input_string
						);

						assert.strictEqual(
							(new DeferredCalculation(input_string)).valid,
							(undefined !== expected_result_type)
						);

						if (undefined === expected_result_type) {
							assert.throws(get_result);
							is_instanceof(maybe, NotValid);
						} else {
							assert.doesNotThrow(get_result);
							not_undefined(result);
							not_undefined(expected_type_info);
							assert.strictEqual(
								result.constructor.name,
								'IntermediaryNumber',
								`expected result type to be IntermediaryNumber, got ${result.constructor.name}`
							);

							assert.strictEqual(
								result.resolve_type,
								(
									expected_type_info.startsWith('Fraction ')
									|| raw_input_string.includes('/')
									|| regex_has_recursives.test(
										raw_input_string
									)
								)
									? 'Fraction'
									: (
										NumberStrings.is_amount_string(
											raw_input_string
										)
											? 'amount_string'
											: 'BigNumber'
									)
							);

							assert.strictEqual(
								result.toString(),
								expected_result_string
							);

							assert.strictEqual(
								(maybe instanceof NotValid),
								false,
								`Expected "${input_string}" to be valid`
							);

							assert.strictEqual(
								(
									maybe as Exclude<typeof maybe, NotValid>
								).toString(),
								expected_result_string,
							);
						}
					}
				)
			}
		}
	})
})


void describe('do_math', () => {
	const data_sets:[
		string,
		'divide'|'minus'|'modulo'|'plus'|'times',
		string,
		string,
	][] = [
		[
			'1',
			'divide',
			'3',
			'0.(3)',
		],
		[
			'1/3',
			'divide',
			'2',
			'0.1(6)',
		],
		[
			'1',
			'divide',
			'2/3',
			'1.5',
		],
		[
			'1/2',
			'divide',
			'3/4',
			'0.(6)',
		],
		[
			'1-2',
			'minus',
			'3',
			'-4',
		],
		[
			'1',
			'minus',
			'2/3',
			'0.(3)',
		],
		[
			'1',
			'modulo',
			'2',
			'1',
		],
		[
			'1/2',
			'modulo',
			'3',
			'0.5',
		],
		[
			'1',
			'plus',
			'2',
			'3',
		],
		[
			'1 + 2',
			'plus',
			'2',
			'5',
		],
		[
			'1',
			'plus',
			'2/3',
			'1.(6)',
		],
		[
			'1',
			'times',
			'2',
			'2',
		],
		[
			'1/2',
			'times',
			'3',
			'1.5',
		],
	];

	for (const data_set of data_sets) {
		const [
			left_operand_input,
			operator_method,
			right_operand_input,
			expectation,
		] = data_set;

		const left_operand = IntermediaryCalculation.fromString(
			left_operand_input
		);

		const right_operand = IntermediaryCalculation.fromString(
			right_operand_input
		);

		void it(
			`IntermediaryCalculation: (${
				left_operand_input
			}) ${
				operator_method
			} (${
				right_operand_input
			}) returns ${
				expectation
			}`,
			() => {
				assert.strictEqual(
					left_operand[operator_method](right_operand).toString(),
					expectation,
				);
			}
		)

		void it(
			`DeferredCalculation: (${
				left_operand_input
			}) ${
				operator_method
			} (${
				right_operand_input
			}) returns ${
				expectation
			}`,
			() => {
				assert.strictEqual(
					(
						new DeferredCalculation(
							left_operand_input
						)
					)[
						operator_method
					](
						new DeferredCalculation(
							right_operand_input
						)
					).resolve().toString(),
					expectation
				)
			}
		)
	}
});

void describe('abs', () => {
	const data_sets:[() => operand_types, string][] = [
		[
			() => IntermediaryNumber.create('-1'),
			'1',
		],
		[
			() => IntermediaryNumber.One,
			'1',
		],
		[
			() => IntermediaryNumber.Zero,
			'0',
		],
		[
			() => IntermediaryCalculation.fromString('1 - 2'),
			'1',
		],
		[
			() => IntermediaryCalculation.fromString('1 + 2'),
			'3',
		],
		[
			() => IntermediaryCalculation.fromString('1 - 1'),
			'0',
		],
		[
			() => new DeferredCalculation('1 - 2'),
			'1',
		],
		[
			() => new DeferredCalculation('1 + 2'),
			'3',
		],
		[
			() => (new DeferredCalculation('1')).minus(2),
			'1',
		],
		[
			() => (new DeferredCalculation('1')).plus(2),
			'3',
		],
		[
			() => (new DeferredCalculation('2 + 3')).minus(5),
			'0',
		],
		[
			() => new DeferredCalculation('0'),
			'0',
		],
	];

	for (let index = 0; index < data_sets.length; ++index) {
		void it (`behaves with data set ${index}`, () => {
			const [
				get_value,
				expectation,
			] = data_sets[index];

			let value:
				| operand_types
				| undefined = undefined;

			assert.doesNotThrow(() => {
				value = get_value();
			});

			assert.strictEqual(
				(
					value as unknown as operand_types
				).abs().toString(),
				expectation
			);

			// double-checking here because
			// DeferredCalculation caches the result
			assert.strictEqual(
				(
					value as unknown as operand_types
				).abs().toString(),
				expectation
			);
		})
	}
})

void describe('max', () => {
	const data_sets:[
		[
			math_types,
			math_types,
			...math_types[],
		],
		string,
	][] = [
		[
			[
				1,
				BigNumber(2),
				new Fraction(3/4),
				IntermediaryNumber.create('5.6r'),
				IntermediaryCalculation.fromString('7 - 8 * 9'),
				new DeferredCalculation('10 + 11', '/ 12'),
			],
			'5.(6)',
		],
	];

	for (const data_set of data_sets) {
		const [[...max_args], expectation] = data_set;

		void it(
			`IntermediaryNumber max with ${
				max_args.map(e => e.toString()).join(', ')
			} returns ${
				expectation
			}`,
			() => {
				const index = Math.min(
					max_args.length - 1,
					Math.floor(Math.random() * max_args.length)
				);

				const initial_arg = IntermediaryNumber.reuse_or_create(
					max_args[index]
				);

				assert.strictEqual(
					initial_arg.max(...max_args).toString(),
					expectation
				);
			}
		)

		void it(
			`IntermediaryCalculation max with ${
				max_args.map(e => e.toString()).join(', ')
			} returns ${
				expectation
			}`,
			() => {
				const index = Math.min(
					max_args.length - 1,
					Math.floor(Math.random() * max_args.length)
				);

				const initial_arg = IntermediaryCalculation.fromString(
					IntermediaryNumber.reuse_or_create(
						max_args[index]
					).toString()
				);

				assert.strictEqual(
					initial_arg.max(...max_args).toString(),
					expectation
				);
			}
		)

		void it(
			`DeferredCalculation max with ${
				max_args.map(e => e.toString()).join(', ')
			} returns ${
				expectation
			}`,
			() => {
				const index = Math.min(
					max_args.length - 1,
					Math.floor(Math.random() * max_args.length)
				);

				const initial_arg = new DeferredCalculation(
					IntermediaryNumber.reuse_or_create(
						max_args[index]
					).toString(),
					' + 0',
				);

				assert.strictEqual(
					initial_arg.max(...max_args).toString(),
					expectation
				);
			}
		)
	}
})

void describe('CanConvertType', () => {
	const data_sets:(
		| [() => CanConvertType, CanConvertTypeJson]
		| [
			() => IntermediaryCalculation|DeferredCalculation,
			CanConvertTypeJson,
			CanConvertTypeJson,
		]
	)[] = [
		[
			() => IntermediaryNumber.One,
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => IntermediaryNumber.Zero.plus(1),
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => new DeferredCalculation('1'),
			{
				type: 'DeferredCalculation',
				value: [
					'1',
				],
			},
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => new DeferredCalculation('0 + 1'),
			{
				type: 'DeferredCalculation',
				value: [
					'0 + 1',
				],
			},
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => (new DeferredCalculation('0')).plus('1'),
			{
				type: 'DeferredCalculation',
				value: [
					'(',
					'0',
					') + (',
					{
						type: 'IntermediaryNumber',
						value: '1',
					},
					')',
				],
			},
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => new IntermediaryCalculation(
				IntermediaryNumber.Zero,
				'+',
				IntermediaryNumber.One,
			),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '0',
				},
				operation: '+',
				right: {
					type: 'IntermediaryNumber',
					value: '1',
				},
			},
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => new IntermediaryCalculation(
				IntermediaryNumber.One,
				'+',
				IntermediaryNumber.Zero,
			),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '1',
				},
				operation: '+',
				right: {
					type: 'IntermediaryNumber',
					value: '0',
				},
			},
			{
				type: 'IntermediaryNumber',
				value: '1',
			},
		],
		[
			() => IntermediaryCalculation.fromString('0 + 1'),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '0',
				},
				operation: '+',
				right: {
					type: 'IntermediaryNumber',
					value: '1',
				},
			},
		],
		[
			() => IntermediaryCalculation.fromString('1 + 0'),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '1',
				},
				operation: '+',
				right: {
					type: 'IntermediaryNumber',
					value: '0',
				},
			},
		],
		[
			() => IntermediaryCalculation.fromString('3 * 1'),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '3',
				},
				operation: '*',
				right: {
					type: 'IntermediaryNumber',
					value: '1',
				},
			},
		],
		[
			() => IntermediaryCalculation.fromString('3 * 2'),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '3',
				},
				operation: '*',
				right: {
					type: 'IntermediaryNumber',
					value: '2',
				},
			},
		],
		[
			() => (new IntermediaryCalculation(
				IntermediaryNumber.One,
				'+',
				IntermediaryCalculation.fromString('1/3')
			)),
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '1',
				},
				operation: '+',
				right: {
					type: 'IntermediaryCalculation',
					left: {
						type: 'IntermediaryNumber',
						value: '1',
					},
					operation: '/',
					right: {
						type: 'IntermediaryNumber',
						value: '3',
					},
				},
			},
			{
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: '4',
				},
				operation: '/',
				right: {
					type: 'IntermediaryNumber',
					value: '3',
				},
			},
		],
	];

	for (let index=0; index < data_sets.length; ++index) {
		const [generator, expectation, resolve_expectation] = data_sets[index];

		void it(
			`CanConvertType().toJSON() with dataset ${
				index
			} returns ${
				JSON.stringify(expectation)
			}`,
			() => {
				let value:CanConvertType|undefined;

				const get_value = () => {
					value = generator();
				};

				assert.doesNotThrow(get_value);

				not_undefined(value);

				assert.deepStrictEqual(
					value.toJSON(),
					expectation
				);

				if (resolve_expectation) {
					assert.deepStrictEqual(
						(value as (
							| IntermediaryCalculation
							| DeferredCalculation
						)).resolve().toJSON(),
						resolve_expectation,
					);
				}
			}
		)
	}
})
