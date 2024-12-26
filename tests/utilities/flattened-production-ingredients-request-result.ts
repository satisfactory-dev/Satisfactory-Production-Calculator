import {
	production_result,
} from '../../lib/types';
import {
	amount_string,
	IntermediaryNumber,
	operand_types,
} from '@signpostmarv/intermediary-number';
import BigNumber from 'bignumber.js';

export type flattened_result = {
	ingredients: {[key: string]: string},
	output: {[key: string]: string},
	surplus?: {[key: string]: string},
};

export function flattened_production_ingredients_request_result(
	input:production_result<
		(
			| amount_string
			| BigNumber
			| operand_types
		)
	>,
) : flattened_result {
	const calculating:{
		ingredients: {[key: string]: operand_types},
		output: {[key: string]: operand_types},
		surplus: {[key: string]: operand_types},
	} = {
		ingredients: Object.fromEntries(
			Object.entries(input.ingredients).map(e => [
				e[0],
				IntermediaryNumber.reuse_or_create(e[1]),
			]),
		),
		output: {},
		surplus: {},
	};

	for (const [item, amount] of Object.entries(input.output)) {
		if (!(item in calculating.output)) {
			calculating.output[item] = (
				IntermediaryNumber.reuse_or_create(amount)
			);
		} else {
			calculating.output[
				item
			] = calculating.output[
				item
			].plus(amount);
		}
	}

	for (const [item, amount] of Object.entries(input.surplus || {})) {
		if (!(item in calculating.surplus)) {
			calculating.surplus[item] = (
				IntermediaryNumber.reuse_or_create(amount)
			);
		} else {

			calculating.surplus[
				item
			] = calculating.surplus[
				item
			].plus(amount);
		}
	}

	const surplus_entries = Object.entries(
		calculating.surplus,
	).map((e): [string, string] => [
		e[0],
		parseFloat(e[1].toAmountString()).toString(),
	]);

	const result:flattened_result = {
		ingredients: Object.fromEntries(
			Object.entries(
				calculating.ingredients,
			).map(e => [e[0], parseFloat(e[1].toAmountString()).toString()]),
		),
		output: Object.fromEntries(
			Object.entries(
				calculating.output,
			).map(e => [
				e[0],
				parseFloat(e[1].toAmountString()).toString(),
			]),
		),
	};

	if (surplus_entries.length > 0) {
		result.surplus = Object.fromEntries(surplus_entries);
	}

	return result;
}
