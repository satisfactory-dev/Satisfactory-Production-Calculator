import assert from 'assert';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import sum_series from '@stdlib/math-base-tools-sum-series';
import {
	IntermediaryCalculation_operand_types,
	IntermediaryNumber,
	IntermediaryNumber_math_types,
} from './IntermediaryNumber';
import {
	amount_string,
} from './NumberStrings';

export type number_arg =
	| BigNumber
	| number
	| amount_string;

export class Numbers
{
	static divide_if_not_one(
		left:IntermediaryNumber_math_types,
		right:Fraction,
		require_fraction:true
	): Fraction;
	static divide_if_not_one(
		left:IntermediaryNumber_math_types,
		right:Fraction,
		require_fraction:false
	): Fraction|IntermediaryNumber_math_types;
	static divide_if_not_one(
		left:IntermediaryNumber_math_types,
		right:Fraction,
		require_fraction:boolean
	): Fraction|IntermediaryNumber_math_types {
		const result = (0 === right.compare(1))
			? left
			: IntermediaryNumber.reuse_or_create(left).divide(right);

		return require_fraction
			? (
				(result instanceof Fraction)
					? result
					: IntermediaryNumber.reuse_or_create(result).toFraction()
			)
			: result;
	}

	static fraction_to_BigNumber(fraction:Fraction): BigNumber
	{
		return BigNumber(
			fraction.valueOf()
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
}
