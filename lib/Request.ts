import {
	operand_types,
} from '@signpostmarv/intermediary-number';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};

import type {
	production_request,
	production_set,
	recipe_selection,
} from './types';

export class Request
{
	input?: production_set<
		operand_types
	>;
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: operand_types,
	}[] = [];
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
