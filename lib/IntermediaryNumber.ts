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
import type {
	input_types,
	type_property_types,
	value_types,
} from './IntermediaryNumberTypes';
import {
	TokenScan,
} from './TokenScan';

export type math_types =
	| operand_types
	| input_types;

export const regex_recurring_number =
	/^-?(\d+\.)(\d+r|\d*\[\d+\]r?|\d*\(\d+\)r?)$/;

export type CanDoMath_result_types =
	| IntermediaryNumber
	| IntermediaryCalculation;

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
	};

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
	return IntermediaryCalculation.maybe_reduce_operands(
		left_operand,
		operator,
		IntermediaryNumber.reuse_or_create(right_operand)
	);
}

function abs(
	value:
		| operand_types
): operand_types {
	if (value.isZero()) {
		return value;
	}

	return (value.isLessThan(0)
		? IntermediaryNumber.Zero.minus(
			value
		)
		: value
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

			if (undefined === right) {
				return {
					type: 'IntermediaryNumber',
					value: left,
				};
			}

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
		input:string
	): operand_types|NotValid {
		const maybe = input.trim();

		if (
			NumberStrings.is_amount_string(maybe)
			|| NumberStrings.is_numeric_string(maybe)
		) {
			return IntermediaryNumber.create(maybe)
		} else if (
			/^(\d+|\d*\.\d+)\s*[+/*x%-]\s*(\d+|\d*\.\d+)$/.test(maybe)
		) {
			return (new TokenScan(input)).parsed;
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
		}

		return new IntermediaryCalculation(
			this.fromJson(json.left),
			json.operation,
			this.fromJson(json.right)
		);
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
	| IntermediaryCalculation;

export type operation_types =
	| '+'
	| '-'
	| '*'
	| 'x'
	| '/'
	| '%';

export type operand_type_property_types =
	| type_property_types
	| 'IntermediaryCalculation';

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
		const left = this.operand_to_IntermediaryNumber(
			this.left_operand
		);

		const right = this.operand_to_IntermediaryNumber(
			this.right_operand
		);

		const maybe = IntermediaryCalculation.maybe_short_circuit(
			left,
			this.operation,
			right
		);

		if (maybe) {
			return maybe.toJSON();
		}

		return {
			type: 'IntermediaryCalculation',
			left: left.toJSON(),
			operation: this.operation,
			right: right.toJSON(),
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
		input:Exclude<string, ''>
	): IntermediaryNumber|IntermediaryCalculation {
		return (new TokenScan(input)).parsed;
	}

	static maybe_reduce_operands(
		left:operand_types,
		operation:operation_types,
		right:operand_types
	) {
		let value:operand_types|undefined = this.maybe_short_circuit(
			left,
			operation,
			right
		);

		if (undefined === value) {
			value = new IntermediaryCalculation(left, operation, right);
		}

		if (value instanceof IntermediaryCalculation) {
			return value.resolve();
		}

		return value;
	}

	private static maybe_short_circuit(
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

		return value;
	}
}
