import type {
	operand_types,
} from '@signpostmarv/intermediary-number';
import {
	IntermediaryNumber,
} from '@signpostmarv/intermediary-number';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

export function amend_ItemClass_amount_deferred<
	Version extends supported_versions,
>(
	production_data: by_version[Version]['ProductionData'],
	ItemClass: by_version[Version]['ItemClass_Amount_list_item'],
): {
	ItemClass: by_version[Version]['ItemClass_Amount_list_item']['ItemClass'],
	Amount: operand_types,
} {
	const {
		items,
		resources,
	} = production_data.data;

	const Desc_c = get_string_C(
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
