import assert from 'assert';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith';

import {
	amount_string,
	Numbers,
} from './Numbers';

export type IntermediaryNumber_input_types =
	| BigNumber
	| Fraction
	| number
	| string;

export type IntermediaryNumber_value_types =
	| BigNumber
	| Fraction
	| amount_string;

export type IntermediaryNumber_type_types =
	| 'BigNumber'
	| 'Fraction'
	| 'amount_string';

export type IntermediaryNumber_math_types =
	| IntermediaryCalculation
	| IntermediaryNumber
	| IntermediaryNumber_input_types;

export const regex_recurring_number =
	/^(\d+\.)(\d+r|\d*\[\d+\]r?|\d*\(\d+\)r?)$/;

interface CanDoMath
{
	divide(
		value:IntermediaryNumber_math_types
	): IntermediaryCalculation;

	minus(
		value:IntermediaryNumber_math_types
	): IntermediaryCalculation;

	modulo(
		value:IntermediaryNumber_math_types
	): IntermediaryCalculation;

	plus(
		value:IntermediaryNumber_math_types
	): IntermediaryCalculation;

	times(
		value:IntermediaryNumber_math_types
	): IntermediaryCalculation;
}

function do_math(
	left_operand: IntermediaryNumber|IntermediaryCalculation,
	operator: IntermediaryCalculation_operation_types,
	right_operand: IntermediaryNumber_math_types
) : IntermediaryCalculation {
	const right_value =  (
		(right_operand instanceof IntermediaryNumber)
		|| (right_operand instanceof IntermediaryCalculation)
	)
		? right_operand
		: IntermediaryNumber.create(right_operand);

	return new IntermediaryCalculation(
		left_operand,
		operator,
		right_value
	);
}

export class IntermediaryNumber implements CanDoMath
{
	private readonly value:IntermediaryNumber_value_types;

	protected constructor(value:IntermediaryNumber_value_types)
	{
		this.value = value;
	}

	get type(): IntermediaryNumber_type_types
	{
		if (this.value instanceof BigNumber) {
			return 'BigNumber';
		} else if (this.value instanceof Fraction) {
			return 'Fraction';
		}

		return 'amount_string';
	}

	divide(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '/', value);
	}

	minus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	plus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '+', value);
	}

	times(value:IntermediaryNumber_math_types)
	{
		return do_math(this, 'x', value);
	}

	toAmountString(): amount_string
	{
		if (is_string(this.value)) {
			return this.value;
		}

		return Numbers.round_off(this.toBigNumber());
	}

	toBigNumber(): BigNumber
	{
		if (this.value instanceof BigNumber) {
			return this.value;
		} else if (this.value instanceof Fraction) {
			return Numbers.fraction_to_BigNumber(this.value);
		}

		return BigNumber(this.value);
	}

	toFraction(): Fraction
	{
		if (this.value instanceof Fraction) {
			return this.value;
		}

		return new Fraction(this.value.toString());
	}

	toString()
	{
		return this.value.toString();
	}

	static create(
		input: IntermediaryNumber_input_types
	): IntermediaryNumber {
		if (
			input instanceof BigNumber
			|| input instanceof Fraction
			|| Numbers.is_amount_string(input)
		) {
			return new this(input);
		} else if ('number' === typeof input) {
			return new this(BigNumber(input));
		} else if (is_string(input) && regex_recurring_number.test(input)) {
			let only_last_digit_recurring = false;
			if (/^\d\.\d+r$/.test(input)) {
				only_last_digit_recurring = true;
			}

			if (input.endsWith('r')) {
				input = input.substring(0, input.length - 1);
			}

			if (only_last_digit_recurring) {
				input = input.replace(/(\d)$/, '($1)');
			} else if (input.includes('[')) {
				input = input.replace(/\[(\d+)\]/, '($1)');
			}

			return new this(new Fraction(input));
		}

		throw new Error('Unsupported argument specified!');
	}
}

export type IntermediaryCalculation_operand_types =
	| IntermediaryNumber
	| IntermediaryCalculation;

export type IntermediaryCalculation_operation_types =
	| '+'
	| '-'
	| '*'
	| 'x'
	| '/'
	| '%';

export type IntermediaryCalculation_operand_type_types =
	| IntermediaryNumber_type_types
	| 'IntermediaryCalculation';

const BigNumber_operation_map:{
	[
		key in IntermediaryCalculation_operation_types
	]: ((a: BigNumber, b:BigNumber) => BigNumber)
} = {
	'+': (a, b) => a.plus(b),
	'-': (a, b) => a.minus(b),
	'x': (a, b) => a.times(b),
	'*': (a, b) => a.times(b),
	'/': (a, b) => a.div(b),
	'%': (a, b) => a.modulo(b),
};

const Fraction_operation_map:{
	[
		key in IntermediaryCalculation_operation_types
	]: ((a: Fraction, b:Fraction) => Fraction)
} = {
	'+': (a, b) => a.add(b),
	'-': (a, b) => a.sub(b),
	'x': (a, b) => a.mul(b),
	'*': (a, b) => a.mul(b),
	'/': (a, b) => a.div(b),
	'%': (a, b) => a.mod(b),
};

type IntermediaryCalculation_tokenizer = {
	result: IntermediaryNumber|IntermediaryCalculation|undefined,
	mode:
		| 'leading_ignore'
		| 'trailing_ignore'
		| 'integer_or_decimal_left'
		| 'decimal_right'
		| 'decimal_recursive_pattern'
		| 'operation'
		| 'nesting',
	operand_mode: 'only_numeric'|'left'|'right',
	current_left_operand_buffer: string,
	current_operation_buffer: ''|IntermediaryCalculation_operation_types,
	current_right_operand_buffer: string,
	current_nesting: number,
	nesting_start: number,
	nesting_end: number,
	index: number,
	array: string[],
	skip_to_index: number,
};

type IntermediaryCalculation_tokenizer_state = {
	tokenizer: IntermediaryCalculation_tokenizer,
	current_token: string,
	current_index: number,
	all_tokens: string[],
};

export class IntermediaryCalculationTokenizerError extends Error
{
	readonly previous:unknown;
	readonly state:IntermediaryCalculation_tokenizer_state;

	constructor(
		message:string,
		state:IntermediaryCalculation_tokenizer_state,
		previous?:unknown
	) {
		super(message);
		this.state = state;
		this.previous = previous;
	}
}

export class IntermediaryCalculation implements CanDoMath
{
	readonly left_operand:IntermediaryCalculation_operand_types;
	readonly operation:IntermediaryCalculation_operation_types;
	readonly right_operand:IntermediaryCalculation_operand_types;

	constructor(
		left:IntermediaryCalculation_operand_types,
		operation:IntermediaryCalculation_operation_types,
		right:IntermediaryCalculation_operand_types
	) {
		this.left_operand = left;
		this.operation = operation;
		this.right_operand = right;
	}

	get left_type(): IntermediaryCalculation_operand_type_types
	{
		if (this.left_operand instanceof IntermediaryCalculation) {
			return 'IntermediaryCalculation';
		}

		return this.left_operand.type;
	}

	get right_type(): IntermediaryCalculation_operand_type_types
	{
		if (this.right_operand instanceof IntermediaryCalculation) {
			return 'IntermediaryCalculation';
		}

		return this.right_operand.type;
	}

	divide(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '/', value);
	}

	minus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	plus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '+', value);
	}

	resolve(): IntermediaryNumber
	{
		const left = this.operand_to_IntermediaryNumber(this.left_operand);
		const right = this.operand_to_IntermediaryNumber(this.right_operand);

		if (
			'/' === this.operation
			|| 'Fraction' === left.type
			|| 'Fraction' === right.type
		) {
			return IntermediaryNumber.create(
				Fraction_operation_map[this.operation](
					left.toFraction(),
					right.toFraction()
				)
			);
		}

		return IntermediaryNumber.create(
			BigNumber_operation_map[this.operation](
				left.toBigNumber(),
				right.toBigNumber()
			)
		);
	}

	times(value:IntermediaryNumber_math_types)
	{
		return do_math(this, 'x', value);
	}

	toString()
	{
		return this.resolve().toString();
	}

	private operand_to_IntermediaryNumber(
		operand:IntermediaryCalculation_operand_types
	) : IntermediaryNumber {
		if (operand instanceof IntermediaryCalculation) {
			return operand.resolve();
		} else if ('amount_string' === operand.type) {
			return IntermediaryNumber.create(
				'/' === this.operation
					? operand.toFraction()
					: operand.toBigNumber()
			);
		}

		return operand;
	}

	static fromString(
		input:string|IntermediaryCalculation_tokenizer
	): IntermediaryNumber|IntermediaryCalculation {
		const result = is_string(input) ? this.parseString(input) : (
			(undefined === input.result)
				? this.parseState(input)
				: input
		);

		if (undefined === result.result) {
			throw new IntermediaryCalculationTokenizerError(
				'No result found after parsing input!',
				is_string(input)
					? {
						tokenizer: result,
						current_token: '',
						current_index: input.length - 1,
						all_tokens: input.split(''),
					}
					: {
						tokenizer: result,
						current_token: '',
						current_index: input.index,
						all_tokens: input.array,
					}
			);
		}

		return result.result;
	}

	static parseString(input:string): IntermediaryCalculation_tokenizer
	{
		const input_array = input.split('');

		const tokenizer_state = this.initial_tokenizer_state(input_array);

		return this.parseState(tokenizer_state);
	}

	private static initial_tokenizer_state(
		input_array: string[]
	): IntermediaryCalculation_tokenizer {
		return {
			result: undefined,
			mode: 'leading_ignore',
			operand_mode: 'only_numeric',
			current_left_operand_buffer: '',
			current_right_operand_buffer: '',
			current_operation_buffer: '',
			current_nesting: 0,
			nesting_start: -1,
			nesting_end: -1,
			index: 0,
			array: input_array,
			skip_to_index: -1,
		};
	}

	private static parseState(
		input:IntermediaryCalculation_tokenizer
	): IntermediaryCalculation_tokenizer {

		function switch_to_trailing_ignore(
			is:string,
			index:number,
			array:string[]
		) {
			return (
				'\t '.includes(is)
				&& undefined === array.slice(index).find(
					maybe => !'\t '.includes(maybe)
				)
			);
		}

		function skip_for_right_operand(
			was: IntermediaryCalculation_tokenizer,
			is:''|IntermediaryCalculation_operation_types,
			index: number,
			array: string[],
		) {
			was.operand_mode = 'right';
			was.mode = 'leading_ignore';

			const next = array.slice(index + 1).findIndex(
				maybe => !'\t '.includes(maybe)
			);

			if (next >= 1) {
				was.skip_to_index = index + next;

				return was;
			}

			throw new IntermediaryCalculationTokenizerError(
				'Unsupported token when expecting skip to start of right operand!',
				{
					tokenizer: was,
					current_token: is,
					current_index: index,
					all_tokens: array,
				}
			);
		}

		function tokenizer_found_operation(
			was: IntermediaryCalculation_tokenizer,
			is:IntermediaryCalculation_operation_types,
			index: number,
			array: string[],
		) : IntermediaryCalculation_tokenizer {
			if ('left' === was.operand_mode) {
				throw new IntermediaryCalculationTokenizerError(
					'Expecting to switch to left operand mode, already there!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					}
				);
			} else if ('right' === was.operand_mode) {
				if (undefined === was.result) {
					was.result = new IntermediaryCalculation(
						IntermediaryNumber.create(
							was.current_left_operand_buffer
						),
						is,
						IntermediaryNumber.create(
							was.current_right_operand_buffer
						)
					);
					was.current_left_operand_buffer = '';
					was.current_right_operand_buffer = '';

					skip_for_right_operand(was, is, index, array);

					return was;
				}

					throw new IntermediaryCalculationTokenizerError(
						'Cannot switch to new calculation!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						}
					);
			}

			was.current_operation_buffer = is;

			return skip_for_right_operand(was, is, index, array);
		}

		function determine_result(
			was: IntermediaryCalculation_tokenizer,
			is:string,
			index: number,
			array: string[],
		): IntermediaryCalculation_tokenizer {
			if ('only_numeric' === was.operand_mode) {
				try {
					was.result = IntermediaryNumber.create(
						was.current_left_operand_buffer
					);
					was.current_left_operand_buffer = '';
				} catch (err) {
					throw new IntermediaryCalculationTokenizerError(
						'Unsupported left operand buffer!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						},
						err
					);
				}
			} else if ('right' === was.operand_mode) {
				if ('' === was.current_operation_buffer) {
					throw new IntermediaryCalculationTokenizerError(
						'Cannot resolve to calculation without an operator!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						},
					);
				}

				try {
					was.result = new IntermediaryCalculation(
						undefined === was.result
							? IntermediaryNumber.create(
								was.current_left_operand_buffer
							)
							: was.result,
						was.current_operation_buffer,
						IntermediaryNumber.create(
							was.current_right_operand_buffer
						),
					);
					was.current_left_operand_buffer = '';
					was.current_operation_buffer = '';
					was.current_right_operand_buffer = '';
				} catch (err) {
					throw new IntermediaryCalculationTokenizerError(
						'Unsupported operand buffers!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						},
						err
					);
				}
			} else {
				throw new IntermediaryCalculationTokenizerError(
					'Unsupported operation!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					}
				);
			}

			return was;
		}

		const result = input.array.reduce(
			(
				was: IntermediaryCalculation_tokenizer,
				is: string,
				index: number,
				array: string[],
			): IntermediaryCalculation_tokenizer => {
				was.index = index;

				if (was.skip_to_index !== -1) {
					if (was.skip_to_index < index) {
						throw new IntermediaryCalculationTokenizerError(
							'Cannot skip backwards!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					} else if (was.skip_to_index > index) {
						return was;
					}

					was.skip_to_index = -1;
				}

				let add_buffer = false;

				if (
					'leading_ignore' === was.mode
					&& !'\t '.includes(is)
				) {
					if (
						'0123456789'.includes(is)
					) {
						was.mode = 'integer_or_decimal_left';
					} else if (
						'(' === is
					) {
						was.mode = 'nesting';

						if (0 === was.current_nesting) {
							was.nesting_start = index;
						}

						++was.current_nesting;

						return was;
					} else {
						throw new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to switch away from ignoring leading characters!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				} else if (
					'nesting' === was.mode
				) {
					if ('(' === is) {
						if (index >= 1) {
							if ('0123456789.'.includes(array[index - 1])) {
								const next = array.slice(index + 1).findIndex(
									maybe => ')' === maybe
								);

								if (next >= 0) {
									was.skip_to_index = index + next + 2;

									return was;
								}
							}

							throw new IntermediaryCalculationTokenizerError(
								'Unsupported action within parenthetical!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							);
						}

						throw new IntermediaryCalculationTokenizerError(
							'Unsupported left parenthetical!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					} else if (`0123456789.\t ${Object.keys(BigNumber_operation_map).join('')}`.includes(is)) {
						return was;
					} else if (')' === is) {
						was.nesting_end = index;
						--was.current_nesting;

						assert.strictEqual(
							was.current_nesting >= 0,
							true,
							new IntermediaryCalculationTokenizerError(
								'de-nested too far!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						);

						if (0 === was.current_nesting) {
							assert.strictEqual(
								was.nesting_start >= 0,
								true,
								new IntermediaryCalculationTokenizerError(
									'Cannot de-nest if nesting not started!',
									{
										tokenizer: was,
										current_token: is,
										current_index: index,
										all_tokens: array,
									}
								)
							);
							assert.strictEqual(
								was.result,
								undefined,
								new IntermediaryCalculationTokenizerError(
									'Cannot de-nest if result already set!',
									{
										tokenizer: was,
										current_token: is,
										current_index: index,
										all_tokens: array,
									}
								)
							);

							was.result = this.fromString(
								this.initial_tokenizer_state(
									array.slice(
										was.nesting_start + 1,
										was.nesting_end
									)
								)
							);

							was.mode = 'trailing_ignore';
							was.operand_mode = 'right';
							was.current_left_operand_buffer = '';
							was.current_right_operand_buffer = '';
							was.nesting_start = -1;
							was.nesting_end = -1;
						}

						return was;
					} else {
						throw new IntermediaryCalculationTokenizerError(
							'Unsupported action within nesting!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				}

				if (
					'integer_or_decimal_left' === was.mode
				) {
					if (
						'0123456789'.includes(is)
					) {
						add_buffer = true;
					} else if (
						'.' === is
					) {
						add_buffer = true;
						was.mode = 'decimal_right';
					} else if (switch_to_trailing_ignore(is, index, array)) {
						was.mode = 'trailing_ignore';
					} else {
						if (
							'\t '.includes(is)
						) {
							const next = array.slice(index).findIndex(
								maybe => !'\t '.includes(maybe)
							);

							if (next >= 1) {
								was.skip_to_index = index + next;

								return was;
							}
						} else if (
							is in BigNumber_operation_map
						) {
							return tokenizer_found_operation(
								was,
								is as keyof typeof BigNumber_operation_map,
								index,
								array
							);
						}

						throw new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to be buffering a numeric string!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				} else if (
					'decimal_right' === was.mode
				) {
					if (
						'0123456789'.includes(is)
					) {
						add_buffer = true;
					} else if (
						'r()[]'.includes(is)
					) {
						if (
							(
								(
									'only_numeric' === was.operand_mode
									|| 'left' === was.operand_mode
								)
								&& was.current_left_operand_buffer.includes(
									is
								)
							)
							|| was.current_right_operand_buffer.includes(is)
						) {
							throw new IntermediaryCalculationTokenizerError(
								'Operand is already recursive!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							);
						} else {
							add_buffer = true;
						}
					} else if (switch_to_trailing_ignore(is, index, array)) {
						was.mode = 'trailing_ignore';
					} else {
						if (
							'\t '.includes(is)
						) {
							const next = array.slice(index).findIndex(
								maybe => !'\t '.includes(maybe)
							);

							if (next >= 1) {
								was.skip_to_index = index + next;

								return was;
							}
						} else if (
							is in BigNumber_operation_map
						) {
							return tokenizer_found_operation(
								was,
								is as keyof typeof BigNumber_operation_map,
								index,
								array
							);
						}

						throw new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to be buffering the decimal portion of a numeric string!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				} else if (
					'leading_ignore' === was.mode
				) {
					if (
						'\t '.includes(is)
					) {
						add_buffer = false;
					} else if (
						undefined !== array[index + 1]
						&& !'\t '.includes(array[index + 1])
					) {
						was.mode = 'integer_or_decimal_left';
					} else {
						throw new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to be ignoring leading characters!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				} else if (
					'trailing_ignore' === was.mode
				) {
					if (
						'\t '.includes(is)
					) {
						const next = array.slice(index).findIndex(
							maybe => !'\t '.includes(maybe)
						);

						if (next >= 1) {
							was.skip_to_index = index + next;

							return was;
						} else if (-1 === next) {
							was.skip_to_index = array.length - 1;

							if (undefined === was.result) {
								return determine_result(
									was,
									is,
									index,
									array
								);
							}

							return was;
						}
					} else if (
						is in BigNumber_operation_map
					) {
						was.current_operation_buffer = (
							is as keyof typeof BigNumber_operation_map
						);
						was.mode = 'integer_or_decimal_left';

						return was;
					}

					throw new IntermediaryCalculationTokenizerError(
						'Expecting trailing space past this point!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						}
					);
				} else {
					throw new IntermediaryCalculationTokenizerError(
						'Could not determine appropriate action!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						}
					);
				}

				if (add_buffer) {
					if (
						'only_numeric' === was.operand_mode
						|| 'left' === was.operand_mode
					) {
						was.current_left_operand_buffer += is;
					} else if ('right' === was.operand_mode) {
						was.current_right_operand_buffer += is;
					} else {
						throw new IntermediaryCalculationTokenizerError(
							'Expected to add to bufer, but unsupported operation!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						);
					}
				}

				return was;
			},
			input
		);

		if (
			undefined === result.result
			|| (
				undefined !== result.result
				&& '' !== result.current_right_operand_buffer
			)
		) {
			return determine_result(
				result,
				input.array[input.array.length - 1],
				input.array.length - 1,
				input.array
			);
		}

		return result;
	}
}
