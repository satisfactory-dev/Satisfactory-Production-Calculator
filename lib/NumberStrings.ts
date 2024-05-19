import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions';

import {
	StringPassedRegExp,
} from '../generated-types/update8/utils/validators';
import {
	integer_string__type,
} from '../generated-types/update8/common/unassigned';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import type {
	IntermediaryCalculation_operand_types,
} from './IntermediaryNumber';

export type amount_string =
	| StringPassedRegExp<'^\\d+(?:\\.\\d{1,6})?$'>
	| integer_string__type
	| '1'
	| '0';

export type numeric_string =
	| amount_string
	| StringPassedRegExp<'^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$'>

export class NumberStrings
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

	static numeric_string(
		value:
			| IntermediaryCalculation_operand_types
	): string {
		const string = value.toFraction().toString();

		if (/^\d+\.\d*\(\d\)$/.test(string)) {
			return string.replace(
				/\(\d+\)$/,
				(match) => {
					const chunk_length = match.length - 2;
					const initial_length = (
						string.split('.')[1].length - match.length
					);

					return match.substring(
						1,
						match.length - 1
					).repeat(
						Math.max(
							1,
							Math.floor((16 - initial_length) / chunk_length)
						)
					)
				}
			);
		}

		return value.toString();
	}

	static round_off(
		number:
			| BigNumber
			| Fraction
			| IntermediaryCalculation_operand_types,
	): amount_string {
		let result:string;

		number = (
			(number instanceof BigNumber)
			|| (number instanceof Fraction)
		)
			? number
			: number.toBigNumberOrFraction();

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

	private static configure()
	{
		BigNumber.set({
			DECIMAL_PLACES: 7,
			ROUNDING_MODE: BigNumber.ROUND_HALF_CEIL,
		});
	}
}
