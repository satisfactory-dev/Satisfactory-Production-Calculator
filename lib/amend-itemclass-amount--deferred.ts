import type {
	operand_types,
} from '@signpostmarv/intermediary-number';
import {
	IntermediaryNumber,
} from '@signpostmarv/intermediary-number';

import type {
	ProductionData,
} from './production-data.ts';

import type {
	supported_imports,
} from './production-data/types.ts';

import type {
	ItemClass_Amount_list_item,
} from './types.ts';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

export function amend_ItemClass_amount_deferred<
	T_Imports extends supported_imports,
>(
	production_data: ProductionData<T_Imports>,
	ItemClass: ItemClass_Amount_list_item<T_Imports>,
): {
	ItemClass: ItemClass_Amount_list_item<T_Imports>['ItemClass'],
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
