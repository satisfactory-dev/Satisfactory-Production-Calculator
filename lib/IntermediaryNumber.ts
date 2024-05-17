import assert from 'assert';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith';

import {
	amount_string,
	Numbers,
	numeric_string,
} from './Numbers';
import {
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';

export type IntermediaryNumber_input_types =
	| BigNumber
	| Fraction
	| number
	| string;

export type IntermediaryNumber_value_types =
	| BigNumber
	| Fraction
	| numeric_string;

export type IntermediaryNumber_type_types =
	| 'BigNumber'
	| 'Fraction'
	| 'amount_string'
	| 'numeric_string';

export type IntermediaryNumber_math_types =
	| IntermediaryCalculation_operand_types
	| IntermediaryNumber_input_types
	| DeferredCalculation;

export const regex_recurring_number =
	/^-?(\d+\.)(\d+r|\d*\[\d+\]r?|\d*\(\d+\)r?)$/;

export type CanDoMath_result_types =
	| IntermediaryCalculation
	| DeferredCalculation;

interface HasType
{
	get type(): IntermediaryCalculation_operand_type_types;
}

interface CanDoMath<
	ResultType extends CanDoMath_result_types = CanDoMath_result_types,
	ResolveString extends string = IntermediaryNumber_type_types
> extends HasType {
	get resolve_type(): ResolveString;

	divide(
		value:IntermediaryNumber_math_types
	): ResultType;

	minus(
		value:IntermediaryNumber_math_types
	): ResultType;

	modulo(
		value:IntermediaryNumber_math_types
	): ResultType;

	plus(
		value:IntermediaryNumber_math_types
	): ResultType;

	times(
		value:IntermediaryNumber_math_types
	): ResultType;

	abs(): (
		| IntermediaryCalculation
		| IntermediaryNumber
	);
}

interface CanResolveMath<
	T extends CanDoMath_result_types = CanDoMath_result_types
> extends CanDoMath<
	T,
	string
> {
	resolve(): IntermediaryNumber;
}

interface CanConvertType extends HasType
{
	toAmountString(): amount_string;

	toBigNumber(): BigNumber;

	toFraction(): Fraction;

	toString(): string;

	isLessThan(value:number|BigNumber): boolean;

	isGreaterThan(value:number|BigNumber): boolean;

	isZero(): boolean;
}

type CanDoMathWithDispose_operator_types =
	| 'divide'
	| 'minus'
	| 'modulo'
	| 'plus'
	| 'times';

interface CanDoMathWithDispose<
	ResultType extends CanDoMath_result_types = CanDoMath_result_types,
	ResolveString extends string = IntermediaryNumber_type_types
> extends CanConvertType, CanDoMath<
	ResultType,
	ResolveString
> {
	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: IntermediaryNumber_math_types
	): ResultType;
}

interface CanResolveMathWithDispose<
	T extends CanDoMath_result_types = CanDoMath_result_types
> extends
	CanResolveMath<T>,
	CanDoMathWithDispose<T, string>
{
}

function do_math(
	left_operand: IntermediaryNumber|IntermediaryCalculation,
	operator: IntermediaryCalculation_operation_types,
	right_operand: IntermediaryNumber_math_types
) : IntermediaryCalculation {
	return new IntermediaryCalculation(
		left_operand,
		operator,
		IntermediaryNumber.reuse_or_create(right_operand)
	);
}

function abs(
	value:
		| Exclude<
			IntermediaryCalculation_operand_types,
			DeferredCalculation
		>
): Exclude<
	IntermediaryCalculation_operand_types,
	DeferredCalculation
> {
	if (value.isZero()) {
		return value;
	}

	return value.isLessThan(0)
		? IntermediaryNumber.Zero.minus(
			value
		)
		: value;
}

function assert_notStrictEqual<
	T1 = unknown,
	T2 = unknown,
	T3 extends Exclude<T1, T2> = Exclude<T1, T2>
>(
	thing:T1,
	maybe:T2,
	message:Error|string
): asserts thing is T3 {
	assert.notStrictEqual(
		thing,
		maybe,
		message
	);
}

function is_less_than(
	thing:CanConvertType,
	value:number|BigNumber,
	largest_is_less_than:number|BigNumber|undefined
): {
	result: boolean,
	largest_is_less_than: number|BigNumber|undefined
} {
	if (
		(
			0 === value
			|| (
				(value instanceof BigNumber)
				&& 0 === value.comparedTo(0)
			)
		)
		&& thing.isZero()
	) {
		return {
			result: false,
			largest_is_less_than: largest_is_less_than,
		};
	}

	let return_largest_is_less_than = largest_is_less_than;
	let return_boolean:boolean;

	if (undefined === return_largest_is_less_than) {
		return_boolean = thing.toBigNumber().isLessThan(value);

		if (return_boolean) {
			return_largest_is_less_than = value;
		}
	} else if (value <= return_largest_is_less_than) {
		return_boolean = true;
	} else {
		if (
			(value instanceof BigNumber)
			|| (return_largest_is_less_than instanceof BigNumber)
		) {
			const maybe = BigNumber(value).isLessThanOrEqualTo(
				return_largest_is_less_than
			);

			if (maybe) {
				return_boolean = true;
			} else {
				return_boolean = thing.toBigNumber().isLessThan(value);
			}
		} else if (value <= return_largest_is_less_than) {
			return_boolean = true;
		} else {
			return_boolean = thing.toBigNumber().isLessThan(value);
		}

		if (return_boolean) {
			if (
				return_largest_is_less_than instanceof BigNumber
				|| value instanceof BigNumber
			) {
				return_largest_is_less_than = BigNumber.max(
					value,
					return_largest_is_less_than
				);
			} else {
				return_largest_is_less_than = Math.max(
					value,
					return_largest_is_less_than
				);
			}
		}
	}

	return {
		result: return_boolean,
		largest_is_less_than: return_largest_is_less_than,
	};
}

function is_greater_than(
	thing:CanConvertType,
	value:number|BigNumber,
	smallest_is_greater_than:number|BigNumber|undefined
): {
	result: boolean,
	smallest_is_greater_than: number|BigNumber|undefined
} {
	if (
		(
			0 === value
			|| (
				(value instanceof BigNumber)
				&& 0 === value.comparedTo(0)
			)
		)
		&& thing.isZero()
	) {
		return {
			result: false,
			smallest_is_greater_than: smallest_is_greater_than,
		};
	}

	let return_smallest_is_greater_than = smallest_is_greater_than;
	let return_boolean:boolean;

	if (undefined === return_smallest_is_greater_than) {
		return_boolean = thing.toBigNumber().isGreaterThan(value);

		if (return_boolean) {
			return_smallest_is_greater_than = value;
		}
	} else if (value <= return_smallest_is_greater_than) {
		return_boolean = true;
	} else {
		if (
			(value instanceof BigNumber)
			|| (return_smallest_is_greater_than instanceof BigNumber)
		) {
			const maybe = BigNumber(value).isGreaterThanOrEqualTo(
				return_smallest_is_greater_than
			);

			if (maybe) {
				return_boolean = true;
			} else {
				return_boolean = thing.toBigNumber().isGreaterThan(value);
			}
		} else if (value >= return_smallest_is_greater_than) {
			return_boolean = true;
		} else {
			return_boolean = thing.toBigNumber().isGreaterThan(value);
		}

		if (return_boolean) {
			if (
				return_smallest_is_greater_than instanceof BigNumber
				|| value instanceof BigNumber
			) {
				return_smallest_is_greater_than = BigNumber.min(
					value,
					return_smallest_is_greater_than
				);
			} else {
				return_smallest_is_greater_than = Math.min(
					value,
					return_smallest_is_greater_than
				);
			}
		}
	}

	return {
		result: return_boolean,
		smallest_is_greater_than: return_smallest_is_greater_than,
	};
}

const conversion_cache = new class {
	private deferred_abs_cache:undefined|WeakMap<DeferredCalculation, (
		| IntermediaryNumber
		| IntermediaryCalculation
	)>;
	private toAmountString_cache:undefined|WeakMap<
		CanConvertType,
		amount_string
	>;
	private toBigNumber_cache:WeakMap<CanConvertType, BigNumber>|undefined;
	private toFraction_cache:WeakMap<CanConvertType, Fraction>|undefined;
	private toString_cache:WeakMap<CanConvertType, string>|undefined;

	get AmountString(): WeakMap<CanConvertType, amount_string>
	{
		if (!this.toAmountString_cache) {
			this.toAmountString_cache = new WeakMap();
		}

		return this.toAmountString_cache;
	}

	get BigNumber(): WeakMap<CanConvertType, BigNumber>
	{
		if (!this.toBigNumber_cache) {
			this.toBigNumber_cache = new WeakMap();
		}

		return this.toBigNumber_cache;
	}

	get DeferredCalculation_abs(): WeakMap<DeferredCalculation, (
		| IntermediaryNumber
		| IntermediaryCalculation
	)> {
		if (!this.deferred_abs_cache) {
			this.deferred_abs_cache = new WeakMap();
		}

		return this.deferred_abs_cache;
	}

	get Fraction(): WeakMap<CanConvertType, Fraction>
	{
		if (!this.toFraction_cache) {
			this.toFraction_cache = new WeakMap();
		}

		return this.toFraction_cache;
	}

	get String(): WeakMap<CanConvertType, string>
	{
		if (!this.toString_cache) {
			this.toString_cache = new WeakMap();
		}

		return this.toString_cache;
	}

	dispose(of:CanConvertType)
	{
		if (of instanceof DeferredCalculation && this.deferred_abs_cache) {
			this.deferred_abs_cache.delete(of);
		}

		for (const cache of [
			this.toAmountString_cache,
			this.toBigNumber_cache,
			this.toFraction_cache,
			this.toString_cache,
		]) {
			if (cache) {
				cache.delete(of);
			}
		}
	}
}

export class IntermediaryNumber implements CanDoMathWithDispose
{
	private largest_is_less_than:BigNumber|number|undefined = undefined;
	private smallest_is_greater_than:BigNumber|number|undefined = undefined;

	private readonly value:IntermediaryNumber_value_types;

	static readonly One = new this(BigNumber(1));

	static readonly Zero = new this('0');

	protected constructor(value:IntermediaryNumber_value_types)
	{
		this.value = value;
	}

	get resolve_type(): IntermediaryNumber_type_types {
		return this.type;
	}

	get type(): IntermediaryNumber_type_types
	{
		if (this.value instanceof BigNumber) {
			return 'BigNumber';
		} else if (this.value instanceof Fraction) {
			return 'Fraction';
		} else if (Numbers.is_amount_string(this.value)) {
			return 'amount_string';
		}

		return 'numeric_string';
	}

	abs()
	{
		return abs(this);
	}

	divide(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '/', value);
	}

	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: IntermediaryNumber_math_types
	): CanDoMath_result_types {
		const result = this[operator](right_operand);

		conversion_cache.dispose(this);

		return result;
	}

	isGreaterThan(value: number|BigNumber): boolean {
		const {
			result,
			smallest_is_greater_than,
		} = is_greater_than(this, value, this.smallest_is_greater_than);

		this.smallest_is_greater_than = smallest_is_greater_than;

		return result;
	}

	isLessThan(value: number|BigNumber): boolean {
		const {
			result,
			largest_is_less_than,
		} = is_less_than(this, value, this.largest_is_less_than);

		this.largest_is_less_than = largest_is_less_than;

		return result;
	}

	isZero(): boolean {
		if (this.value instanceof Fraction) {
			return 0 === this.value.compare(0);
		}

		return 0 === this.toBigNumber().comparedTo(0);
	}

	minus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '%', value);
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
		if (Numbers.is_amount_string(this.value)) {
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

		const cache = conversion_cache.BigNumber;

		if (cache.has(this)) {
			return cache.get(this) as BigNumber;
		}

		const value = BigNumber(this.value);
		cache.set(this, value);

		return value;
	}

	toFraction(): Fraction
	{
		if (this.value instanceof Fraction) {
			return this.value;
		}

		const cache = conversion_cache.Fraction;

		if (cache.has(this)) {
			return cache.get(this) as Fraction;
		}

		const value = new Fraction(this.toString());
		cache.set(this, value);

		return value;
	}

	toString()
	{
		if (this.value instanceof BigNumber) {
			return this.value.toFixed();
		}

		return this.value.toString();
	}

	static create(
		input: IntermediaryNumber_input_types
	): IntermediaryNumber {
		if (
			input instanceof BigNumber
			|| input instanceof Fraction
			|| Numbers.is_numeric_string(input)
		) {
			return new this(input);
		} else if ('number' === typeof input) {
			return new this(BigNumber(input));
		} else if (is_string(input) && regex_recurring_number.test(input)) {
			let only_last_digit_recurring = false;
			if (/^\d*\.\d+r$/.test(input)) {
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

	static reuse_or_create(
		input:
			| IntermediaryCalculation_operand_types
			| IntermediaryNumber_input_types
	): IntermediaryCalculation_operand_types {
		return (
			(
				(input instanceof IntermediaryNumber)
				|| (input instanceof IntermediaryCalculation)
				|| (input instanceof DeferredCalculation)
			)
				? input
				: this.create(input)
		);
	}
}

export type IntermediaryCalculation_operand_types =
	| IntermediaryNumber
	| IntermediaryCalculation
	| DeferredCalculation;

export type IntermediaryCalculation_operation_types =
	| '+'
	| '-'
	| '*'
	| 'x'
	| '/'
	| '%';

export type IntermediaryCalculation_operand_type_types =
	| IntermediaryNumber_type_types
	| 'IntermediaryCalculation'
	| 'DeferredCalculation';

const BigNumber_operation_map:{
	[
		key in Exclude<
			IntermediaryCalculation_operation_types,
			'/'
		>
	]: ((a: BigNumber, b:BigNumber) => BigNumber)
} = {
	'+': (a, b) => a.plus(b),
	'-': (a, b) => a.minus(b),
	'x': (a, b) => a.times(b),
	'*': (a, b) => a.times(b),
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

export class IntermediaryCalculation implements CanResolveMathWithDispose
{
	private largest_is_less_than:number|BigNumber|undefined = undefined;
	private smallest_is_greater_than:number|BigNumber|undefined = undefined;

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

	get resolve_type(): string {
		return `${this.left_type} ${this.operation} ${this.right_type}`;
	}

	get right_type(): IntermediaryCalculation_operand_type_types
	{
		if (this.right_operand instanceof IntermediaryCalculation) {
			return 'IntermediaryCalculation';
		}

		return this.right_operand.type;
	}

	get type(): IntermediaryCalculation_operand_type_types
	{
		return 'IntermediaryCalculation';
	}

	abs()
	{
		return abs(this);
	}

	divide(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '/', value);
	}

	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: IntermediaryNumber_math_types
	): CanDoMath_result_types {
		const result = this[operator](right_operand);

		conversion_cache.dispose(this);

		return result;
	}

	isGreaterThan(value: number|BigNumber): boolean {
		const {
			result,
			smallest_is_greater_than,
		} = is_greater_than(this, value, this.smallest_is_greater_than);

		this.smallest_is_greater_than = smallest_is_greater_than;

		return result;
	}

	isLessThan(value: number|BigNumber): boolean {
		const {
			result,
			largest_is_less_than,
		} = is_less_than(this, value, this.largest_is_less_than);

		this.largest_is_less_than = largest_is_less_than;

		return result;
	}

	isZero(): boolean {
		return 0 === this.toBigNumber().comparedTo(0);
	}

	minus(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:IntermediaryNumber_math_types)
	{
		return do_math(this, '%', value);
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

	toAmountString(): amount_string {
		const cache = conversion_cache.AmountString;

		if (cache.has(this)) {
			return cache.get(this) as amount_string;
		}

		const value = this.resolve().toAmountString();
		cache.set(this, value);

		return value;
	}

	toBigNumber(): BigNumber {
		const cache = conversion_cache.BigNumber;

		if (cache.has(this)) {
			return cache.get(this) as BigNumber;
		}

		const value = this.resolve().toBigNumber()
		cache.set(this, value);

		return value;
	}

	toFraction(): Fraction {
		const cache = conversion_cache.Fraction;

		if (cache.has(this)) {
			return cache.get(this) as Fraction;
		}

		const value = this.resolve().toFraction();
		cache.set(this, value);

		return value;
	}

	toString(): string {
		const cache = conversion_cache.String;

		if (cache.has(this)) {
			return cache.get(this) as string;
		}

		const value = this.resolve().toString();
		cache.set(this, value);

		return value;
	}

	private operand_to_IntermediaryNumber(
		operand:IntermediaryCalculation_operand_types
	) : IntermediaryNumber {
		if (
			(operand instanceof IntermediaryCalculation)
			|| (operand instanceof DeferredCalculation)
		) {
			return operand.resolve();
		} else if (
			'amount_string' === operand.type
			|| 'numeric_string' === operand.type
		) {
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

		not_undefined(
			result.result,
			new IntermediaryCalculationTokenizerError(
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
			)
		)

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

			assert_notStrictEqual<number, -1, Exclude<number, -1>>(
				next,
				-1,
				new IntermediaryCalculationTokenizerError(
					'Unsupported token when expecting skip to start of right operand!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					},
					next
				)
			);

			was.skip_to_index = (next >= 1) ? (index + next) : -1;

			return was;
		}

		function tokenizer_found_operation(
			was: IntermediaryCalculation_tokenizer,
			is:IntermediaryCalculation_operation_types,
			index: number,
			array: string[],
		) : IntermediaryCalculation_tokenizer {
			if (
				'' !== was.current_operation_buffer
				&& (
					undefined !== was.result
					|| '' !== was.current_left_operand_buffer
				)
				&& was.current_right_operand_buffer
			) {
				was = determine_result(
					was,
					is,
					index,
					array
				);
			}

			assert.strictEqual(
				was.current_operation_buffer,
				'',
				new IntermediaryCalculationTokenizerError(
					'Cannot have an operator following another operator',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					}
				)
			);

			was.current_operation_buffer = is;

			assert_notStrictEqual(
				was.operand_mode,
				'left',
				new IntermediaryCalculationTokenizerError(
					'Expecting to switch to left operand mode, already there!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					}
				)
			)

			if ('right' === was.operand_mode) {
				if (
					'' === was.current_right_operand_buffer
				) {
					return was;
				}

				const maybe_process_buffers = (
					undefined === was.result
					|| '' === was.current_left_operand_buffer
				)

				assert_notStrictEqual(
					maybe_process_buffers,
					false,
					new IntermediaryCalculationTokenizerError(
						'Cannot switch to new calculation!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						}
					)
				)

				try {
					was.result = new IntermediaryCalculation(
						(
							(undefined === was.result)
								? IntermediaryNumber.create(
									was.current_left_operand_buffer
								)
								: was.result
						),
						is,
						IntermediaryNumber.create(
							was.current_right_operand_buffer
						)
					);
					was.current_operation_buffer = '';
					was.current_left_operand_buffer = '';
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

				return skip_for_right_operand(was, is, index, array);
			}

			return skip_for_right_operand(was, is, index, array);
		}

		function determine_result(
			was: IntermediaryCalculation_tokenizer,
			is:string,
			index: number,
			array: string[],
		): IntermediaryCalculation_tokenizer {
			assert.strictEqual(
				(
					'only_numeric' === was.operand_mode
					|| 'right' === was.operand_mode
				),
				true,
				new IntermediaryCalculationTokenizerError(
					'Unsupported operation!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					}
				)
			)

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

				return was;
			}

			assert_notStrictEqual(
				was.current_operation_buffer,
				'',
				new IntermediaryCalculationTokenizerError(
					'Cannot resolve to calculation without an operator!',
					{
						tokenizer: was,
						current_token: is,
						current_index: index,
						all_tokens: array,
					},
				)
			)

			let left:IntermediaryCalculation|IntermediaryNumber;

			try {
				left = undefined === was.result
					? IntermediaryNumber.create(
						was.current_left_operand_buffer
					)
					: was.result;
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

			try {
				was.result = new IntermediaryCalculation(
					left,
					was.current_operation_buffer,
					IntermediaryNumber.create(
						was.current_right_operand_buffer
					),
				);
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

			was.current_left_operand_buffer = '';
			was.current_operation_buffer = '';
			was.current_right_operand_buffer = '';

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
					assert.notStrictEqual(
						was.skip_to_index < index,
						true,
						new IntermediaryCalculationTokenizerError(
							'Cannot skip backwards!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						)
					)

					if (was.skip_to_index > index) {
						return was;
					}

					was.skip_to_index = -1;
				}

				let add_buffer = false;

				if (
					'leading_ignore' === was.mode
					&& 'only_numeric' === was.operand_mode
					&& (
						0 === index
						|| (
							undefined === was.result
							&& '' === was.current_left_operand_buffer
						)
					)
					&& '-' === is
				) {
					add_buffer = true;
					was.mode = 'integer_or_decimal_left';
				} else if (
					'leading_ignore' === was.mode
					&& !'\t '.includes(is)
				) {
					assert.strictEqual(
						'0123456789.(-'.includes(is),
						true,
						new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to switch away from ignoring leading characters!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						)
					);

					if (
						'0123456789.'.includes(is)
					) {
						add_buffer = true;
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
					}
				} else if (
					'nesting' === was.mode
				) {
					const maybe_is_recursive_open = '(['.includes(is);
					const maybe_is_recursive_passthrough = (
						`0123456789.\t ${
							Object.keys(Fraction_operation_map).join('')
						}`.includes(is)
						|| (
							'r' === is
							&& index >= 2
							&& ')]'.includes(array[index - 1])
							&& '0123456789'.includes(array[index - 2])
						)
					);
					const maybe_is_recursive_close = ')' === is;

					assert.strictEqual(
						(
							maybe_is_recursive_open
							|| maybe_is_recursive_passthrough
							|| maybe_is_recursive_close
						),
						true,
						new IntermediaryCalculationTokenizerError(
							'Unsupported action within nesting!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						)
					);

					if (maybe_is_recursive_open) {
						const corresponding = {
							'(': ')',
							'[': ']',
						};

						assert.strictEqual(
							index >= 1,
							true,
							new IntermediaryCalculationTokenizerError(
								'Unsupported left parenthetical!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						)

						const maybe_was_decimal = '0123456789.'.includes(
							array[index - 1]
						);

						const maybe_was_recursive = (
							'(\t '.includes(array[index - 1])
							&& '(' === is
						);

						assert.strictEqual(
							maybe_was_decimal || maybe_was_recursive,
							true,
							new IntermediaryCalculationTokenizerError(
								'Unsupported action within parenthetical!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						);

						if (maybe_was_decimal) {
							const next = array.slice(index + 1).findIndex(
								maybe => corresponding[
									is as keyof typeof corresponding
								] === maybe
							);

							if (next >= 0) {
								was.skip_to_index = index + next + 2;

								return was;
							}
						} else if (
							maybe_was_recursive
						) {
							++was.current_nesting;

							return was;
						}
					} else if (
						maybe_is_recursive_passthrough
					) {
						return was;
					} else if (maybe_is_recursive_close) {
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
								(
									undefined === was.result
									|| '' === was.current_right_operand_buffer
								),
								true,
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

							const nested_result = this.fromString(
								this.initial_tokenizer_state(
									array.slice(
										was.nesting_start + 1,
										was.nesting_end
									)
								)
							);

							if (
								was.result
								|| '' !== was.current_left_operand_buffer
							) {
								assert_notStrictEqual(
									(
										undefined === was.result
										&& '' === was.current_left_operand_buffer
									),
									true,
									new IntermediaryCalculationTokenizerError(
										'Cannot use nested operation as right operand if no operator has been specified!',
										{
											tokenizer: was,
											current_token: is,
											current_index: index,
											all_tokens: array,
										}
									)
								);

								was.result = new IntermediaryCalculation(
									(
										was.result
											? was.result
											: IntermediaryNumber.create(
												was.current_left_operand_buffer
											)
									),
									was.current_operation_buffer as Exclude<
										typeof was.current_operation_buffer,
										''
									>,
									nested_result
								);
							} else {
								was.result = nested_result;
							}

							was.mode = 'trailing_ignore';
							was.operand_mode = 'right';
							was.current_left_operand_buffer = '';
							was.current_right_operand_buffer = '';
							was.current_operation_buffer = '';
							was.nesting_start = -1;
							was.nesting_end = -1;
						}

						return was;
					}
				}

				assert.strictEqual(
					(
						'integer_or_decimal_left' === was.mode
						|| 'decimal_right' === was.mode
						|| 'leading_ignore' === was.mode
						|| 'trailing_ignore' === was.mode
					),
					true,
					new IntermediaryCalculationTokenizerError(
						'Could not determine appropriate action!',
						{
							tokenizer: was,
							current_token: is,
							current_index: index,
							all_tokens: array,
						}
					)
				)

				if (
					'integer_or_decimal_left' === was.mode
				) {
					if (
						'0123456789'.includes(is)
						|| (
							'-' === is
							&& (
								0 === index
								|| (
									undefined === was.result
									&& '' === was.current_left_operand_buffer
								)
							)
							&& add_buffer
						)
					) {
						add_buffer = true;
					} else if (
						'.' === is
					) {
						add_buffer = true;
						was.mode = 'decimal_right';
					} else if (switch_to_trailing_ignore(is, index, array)) {
						was.mode = 'trailing_ignore';

						return was;
					} else {
						assert.strictEqual(
							(
								'\t '.includes(is)
								|| (is in Fraction_operation_map)
							),
							true,
							new IntermediaryCalculationTokenizerError(
								'Unsupported token when expecting to be buffering a numeric string!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						);

						if (
							'\t '.includes(is)
						) {
							if (
								undefined === was.result
								&& '' !== was.current_left_operand_buffer
								&& '' !== was.current_operation_buffer
								&& '' !== was.current_right_operand_buffer
							) {
								return determine_result(
									was,
									is,
									index,
									array
								);
							}

							const next = array.slice(index).findIndex(
								maybe => !'\t '.includes(maybe)
							);

							if (next >= 1) {
								was.skip_to_index = index + next;

								return was;
							}
						} else if (
							is in Fraction_operation_map
						) {
							return tokenizer_found_operation(
								was,
								is as keyof typeof Fraction_operation_map,
								index,
								array
							);
						}
					}
				} else if (
					'decimal_right' === was.mode
				) {
					if (
						'0123456789.'.includes(is)
					) {
						add_buffer = true;
					} else if (
						'r()[]'.includes(is)
					) {
						assert.strictEqual(
							(
								(
									(
										'only_numeric' === was.operand_mode
										|| 'left' === was.operand_mode
									)
									&& was.current_left_operand_buffer.includes(
										is
									)
								)
								|| was.current_right_operand_buffer.includes(
									is
								)
							),
							false,
							new IntermediaryCalculationTokenizerError(
								'Operand is already recursive!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						)

						add_buffer = true;
					} else if (switch_to_trailing_ignore(is, index, array)) {
						was.mode = 'trailing_ignore';

						return was;
					} else {
						assert.strictEqual(
							(
								'\t '.includes(is)
								|| (is in Fraction_operation_map)
							),
							true,
							new IntermediaryCalculationTokenizerError(
								'Unsupported token when expecting to be buffering the decimal portion of a numeric string!',
								{
									tokenizer: was,
									current_token: is,
									current_index: index,
									all_tokens: array,
								}
							)
						);

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
							is in Fraction_operation_map
						) {
							return tokenizer_found_operation(
								was,
								is as keyof typeof Fraction_operation_map,
								index,
								array
							);
						}
					}
				} else if (
					'leading_ignore' === was.mode
				) {
					const maybe_is_ignore_characters = '\t '.includes(is);
					const maybe_is_math_operation = (
						is in Fraction_operation_map
					);
					const maybe_should_switch_to_integer_or_decimal_mode = (
						undefined !== array[index + 1]
						&& !'\t '.includes(array[index + 1])
					);

					assert.strictEqual(
						(
							maybe_is_ignore_characters
							|| maybe_is_math_operation
							|| maybe_should_switch_to_integer_or_decimal_mode
						),
						true,
						new IntermediaryCalculationTokenizerError(
							'Unsupported token when expecting to be ignoring leading characters!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						)
					)

					if (
						maybe_is_ignore_characters
					) {
						add_buffer = false;
					} else if (
						maybe_is_math_operation
					) {
						return tokenizer_found_operation(
							was,
							is as keyof typeof Fraction_operation_map,
							index,
							array
						);
					} else if (
						maybe_should_switch_to_integer_or_decimal_mode
					) {
						was.mode = 'integer_or_decimal_left';
					}
				} else if (
					'trailing_ignore' === was.mode
				) {
					if (
						'(' === is
					) {
						was.mode = 'nesting';

						if (0 === was.current_nesting) {
							was.nesting_start = index;
						}

						++was.current_nesting;

						return was;
					}

					const maybe_is_ignore_characters = '\t '.includes(is);
					const maybe_is_math_operation = (
						is in Fraction_operation_map
					);
					const maybe_is_digit = '0123456789'.includes(is);

					assert.strictEqual(
						(
							maybe_is_ignore_characters
							|| maybe_is_math_operation
							|| maybe_is_digit
						),
						true,
						new IntermediaryCalculationTokenizerError(
							'Expecting trailing space past this point!',
							{
								tokenizer: was,
								current_token: is,
								current_index: index,
								all_tokens: array,
							}
						)
					)

					if (
						maybe_is_ignore_characters
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
						maybe_is_math_operation
					) {
						return tokenizer_found_operation(
							was,
							is as keyof typeof Fraction_operation_map,
							index,
							array
						);
					} else if (
						maybe_is_digit
					) {
						add_buffer = true;
						was.mode = 'integer_or_decimal_left';
					}
				}

				if (add_buffer) {
					if (
						'only_numeric' === was.operand_mode
						|| 'left' === was.operand_mode
					) {
						was.current_left_operand_buffer += is;
					} else {
						was.current_right_operand_buffer += is;
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

export type DeferredCalculation_parts =
	| string
	| IntermediaryNumber_math_types;

export class DeferredCalculation implements
	CanResolveMathWithDispose<
		DeferredCalculation
	>
{
	private internal_value:[
		DeferredCalculation_parts,
		...DeferredCalculation_parts[],
	];
	private largest_is_less_than:number|BigNumber|undefined = undefined;
	private smallest_is_greater_than:number|BigNumber|undefined = undefined;

	private static cached_intermediary = new WeakMap<
		DeferredCalculation,
		(
			| IntermediaryNumber
			| IntermediaryCalculation
		)
	>();

	constructor(
		value:DeferredCalculation_parts,
		...additional_parts:DeferredCalculation_parts[]
	) {
		this.internal_value = [value, ...additional_parts];
	}

	get resolve_type(): string {
		if (DeferredCalculation.cached_intermediary.has(this)) {
			return (
				DeferredCalculation.cached_intermediary.get(
					this
				) as (
					| IntermediaryNumber
					| IntermediaryCalculation
				)
			).resolve_type;
		}

		return this.value;
	}

	get type(): IntermediaryCalculation_operand_type_types
	{
		return 'DeferredCalculation';
	}

	get value(): string
	{
		return this.internal_value.reduce(
			(was, is) => {
				if (is_string(is)) {
					was.push(is);
				} else {
					was.push(
						(is instanceof BigNumber)
							? is.toFixed()
							: is.toString()
					);
				}

				return was;
			},
			[] as string[]
		).join(' ').replace(/\s+/g, ' ').trim();
	}

	abs() {
		if (this.isZero()) {
			return IntermediaryNumber.Zero;
		}

		const cache = conversion_cache.DeferredCalculation_abs;

		if (!cache.has(this)) {
			cache.set(this, this.parse().abs());
		}

		return cache.get(this) as IntermediaryNumber|IntermediaryCalculation;
	}

	divide(value: IntermediaryNumber_math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') / (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: IntermediaryNumber_math_types
	): DeferredCalculation {
		const result = this[operator](right_operand);

		conversion_cache.dispose(this);
		DeferredCalculation.cached_intermediary.delete(this);

		return result;
	}

	isGreaterThan(value: number|BigNumber): boolean {
		const {
			result,
			smallest_is_greater_than,
		} = is_greater_than(this, value, this.smallest_is_greater_than);

		this.smallest_is_greater_than = smallest_is_greater_than;

		return result;
	}

	isLessThan(value: number|BigNumber): boolean {
		const {
			result,
			largest_is_less_than,
		} = is_less_than(this, value, this.largest_is_less_than);

		this.largest_is_less_than = largest_is_less_than;

		return result;
	}

	isZero(): boolean {
		if (
			1 === this.internal_value.length
			&& '0' === this.internal_value[0]
		) {
			return true;
		}

		return 0 === this.toBigNumber().comparedTo(0);
	}

	minus(value: IntermediaryNumber_math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') - (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	modulo(value: IntermediaryNumber_math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') % (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	plus(value: IntermediaryNumber_math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') + (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	resolve(): IntermediaryNumber {
		const result = this.parse();

		return (
			(result instanceof IntermediaryNumber)
				? result
				: result.resolve()
		);
	}

	times(value: IntermediaryNumber_math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') x (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	toAmountString(): amount_string {
		return this.parse().toAmountString();
	}

	toBigNumber(): BigNumber {
		return this.parse().toBigNumber();
	}

	toFraction(): Fraction {
		return this.parse().toFraction();
	}

	toString(): string {
		const cache = conversion_cache.String;

		if (cache.has(this)) {
			return cache.get(this) as string;
		}

		const value = this.resolve().toString();
		cache.set(this, value);

		return value;
	}

	private parse()
	{
		if (!DeferredCalculation.cached_intermediary.has(this)) {
			DeferredCalculation.cached_intermediary.set(this, IntermediaryCalculation.fromString(
				this.value
			));
		}

		return DeferredCalculation.cached_intermediary.get(this) as (
			| IntermediaryNumber
			| IntermediaryCalculation
		);
	}
}
