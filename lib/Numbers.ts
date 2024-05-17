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

	static fraction_to_BigNumber(fraction:Fraction): BigNumber
	{
		return BigNumber(
			fraction.valueOf()
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
		| Fraction
	) {
		if (2 === numbers.length) {
			return (
				IntermediaryNumber.reuse_or_create(
					numbers[0]
				).toFraction().lcm(
					IntermediaryNumber.reuse_or_create(numbers[1]).toFraction()
				)
			);
		}

		return (numbers.map(
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

	static round_off(number:BigNumber|Fraction): amount_string
	{
		let result:string;

		if (number instanceof BigNumber) {
			this.configure();
			result = number.toString();
		} else {
			result = number.valueOf().toString();
		}

		if (/\.\d{7,}$/.test(result)) {
			const [before, after] = result.split('.');

			return `${
				before
			}.${
				'0' === after.substring(6, 7)
					? after.substring(0, 6).replace(/0+$/, '')
					: (
						parseInt(after.substring(0, 6), 10) + 1
					).toString().padStart(
						Math.min(6, after.length),
						'0'
					)
			}`.replace(/\.$/, '') as amount_string;
		}

		return result as amount_string;
	}

	static sum_series_fraction(
		a:Fraction,
		b:Fraction
	) : Fraction {
		assert.strictEqual(
			b.compare(a),
			-1,
			`Expecting ${b.toString()} to be less than ${a.toString()}`
		);

		const divisor = a.div(b).valueOf();

		function calculate(number:number) {
			let previous = number;

			return () => {
				const next = previous / divisor;
				previous = next;

				return next;
			}
		}

		return a.add(
			sum_series(calculate(a.valueOf()), {
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
