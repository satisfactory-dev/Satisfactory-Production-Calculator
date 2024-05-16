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
	IntermediaryCalculation,
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
			`(${
				(append_to instanceof DeferredCalculation)
					? append_to.toUnresolvedString()
					: append_to.toString()
			}) + (${
				(a instanceof Array ? a : [a]).map(
					operand => `(${
						(operand instanceof DeferredCalculation)
							? operand.toUnresolvedString()
							: operand.toString()
					}) * (${
						(b instanceof DeferredCalculation)
							? b.toUnresolvedString()
							: b.toString()
					})`
				).join(') + (')
			})`
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
	): BigNumber {
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
		if (0 === b.toBigNumber().comparedTo(0)) {
			return a;
		}

		this.configure();

		return this.greatest_common_denominator_deferred(
			b,
			a.modulo(b)
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
		return numbers.map(
			e => IntermediaryNumber.reuse_or_create(e)
		).reduce(
			// based on https://www.npmjs.com/package/mlcm?activeTab=code
			(was, is) => {
				return was.times(is).abs().divide(
					this.greatest_common_denominator_deferred(was, is)
				);
			}
		);
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
		return this.sum_series_deferred(a, b).toBigNumber();
	}

	static sum_series_deferred(
		a:(
			| number_arg
			| IntermediaryCalculation_operand_types
		),
		b:(
			| number_arg
			| IntermediaryCalculation_operand_types
		)
	) {
		const a_deferred = (
			IntermediaryNumber.reuse_or_create(a)
		);
		const b_deferred = (
			IntermediaryNumber.reuse_or_create(b)
		);

		assert.strictEqual(
			b_deferred.toBigNumber().isLessThan(a_deferred.toBigNumber()),
			true,
			`Expecting ${b.toString()} to be less than ${a.toString()}`
		);

		const divisor = a_deferred.divide(b_deferred);

		function calculate(
			number:
				| number_arg
				| IntermediaryCalculation_operand_types
		) {
			let previous = (
				IntermediaryNumber.reuse_or_create(number)
			);

			return () => {
				const next = previous.divide(divisor);
				previous = next;

				return parseFloat(next.toBigNumber().toString());
			}
		}

		return a_deferred.plus(sum_series(calculate(a_deferred)));
	}

	private static configure()
	{
		BigNumber.set({
			DECIMAL_PLACES: 7,
			ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
		});
	}
}
