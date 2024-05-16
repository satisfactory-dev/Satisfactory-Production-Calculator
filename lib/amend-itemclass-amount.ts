import BigNumber from "bignumber.js";
import {
	integer_string__type,
} from "../generated-types/update8/common/unassigned";
import {
	UnrealEngineString,
} from "../generated-types/update8/utils/validators";
import {
	number_arg,
} from "./Numbers";
import {
	UnrealEngineString_right_x_C_suffix,
} from './planner-request';
import {
	items,
	resources,
} from "./production-data";
import {
	IntermediaryCalculation,
	IntermediaryNumber,
} from './IntermediaryNumber';

export function amend_ItemClass_amount(
	ItemClass:{
		ItemClass: UnrealEngineString;
		Amount: integer_string__type;
	}
): {
	ItemClass: UnrealEngineString;
	Amount: number_arg;
} {
	const Desc_c = UnrealEngineString_right_x_C_suffix(
		ItemClass.ItemClass
	);

	return {
		ItemClass: ItemClass.ItemClass,
		Amount: (
			(
				(
					Desc_c in resources
					&& 'RF_SOLID' !== resources[Desc_c].mForm
				)
				|| (
					Desc_c in items
					&& 'RF_SOLID' !== items[Desc_c].mForm
				)
			)
				? BigNumber(ItemClass.Amount).dividedBy(1000)
				: ItemClass.Amount
		),
	};
}

export function amend_ItemClass_amount_deferred(
	ItemClass:{
		ItemClass: UnrealEngineString;
		Amount: integer_string__type;
	}
): {
	ItemClass: UnrealEngineString;
	Amount: (
		| IntermediaryCalculation
		| IntermediaryNumber
	);
} {
	const Desc_c = UnrealEngineString_right_x_C_suffix(
		ItemClass.ItemClass
	);

	return {
		ItemClass: ItemClass.ItemClass,
		Amount: (
			(
				(
					Desc_c in resources
					&& 'RF_SOLID' !== resources[Desc_c].mForm
				)
				|| (
					Desc_c in items
					&& 'RF_SOLID' !== items[Desc_c].mForm
				)
			)
				? IntermediaryNumber.create(ItemClass.Amount).divide(1000)
				: IntermediaryNumber.create(ItemClass.Amount)
		),
	};
}
