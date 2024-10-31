import BigNumber from "bignumber.js";
import {
	integer_string__type,
} from "@satisfactory-dev/docs.json.ts/generated-types/common/common/scalar";
import {
	UnrealEngineString,
// eslint-disable-next-line max-len
} from "@satisfactory-dev/docs.json.ts/generated-types/update8/utils/validators";
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	ProductionData,
} from "./production-data";
import {
	IntermediaryNumber,
	number_arg,
	operand_types,
} from '@signpostmarv/intermediary-number';

export function amend_ItemClass_amount(
	production_data: ProductionData,
	ItemClass:{
		ItemClass: UnrealEngineString;
		Amount: integer_string__type;
	},
): {
	ItemClass: UnrealEngineString;
	Amount: number_arg;
} {
	const {
		items,
		resources,
	} = production_data.data;

	const Desc_c = UnrealEngineString_right_x_C_suffix(
		ItemClass.ItemClass,
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
	production_data: ProductionData,
	ItemClass:{
		ItemClass: UnrealEngineString;
		Amount: integer_string__type;
	},
): {
	ItemClass: UnrealEngineString;
	Amount: (
		| operand_types
	);
} {
	const {
		items,
		resources,
	} = production_data.data;

	const Desc_c = UnrealEngineString_right_x_C_suffix(
		ItemClass.ItemClass,
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
