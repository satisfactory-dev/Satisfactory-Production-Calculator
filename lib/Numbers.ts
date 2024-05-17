import assert from 'assert';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import sum_series from '@stdlib/math-base-tools-sum-series';
import {
	StringPassedRegExp,
} from '../generated-types/update8/utils/validators';
import {
	integer_string__type,
} from '../generated-types/update8/common/unassigned';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions.js';
import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith.js';
import {
	DeferredCalculation,
	DeferredCalculation_parts,
	IntermediaryCalculation_operand_types,
	IntermediaryNumber,
} from './IntermediaryNumber';

export type amount_string =
	| StringPassedRegExp<'^\\d+(?:\\.\\d{1,6})?$'>
	| integer_string__type
	| '0';
export type number_arg =
	| BigNumber
	| number
	| amount_string;
export type numeric_string =
	| amount_string
	| StringPassedRegExp<'^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$'>

export class Numbers
{
	static amount_string(maybe:string): amount_string
	{
		if (
			!this.is_amount_string(maybe)
		) {
			throw new NoMatchError(
				maybe,
				'Not a supported amount string!'
			);
		}

		return maybe;
	}

	static append_multiply(
		append_to: number_arg,
		a:(
			| number_arg
			| [number_arg, ...number_arg[]]
			| [amount_string, ...amount_string[]]
		),
		b:number_arg
	): BigNumber {

		return this.append_multiply_deferred(
			append_to,
			a,
			b
		).resolve().toBigNumber();
	}

	static append_multiply_deferred(
		append_to: (
			| number_arg
			| IntermediaryCalculation_operand_types
		),
		a:(
			| number_arg
			| [number_arg, ...number_arg[]]
			| [amount_string, ...amount_string[]]
			| IntermediaryCalculation_operand_types
			| [
				(
					IntermediaryCalculation_operand_types
				),
				...(
					IntermediaryCalculation_operand_types
				)[],
			]
		),
		b:(
			| number_arg
			| IntermediaryCalculation_operand_types
		)
	): DeferredCalculation {
		return new DeferredCalculation(
			'(',
			append_to,
			')',
			...(a instanceof Array ? a : [a]).reduce(
				(was, is) => {
					was.push(
						'+',
						'(',
						is,
						'*',
						b,
						')'
					);

					return was;
				},
				[] as DeferredCalculation_parts[]
			),
		);
	}

	static fraction_to_BigNumber(fraction:Fraction): BigNumber
	{
		return BigNumber(
			fraction.toString().replace(/(\(\d+\))/, (val:string) => {
				const digits = val.substring(1, val.length - 1);

				return digits.repeat(Math.ceil(6 / digits.length) + 1);
			})
		);
	}

	static greatest_common_denominator(
		a:number_arg|BigNumber,
		b:number_arg|BigNumber
	): BigNumber|Fraction {
		if (is_string(a) && is_string(b)) {
			return (new Fraction(a)).gcd(new Fraction(b));
		}

		const a_Bignumber = BigNumber(a);
		const b_Bignumber = BigNumber(b);

		if (0 === b_Bignumber.comparedTo(0)) {
			return a_Bignumber;
		}

		this.configure();

		return this.greatest_common_denominator(
			b_Bignumber,
			a_Bignumber.modulo(b_Bignumber)
		);
	}

	static greatest_common_denominator_deferred(
		a:(
			| IntermediaryCalculation_operand_types
		),
		b:(
			| IntermediaryCalculation_operand_types
		)
	): (
		| IntermediaryCalculation_operand_types
	) {
		if (b.isZero()) {
			return a;
		}

		return IntermediaryNumber.create(
			a.toFraction().gcd(b.toFraction())
		);
	}

	static is_amount_string(maybe:unknown): maybe is amount_string {
		return (
			is_string(maybe)
			&& (
				maybe === '0'
				|| /^\d+(?:\.\d{1,6})?$/.test(maybe)
				|| /^\d*(?:\.\d{1,6})$/.test(maybe)
				|| /^\d+$/.test(maybe)
			)
		);
	}

	static is_numeric_string(
		maybe:unknown
	) : maybe is numeric_string {
		return (
			this.is_amount_string(maybe)
			|| (
				is_string(maybe)
				&& /^-?(?:\d*\.\d+|\d+(?:\.\d+)?)$/.test(maybe)
			)
		);
	}

	static least_common_multiple(
		numbers:[
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			),
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			),
			...(
				| number_arg
				| IntermediaryCalculation_operand_types
			)[]
		]
	): BigNumber {
		this.configure();

		return this.least_common_multiple_deferred(numbers).toBigNumber();
	}

	static least_common_multiple_deferred(
		numbers:[
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			),
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			),
			...(
				| number_arg
				| IntermediaryCalculation_operand_types
			)[]
		]
	): (
		| IntermediaryCalculation_operand_types
	) {
		if (2 === numbers.length) {
			return IntermediaryNumber.create(
				IntermediaryNumber.reuse_or_create(
					numbers[0]
				).toFraction().lcm(
					IntermediaryNumber.reuse_or_create(numbers[1]).toFraction()
				)
			);
		}

		return IntermediaryNumber.reuse_or_create(numbers.map(
			e => IntermediaryNumber.reuse_or_create(e).toFraction()
		).reduce(
			// based on https://www.npmjs.com/package/mlcm?activeTab=code
			(was, is) => {
				return was.mul(is).abs().div(
					was.gcd(is)
				);
			}
		));
	}

	static round_off(number:BigNumber): amount_string
	{
		this.configure();
		const result = number.toString();

		if (/\.\d{7,}$/.test(result)) {
			const [before, after] = result.split('.');

			return `${
				before
			}.${
				'0' === after.substring(6, 7)
					? after.substring(0, 6).replace(/0+$/, '')
					: BigNumber(
						after.substring(0, 6)
					).plus(1).toString().padStart(
						Math.min(6, after.length),
						'0'
					)
			}`.replace(/\.$/, '') as amount_string;
		}

		return result as amount_string;
	}

	static sum_series(
		a:(
			| number_arg
			| IntermediaryCalculation_operand_types
		),
		b:(
			| number_arg
			| IntermediaryCalculation_operand_types
		)
	) {
		return this.sum_series_deferred(a, b);
	}

	static sum_series_deferred(
		a:(
			| number_arg
			| BigNumber
			| Fraction
			| IntermediaryCalculation_operand_types
		),
		b:(
			| number_arg
			| BigNumber
			| Fraction
			| IntermediaryCalculation_operand_types
		)
	) {
		const a_deferred = IntermediaryNumber.reuse_or_create(a);
		const b_deferred = IntermediaryNumber.reuse_or_create(b);
		const a_fraction = a_deferred.toFraction();
		const a_Bignumber = a_deferred.toBigNumber();
		const b_fraction = b_deferred.toFraction();

		assert.strictEqual(
			b_deferred.isLessThan(a_Bignumber),
			true,
			`Expecting ${b.toString()} to be less than ${a.toString()}`
		);

		const a_string = a_Bignumber.toFixed();

		const divisor = parseFloat(Numbers.fraction_to_BigNumber((
			a_fraction
		).div(b_fraction)).toString());

		function calculate(number:number) {
			let previous = number;

			return () => {
				const next = previous / divisor;
				previous = next;

				return next;
			}
		}

		return a_deferred.plus(
			sum_series(calculate(parseFloat(a_string)), {
				tolerance: 0.000001,
			})
		);
	}

	private static configure()
	{
		BigNumber.set({
			DECIMAL_PLACES: 7,
			ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
		});
	}
}
