import {
	operand_types,
} from '@signpostmarv/intermediary-number';

import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};

import {
	production_ingredients_request,
	recipe_ingredients_request_output,
} from './ProductionIngredientsRequest/types';
import {
	recipe_selection,
} from './production-data';


export class Request
{
	input?: recipe_ingredients_request_output<
		operand_types
	>[];
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: operand_types,
	}[] = [];
	recipe_selection?: recipe_selection;

	toData(): production_ingredients_request<operand_types>
	{
		return {
			input: this.input,
			recipe_selection: this.recipe_selection,
			pool: this.pool,
		};
	}
}
