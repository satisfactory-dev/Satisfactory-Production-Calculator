import {
	amount_string,
	operand_types,
} from '@signpostmarv/intermediary-number';

import {
	production_set_to_json,
	type production_pool,
	type production_request,
	type production_request_json,
	type production_set,
	type recipe_selection,
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

	toJSON(): production_request_json
	{
		const result:production_request_json = {
			recipe_selection: this.recipe_selection,
			pool: production_set_to_json(this.pool),
		};

		if (this.input) {
			result.input = production_set_to_json(this.input);
		}

		return result;
	}
}
