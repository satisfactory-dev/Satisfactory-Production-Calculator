import {
	operand_types,
} from '@signpostmarv/intermediary-number';

import type {
	production_pool,
	production_request,
	production_set,
	recipe_selection,
} from './types';

export class Request
{
	input?: production_set<
		operand_types
	>;
	pool: production_pool<operand_types> = {};
	recipe_selection?: recipe_selection;

	toData(): production_request<operand_types>
	{
		return {
			input: this.input,
			recipe_selection: this.recipe_selection,
			pool: this.pool,
		};
	}
}
