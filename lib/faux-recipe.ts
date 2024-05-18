import assert from 'assert';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions';
import {
	ammo,
	biomass,
	consumable,
	equipment,
	fuel_nuclear,
	items,
	production_set,
	resources,
} from './production-data';
import {
	IntermediaryNumber,
} from './IntermediaryNumber';

export function faux_recipe(recipe:string): production_set
{
	if (
		!/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
			.test(recipe)
	) {
		return {};
	}

	const [
		,
		,
		,
		faux_ingredient,
		faux_amount,
	] = recipe.split('--');

	assert.strictEqual(
		(
			faux_ingredient in ammo
			|| faux_ingredient in biomass
			|| faux_ingredient in consumable
			|| faux_ingredient in equipment
			|| faux_ingredient in fuel_nuclear
			|| faux_ingredient in items
			|| faux_ingredient in resources
		),
		true,
		new NoMatchError(
			{
				recipe,
				faux_ingredient,
			},
			`Supported faux-recipe found, but missing item (${faux_ingredient})!`
		)
	);

	return {
		[faux_ingredient]: IntermediaryNumber.create(faux_amount),
	};
}
