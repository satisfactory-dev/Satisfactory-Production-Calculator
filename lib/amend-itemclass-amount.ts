import BigNumber from 'bignumber.js';

import type {
	number_arg,
} from '@satisfactory-dev/intermediary-number';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

export function amend_ItemClass_amount<
	Version extends supported_versions,
>(
	production_data: by_version[Version]['ProductionData'],
	ItemClass: by_version[Version]['ItemClass_Amount_list_item'],
): {
	ItemClass: by_version[Version]['ItemClass_Amount_list_item']['ItemClass'],
	Amount: number_arg,
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
		Amount: null === ItemClass.Amount
			? 0
			: (
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
					: (ItemClass.Amount as number_arg)
			),
	};
}
