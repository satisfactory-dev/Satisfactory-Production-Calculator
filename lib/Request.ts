import {
	amount_string,
	operand_types,
} from '@signpostmarv/intermediary-number';

import type {
	production_pool,
	production_request,
	production_set,
	recipe_selection,
} from './types';

export class Request<
	NumberTypes extends (
		| amount_string
		| operand_types
	) = operand_types
> {
	input?: production_set<
		NumberTypes
	>;
	pool: production_pool<NumberTypes> = {};
	recipe_selection?: recipe_selection;

	toData(): production_request<NumberTypes, NumberTypes>
	{
		return {
			input: this.input,
			recipe_selection: this.recipe_selection,
			pool: this.pool,
		};
	}
}
