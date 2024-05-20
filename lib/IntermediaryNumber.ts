import assert from 'assert';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith';
import {
	amount_string,
	NumberStrings,
} from './NumberStrings';
import {
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';
import {
	require_non_empty_array,
} from '@satisfactory-clips-archive/docs.json.ts/lib/ArrayUtilities';
import type {
	input_types,
	type_property_types,
	value_types,
} from './IntermediaryNumberTypes';

export type math_types =
	| operand_types
	| input_types
	| DeferredCalculation;

export const regex_recurring_number =
	/^-?(\d+\.)(\d+r|\d*\[\d+\]r?|\d*\(\d+\)r?)$/;

export type CanDoMath_result_types =
	| IntermediaryNumber
	| IntermediaryCalculation
	| DeferredCalculation;

interface HasType
{
	get type(): operand_type_property_types;
}

interface CanDoMath<
	ResultType extends CanDoMath_result_types = CanDoMath_result_types,
	ResolveString extends string = type_property_types
> extends HasType {
	get resolve_type(): ResolveString;

	compare(
		value:math_types
	): -1|0|1;

	divide(
		value:math_types
	): ResultType;

	minus(
		value:math_types
	): ResultType;

	modulo(
		value:math_types
	): ResultType;

	plus(
		value:math_types
	): ResultType;

	times(
		value:math_types
	): ResultType;

	abs(): (
		| IntermediaryCalculation
		| IntermediaryNumber
	);

	max(
		first: math_types,
		...remaining: math_types[]
	): math_types;
}

interface CanResolveMath<
	T extends CanDoMath_result_types = CanDoMath_result_types
> extends CanDoMath<
	T,
	string
> {
	resolve(): IntermediaryNumber;
}

export type CanConvertTypeJson =
	| {
		type: 'IntermediaryNumber',
		value: string,
	}
	| {
		type: 'IntermediaryCalculation',
		left: CanConvertTypeJson,
		operation: operation_types,
		right: CanConvertTypeJson,
	}
	| {
		type: 'DeferredCalculation',
		value: [string|CanConvertTypeJson, ...(string|CanConvertTypeJson)[]],
	}

export interface CanConvertType extends HasType
{
	toAmountString(): amount_string;

	toBigNumber(): BigNumber;

	toBigNumberOrFraction(): BigNumber|Fraction;

	toFraction(): Fraction;

	toString(): string;

	isLessThan(value:math_types): boolean;

	isGreaterThan(value:math_types): boolean;

	isOne(): boolean;

	isZero(): boolean;

	toJSON(): CanConvertTypeJson;
}

type CanDoMathWithDispose_operator_types =
	| 'divide'
	| 'minus'
	| 'modulo'
	| 'plus'
	| 'times';

interface CanDoMathWithDispose<
	ResultType extends CanDoMath_result_types = CanDoMath_result_types,
	ResolveString extends string = type_property_types
> extends CanConvertType, CanDoMath<
	ResultType,
	ResolveString
> {
	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: math_types
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
	operator: operation_types,
	right_operand: math_types
) : operand_types {
	return IntermediaryCalculation.maybe_short_circuit(
		left_operand,
		operator,
		IntermediaryNumber.reuse_or_create(right_operand)
	);
}

function abs(
	value:
		| Exclude<
			operand_types,
			DeferredCalculation
		>
): Exclude<
	operand_types,
	DeferredCalculation
> {
	if (value.isZero()) {
		return value;
	}

	return (value.isLessThan(0)
		? IntermediaryNumber.Zero.minus(
			value
		)
		: value
	) as Exclude<
		operand_types,
		DeferredCalculation
	>;
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

function compare(
	value: math_types,
	to: CanConvertType
): 0|1|-1 {
	const comparable = IntermediaryNumber.reuse_or_create(
		value
	).toBigNumberOrFraction();

	let result:number|null;

	if (comparable instanceof BigNumber) {
		result = to.toBigNumber().comparedTo(comparable);
	} else {
		result = to.toFraction().compare(comparable);
	}

	assert.strictEqual(
		(
			-1 === result
			|| 0 === result
			|| 1 === result
		),
		true,
		`Expecting -1, 0, or 1, receieved ${JSON.stringify(result)}`
	);

	return result as -1|0|1;
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

export function dispose(value:operand_types)
{
	conversion_cache.dispose(value);

	if (value instanceof DeferredCalculation) {
		value.dispose();
	}
}

function max(
	first: math_types,
	second: math_types,
	...remaining: math_types[]
): math_types {
	let max = IntermediaryNumber.reuse_or_create(first);

	for (const entry of [second, ...remaining]) {
		const maybe = IntermediaryNumber.reuse_or_create(entry);
		if (-1 === max.compare(maybe)) {
			max = maybe;
		}
	}

	return IntermediaryNumber.reuse_or_create(max);
}

export class IntermediaryNumber implements CanDoMathWithDispose
{
	private readonly value:value_types;

	static readonly One = new this('1');

	static readonly Zero = new this('0');

	protected constructor(value:value_types)
	{
		this.value = value;
	}

	get resolve_type(): type_property_types {
		return this.type;
	}

	get type(): type_property_types
	{
		if (this.value instanceof BigNumber) {
			return 'BigNumber';
		} else if (this.value instanceof Fraction) {
			return 'Fraction';
		} else if (NumberStrings.is_amount_string(this.value)) {
			return 'amount_string';
		}

		return 'numeric_string';
	}

	abs()
	{
		return abs(this);
	}

	compare(value: math_types): 0 | 1 | -1 {
		return compare(value, this);
	}

	divide(value:math_types)
	{
		return do_math(this, '/', value);
	}

	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: math_types
	): CanDoMath_result_types {
		const result = this[operator](right_operand);

		if (result !== this) {
			dispose(this);
		}

		return result;
	}

	isGreaterThan(value: math_types): boolean {
		return 1 === this.compare(value);
	}

	isLessThan(value: math_types): boolean {
		return -1 === this.compare(value);
	}

	isOne(): boolean
	{
		return 0 === this.compare(1);
	}

	isZero(): boolean {
		return 0 === this.compare(0);
	}

	max(
		first: math_types,
		...remaining: math_types[]
	): math_types {
		return max(this, first, ...remaining);
	}

	minus(value:math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:math_types)
	{
		return do_math(this, '%', value);
	}

	plus(value:math_types)
	{
		if (this.isZero()) {
			return IntermediaryNumber.reuse_or_create(value);
		}

		return do_math(this, '+', value);
	}

	times(value:math_types)
	{
		return do_math(this, 'x', value);
	}

	toAmountString(): amount_string
	{
		if (NumberStrings.is_amount_string(this.value)) {
			return this.value;
		}

		return NumberStrings.round_off(this.toBigNumberOrFraction());
	}

	toBigNumber(): BigNumber
	{
		if (this.value instanceof BigNumber) {
			return this.value;
		} else if (this.value instanceof Fraction) {
			return BigNumber(this.value.valueOf());
		}

		const cache = conversion_cache.BigNumber;

		if (cache.has(this)) {
			return cache.get(this) as BigNumber;
		}

		const value = BigNumber(this.value);
		cache.set(this, value);

		return value;
	}

	toBigNumberOrFraction(): BigNumber | Fraction {
		return ('Fraction' === this.type)
			? this.toFraction()
			: this.toBigNumber();
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

	toJSON(): CanConvertTypeJson {
		if (this.isOne()) {
			return {
				type: 'IntermediaryNumber',
				value: '1',
			};
		} else if (this.isZero()) {
			return {
				type: 'IntermediaryNumber',
				value: '0',
			};
		}

		if (this.value instanceof Fraction) {
			const [left, right] = this.value.toFraction().split('/');

			return {
				type: 'IntermediaryCalculation',
				left: {
					type: 'IntermediaryNumber',
					value: left,
				},
				operation: '/',
				right: {
					type: 'IntermediaryNumber',
					value: right,
				},
			};
		} else if (this.value instanceof BigNumber) {
			return {
				type: 'IntermediaryNumber',
				value: this.value.toFixed(),
			};
		}

		return {
			type: 'IntermediaryNumber',
			value: this.value,
		};
	}

	toString()
	{
		if (this.value instanceof BigNumber) {
			return this.value.toFixed();
		}

		return this.value.toString();
	}

	static create(
		input: input_types
	): IntermediaryNumber {
		if ('' === input) {
			return IntermediaryNumber.Zero;
		}

		if (input instanceof Fraction) {
			return new this(input.simplify(1 / (2 ** 52)));
		}
		if (
			input instanceof BigNumber
			|| NumberStrings.is_numeric_string(input)
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

	static create_if_valid(
		maybe:string
	): operand_types|NotValid {
		maybe = maybe.trim();

		if (
			NumberStrings.is_amount_string(maybe)
			|| NumberStrings.is_numeric_string(maybe)
		) {
			return IntermediaryNumber.create(maybe)
		} else if (
			/^(\d+|\d*\.\d+)\s*[+/*x%-]\s*(\d+|\d*\.\d+)$/.test(maybe)
		) {
			return new DeferredCalculation(maybe);
		}

		const scientific = /^(-?\d+(?:\.\d+))e([+-])(\d+)$/.exec(maybe);

		if (scientific) {
			try {
				const calc = new IntermediaryCalculation(
					IntermediaryNumber.Zero,
					scientific[2] as '+'|'-',
					IntermediaryNumber.create(scientific[3]),
				).toBigNumberOrFraction();

				return IntermediaryNumber.create(scientific[1]).times(
					(calc instanceof BigNumber)
						? BigNumber(10).pow(calc)
						: (new Fraction(10)).pow(calc)
				);
			} catch (err) {
				return new NotValid(maybe, err);
			}
		}

		try {
			return IntermediaryCalculation.fromString(maybe);
		} catch (err) {
			return new NotValid(maybe, err);
		}
	}

	static fromJson(json:CanConvertTypeJson): CanDoMath_result_types {
		if ('IntermediaryNumber' === json.type) {
			return this.create(json.value);
		} else if ('IntermediaryCalculation' === json.type) {
			return new IntermediaryCalculation(
				this.fromJson(json.left),
				json.operation,
				this.fromJson(json.right)
			);
		}

		return new DeferredCalculation(require_non_empty_array(json.value.map(
			e => is_string(e) ? e : this.fromJson(e)
		)));
	}

	static reuse_or_create(
		input:
			| operand_types
			| input_types
	): operand_types {
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

export class NotValid extends Error
{
	readonly reason: unknown;
	readonly value:string;

	constructor(not_valid:string, reason:unknown)
	{
		super('Value given was not valid!');

		this.value = not_valid;
		this.reason = reason;
	}
}

export type operand_types =
	| IntermediaryNumber
	| IntermediaryCalculation
	| DeferredCalculation;

export type operation_types =
	| '+'
	| '-'
	| '*'
	| 'x'
	| '/'
	| '%';

export type operand_type_property_types =
	| type_property_types
	| 'IntermediaryCalculation'
	| 'DeferredCalculation';

const BigNumber_operation_map:{
	[
		key in Exclude<
			operation_types,
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
		key in operation_types
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
	current_operation_buffer: ''|operation_types,
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

export class UnexpectedTokenWhenExpecting extends
	IntermediaryCalculationTokenizerError
{
	constructor(
		message:string,
		state:IntermediaryCalculation_tokenizer_state,
		previous?:unknown
	) {
		super(
			`Unexpected token when expecting ${message}`,
			state,
			previous
		)
	}
}

function skip_for_right_operand(
	was: IntermediaryCalculation_tokenizer,
	is:''|operation_types,
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

function tokenizer_found_operation(
	was: IntermediaryCalculation_tokenizer,
	is:operation_types,
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

function initial_tokenizer_state(
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

function tokenizer_reduce(
	was: IntermediaryCalculation_tokenizer,
	is: string,
	index: number,
	array: string[],
): IntermediaryCalculation_tokenizer {
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
			new UnexpectedTokenWhenExpecting(
				'to switch away from ignoring leading characters!',
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

				const nested_result = IntermediaryCalculation.fromString(
					initial_tokenizer_state(
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
						new UnexpectedTokenWhenExpecting(
							'a preceding operator the nested right operand',
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
				new UnexpectedTokenWhenExpecting(
					'to be buffering a numeric string!',
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
				new UnexpectedTokenWhenExpecting(
					'to be buffering the decimal portion of a numeric string!',
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
			new UnexpectedTokenWhenExpecting(
				'to be ignoring leading characters!',
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
}

export class IntermediaryCalculation implements CanResolveMathWithDispose
{
	readonly left_operand:operand_types;
	readonly operation:operation_types;
	readonly right_operand:operand_types;

	constructor(
		left:operand_types,
		operation:operation_types,
		right:operand_types
	) {
		this.left_operand = left;
		this.operation = operation;
		this.right_operand = right;
	}

	get left_type(): operand_type_property_types
	{
		if (this.left_operand instanceof IntermediaryCalculation) {
			return 'IntermediaryCalculation';
		}

		return this.left_operand.type;
	}

	get resolve_type(): string {
		return `${this.left_type} ${this.operation} ${this.right_type}`;
	}

	get right_type(): operand_type_property_types
	{
		if (this.right_operand instanceof IntermediaryCalculation) {
			return 'IntermediaryCalculation';
		}

		return this.right_operand.type;
	}

	get type(): operand_type_property_types
	{
		return 'IntermediaryCalculation';
	}

	abs()
	{
		return abs(this);
	}

	compare(value: math_types): 0 | 1 | -1 {
		return compare(value, this);
	}

	divide(value:math_types)
	{
		return do_math(this, '/', value);
	}

	do_math_then_dispose(
		operator: CanDoMathWithDispose_operator_types,
		right_operand: math_types
	): CanDoMath_result_types {
		const result = this[operator](right_operand);

		if (result !== this) {
			dispose(this);
		}

		return result;
	}

	isGreaterThan(value: math_types): boolean {
		return 1 === this.compare(value);
	}

	isLessThan(value: math_types): boolean {
		return -1 === this.compare(value);
	}

	isOne(): boolean {
		return 0 === this.compare(1);
	}

	isZero(): boolean {
		return 0 === this.compare(0);
	}

	max(
		first: math_types,
		...remaining: math_types[]
	): math_types {
		return max(this, first, ...remaining);
	}

	minus(value:math_types)
	{
		return do_math(this, '-', value);
	}

	modulo(value:math_types)
	{
		return do_math(this, '%', value);
	}

	plus(value:math_types)
	{
		if (this.isZero()) {
			return IntermediaryNumber.reuse_or_create(value);
		}

		return do_math(this, '+', value);
	}

	resolve(): IntermediaryNumber
	{
		const left_operand = this.operand_to_IntermediaryNumber(
			this.left_operand
		);
		const right_operand = this.operand_to_IntermediaryNumber(
			this.right_operand
		);
		const left = left_operand.toBigNumberOrFraction();
		const right = right_operand.toBigNumberOrFraction();

		if (
			'/' === this.operation
			|| left instanceof Fraction
			|| right instanceof Fraction
		) {
			return IntermediaryNumber.create(
				Fraction_operation_map[this.operation](
					(
						(left instanceof BigNumber)
							? left_operand.toFraction()
							: left
					),
					(
						(right instanceof BigNumber)
							? right_operand.toFraction()
							: right
					)
				)
			);
		}

		return IntermediaryNumber.create(
			BigNumber_operation_map[this.operation](
				left,
				right
			)
		);
	}

	times(value:math_types)
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

	toBigNumberOrFraction(): BigNumber | Fraction {
		return this.resolve().toBigNumberOrFraction();
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

	toJSON(): CanConvertTypeJson {
		return {
			type: 'IntermediaryCalculation',
			left: (
				(this.left_operand instanceof DeferredCalculation)
					? this.left_operand.toJSON()
					: this.operand_to_IntermediaryNumber(
						this.left_operand
					).toJSON()
			),
			operation: this.operation,
			right: (
				(this.right_operand instanceof DeferredCalculation)
					? this.right_operand.toJSON()
					: this.operand_to_IntermediaryNumber(
						this.right_operand
					).toJSON()
			),
		}
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
		operand:operand_types
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
					: operand.toBigNumberOrFraction()
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

	static maybe_short_circuit(
		left:operand_types,
		operation:operation_types,
		right:operand_types
	) {
		let value:operand_types|undefined = undefined;

		if ('+' === operation) {
			if (left.isZero()) {
				value = right;
			} else if (right.isZero()) {
				value = left;
			}
		} else if ('-' === operation && right.isZero()) {
			value = left;
		} else if ('*x'.includes(operation)) {
			if (left.isZero() || right.isOne()) {
				value = left;
			} else if (right.isZero() || left.isOne()) {
				value = right;
			}
		} else if ('/' === operation && right.isOne()) {
			value = left;
		}

		if (undefined === value) {
			value = new IntermediaryCalculation(left, operation, right);
		}

		if (value instanceof IntermediaryCalculation) {
			return value.resolve();
		}

		return value;
	}

	static parseString(input:string): IntermediaryCalculation_tokenizer
	{
		const input_array = input.split('');

		const tokenizer_state = initial_tokenizer_state(input_array);

		return this.parseState(tokenizer_state);
	}

	private static parseState(
		input:IntermediaryCalculation_tokenizer
	): IntermediaryCalculation_tokenizer {
		const result = input.array.reduce(
			tokenizer_reduce,
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
	| math_types;

export class DeferredCalculation implements
	CanResolveMathWithDispose<
		DeferredCalculation
	>
{
	private internal_value:[
		DeferredCalculation_parts,
		...DeferredCalculation_parts[],
	];

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

	get type(): operand_type_property_types
	{
		return 'DeferredCalculation';
	}

	get valid(): boolean
	{
		if (DeferredCalculation.cached_intermediary.has(this)) {
			return true;
		}

		const maybe = IntermediaryNumber.create_if_valid(this.value);

		if (!(maybe instanceof NotValid)) {
			DeferredCalculation.cached_intermediary.set(
				this,
				(maybe instanceof DeferredCalculation)
					? maybe.resolve()
					: (IntermediaryNumber.reuse_or_create(
						maybe
					) as Exclude<
						operand_types,
						DeferredCalculation
					>)
			);

			return true;
		}

		return false;
	}

	get value(): string
	{
		return this.normalise_string(this.internal_value.reduce(
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
		).join(' '));
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

	compare(value: math_types): 0 | 1 | -1 {
		if (value instanceof DeferredCalculation) {
			const a = this.value;
			const b = value.value;

			if (a === b) {
				return 0;
			} else if (
				NumberStrings.is_numeric_string(a)
				&& NumberStrings.is_numeric_string(b)
			) {
				return IntermediaryNumber.create(a).compare(
					IntermediaryNumber.create(b)
				);
			}
		}

		return compare(value, this);
	}

	dispose()
	{
		conversion_cache.dispose(this);
		DeferredCalculation.cached_intermediary.delete(this);
	}

	divide(value: math_types): DeferredCalculation {
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
		right_operand: math_types
	): DeferredCalculation {
		const result = this[operator](right_operand);

		if (result !== this) {
			this.dispose();
		}

		return result;
	}

	isGreaterThan(value: math_types): boolean {
		return 1 === this.compare(value);
	}

	isLessThan(value: math_types): boolean {
		return -1 === this.compare(value);
	}

	isOne(): boolean {
		if (
			1 === this.internal_value.length
			&& '1' === this.internal_value[0]
		) {
			return true;
		}

		return 0 === this.compare(1);
	}

	isZero(): boolean {
		if (
			1 === this.internal_value.length
			&& '0' === this.internal_value[0]
		) {
			return true;
		}

		return 0 === this.compare(0);
	}

	max(
		first: math_types,
		...remaining: math_types[]
	): math_types {
		return max(this, first, ...remaining);
	}

	minus(value: math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') - (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	modulo(value: math_types): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			...this.internal_value,
			') % (',
			IntermediaryNumber.reuse_or_create(value),
			')',
		);
	}

	plus(value: math_types): DeferredCalculation {
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

	reuse_or_dispose(compared_to:string): DeferredCalculation
	{
		compared_to = this.normalise_string(compared_to);

		if (compared_to === this.value) {
			return this;
		}

		this.dispose();

		return new DeferredCalculation(compared_to);
	}

	times(value: math_types): DeferredCalculation {
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

	toBigNumberOrFraction() : BigNumber|Fraction
	{
		return this.resolve().toBigNumberOrFraction();
	}

	toFraction(): Fraction {
		return this.parse().toFraction();
	}

	toJSON(): CanConvertTypeJson {
		const value = require_non_empty_array(this.internal_value.map(
			e => (
				is_string(e)
					? e
					: IntermediaryNumber.reuse_or_create(e).toJSON()
			)
		));

		return {
			type: 'DeferredCalculation',
			value,
		};
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

	private normalise_string(value:string): string
	{
		return value.replace(/\s+/g, ' ').trim();
	}

	private parse()
	{
		if (!DeferredCalculation.cached_intermediary.has(this)) {
			DeferredCalculation.cached_intermediary.set(
				this,
				IntermediaryCalculation.fromString(
					this.value
				)
			);
		}

		return DeferredCalculation.cached_intermediary.get(this) as (
			| IntermediaryNumber
			| IntermediaryCalculation
		);
	}
}
