import BigNumber from 'bignumber.js';
import {
	StringPassedRegExp,
} from '../generated-types/update8/utils/validators';
import {
	integer_string__type,
} from '../generated-types/update8/common/unassigned';
import {
	NoMatchError,
} from '../Docs.json.ts/lib/Exceptions';

export type amount_string =
	| StringPassedRegExp<'^\\d+(?:\\.\\d{1,6})?$'>
	| integer_string__type
	| '0';
export type number_arg =
	| number
	| amount_string;

export class Math
{
	static amount_string(maybe:string): amount_string
	{
		if (
			maybe !== '0'
			&& !/^\d+(?:\.\d{1,6})?$/.test(maybe)
			&& !/^\d+$/.test(maybe)
		) {
			throw new NoMatchError(
				maybe,
				'Not a supported amount string!'
			);
		}

		return maybe as amount_string;
	}

	static append_multiply(
		append_to: number_arg,
		a:(
			| number_arg
			| [number_arg, ...number_arg[]]
			| [amount_string, ...amount_string[]]
		),
		b:number_arg
	): amount_string {
		this.configure();

		let result = BigNumber(append_to);
		const b_parsed = BigNumber(b);

		for (const operand of (a instanceof Array ? a : [a])) {
			result = result.plus(
				BigNumber(operand).multipliedBy(b_parsed)
			);
		}

		return result.toString() as amount_string;
	}

	static divide(
		a: number_arg,
		b: number_arg
	) : amount_string {
		this.configure();

		return BigNumber(a).dividedBy(b).toString() as amount_string;
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

		return this.greatest_common_denominator(
			b_Bignumber,
			a_Bignumber.modulo(b_Bignumber)
		);
	}

	static least_common_multiple(
		numbers:[
			number_arg,
			number_arg,
			...number_arg[]
		]
	): amount_string {
		this.configure();

		const as_BigNumber = numbers.map(e => BigNumber(e));

		return as_BigNumber.reduce(
			// based on https://www.npmjs.com/package/mlcm?activeTab=code
			(was, is) => {
				return was.multipliedBy(is).absoluteValue().dividedBy(
					this.greatest_common_denominator(was, is)
				);
			}
		).toString() as amount_string;
	}

	private static configure()
	{
		BigNumber.set({DECIMAL_PLACES: 6});
	}
}
