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
	production_ingredients_request_result,
} from './production-ingredients-request';

export type amount_string =
	| StringPassedRegExp<'^\\d+(?:\\.\\d{1,6})?$'>
	| integer_string__type
	| '0';
export type number_arg =
	| BigNumber
	| number
	| amount_string;

export class Math
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
		this.configure();

		let result = BigNumber(append_to);
		const b_parsed = BigNumber(b);

		for (const operand of (a instanceof Array ? a : [a])) {
			result = result.plus(
				BigNumber(operand).multipliedBy(b_parsed)
			);
		}

		return result;
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

	static is_amount_string(maybe:unknown): maybe is amount_string {
		return (
			is_string(maybe)
			&& (
				maybe === '0'
				|| /^\d+(?:\.\d{1,6})?$/.test(maybe)
				|| /^\d+$/.test(maybe)
			)
		);
	}

	static least_common_multiple(
		numbers:[
			number_arg,
			number_arg,
			...number_arg[]
		]
	): BigNumber {
		this.configure();
		const as_BigNumber = numbers.map(e => BigNumber(e));

		return as_BigNumber.reduce(
			// based on https://www.npmjs.com/package/mlcm?activeTab=code
			(was, is) => {
				return was.multipliedBy(is).absoluteValue().dividedBy(
					this.greatest_common_denominator(was, is)
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
					: BigNumber(after.substring(0, 6)).plus(1).toString()
			}` as amount_string;
		}

		return result as amount_string;
	}

	static sum_series(a:number_arg, b:number_arg)
	{
		assert.strictEqual(
			BigNumber(b).isLessThan(a),
			true,
			`Expecting ${b.toString()} to be less than ${a.toString()}`
		);

		const divisor = parseFloat((
			new Fraction(a.toString())
		).div(b.toString()).toString());

		function calculate(number:number_arg) {
			let previous = parseFloat(number.toString());

			return () => {
				const next = previous / divisor;
				previous = next;

				return next;
			}
		}

		return BigNumber(a).plus(BigNumber(sum_series(calculate(a))));
	}

	private static configure()
	{
		BigNumber.set({
			DECIMAL_PLACES: 7,
			ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
		});
	}
}
