import {
	amount_string,
} from '@signpostmarv/intermediary-number';

import {
	instance as v1_production_data,
} from '../utilities/production-data-1.0';
import {
	flattened_production_ingredients_request_result,
} from '../utilities/flattened-production-ingredients-request-result';
import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	ValidateFunction,
} from 'ajv';
import {
	GenerateValidators,
} from '../../lib/generate-validators';
// eslint-disable-next-line max-len
import v1_production_request_schema from '../../validator/1.0/production_request_schema.mjs';
import {
	ProductionCalculator,
} from '../../lib/ProductionCalculator';
import {
	production_request,
} from '../../lib/types';

const v1_validators = await GenerateValidators.fromStandalone(
	Promise.resolve({
		default: v1_production_request_schema as ValidateFunction<
			production_request
		>,
	}),
);

void describe('Power Booster Fuel', () => {
	void it('Behaves as expected on 1.0', async () => {
		const calculator = new ProductionCalculator(
			v1_production_data,
			v1_validators,
		);

		const unpackaged_rocket_fuel = {
			pool: {
				Desc_RocketFuel_C: '1',
			},
			recipe_selection: {
				Desc_RocketFuel_C: 'Recipe_UnpackageRocketFuel_C',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(unpackaged_rocket_fuel);
		})

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				await calculator.calculate({
					data: unpackaged_rocket_fuel,
				}),
			),
			flattened_production_ingredients_request_result(
				{
					ingredients: {
						Desc_AluminaSolution_C: '1',
						Desc_AluminumIngot_C: '1',
						Desc_AluminumScrap_C: '1.5' as amount_string,
						Desc_Coal_C: '0.5' as amount_string,
						Desc_GasTank_C: '1',
						Desc_OreBauxite_C: '1',
						Desc_PackagedRocketFuel_C: '1',
						Desc_RawQuartz_C: '0.75' as amount_string,
						Desc_RocketFuel_C: '2' as amount_string,
						Desc_Silica_C: '1.25' as amount_string,
						Desc_Water_C: '1.5' as amount_string,
					},
					output: {
						Desc_GasTank_C: '1',
						Desc_RocketFuel_C: '1',
						Desc_Silica_C: '0.416667' as amount_string,
						Desc_Water_C: '0.5' as amount_string,
					},
					combined: {},
				},
			),
		);
	});
})
