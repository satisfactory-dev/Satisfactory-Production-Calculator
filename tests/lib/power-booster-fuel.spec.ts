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

		const excited_photonic_matter = {
			pool: {
				Desc_AlienPowerFuel_C: '1',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(excited_photonic_matter);
		})

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				await calculator.calculate({
					data: excited_photonic_matter,
				}),
			),
			flattened_production_ingredients_request_result(
				{
					ingredients: {
						Desc_AluminaSolution_C: '27' as amount_string,
						Desc_AluminumIngot_C: '27' as amount_string,
						Desc_AluminumPlate_C: '27' as amount_string,
						Desc_AluminumScrap_C: '40.5' as amount_string,
						Desc_Cable_C: '42' as amount_string,
						Desc_Coal_C: '396' as amount_string,
						Desc_CopperIngot_C: '63.5' as amount_string,
						Desc_CrystalOscillator_C: '3' as amount_string,
						Desc_CrystalShard_C: '3' as amount_string,
						Desc_Crystal_C: '3' as amount_string,
						Desc_DarkEnergy_C: '90' as amount_string,
						Desc_DarkMatter_C: '18' as amount_string,
						Desc_Diamond_C: '18' as amount_string,
						Desc_IronIngot_C: '90' as amount_string,
						Desc_IronPlateReinforced_C: '7.5' as amount_string,
						Desc_IronPlate_C: '45' as amount_string,
						Desc_IronRod_C: '22.5' as amount_string,
						Desc_IronScrew_C: '90' as amount_string,
						Desc_OreBauxite_C: '27' as amount_string,
						Desc_OreCopper_C: '63.5' as amount_string,
						Desc_OreIron_C: '112.5' as amount_string,
						Desc_QuantumEnergy_C: '99' as amount_string,
						Desc_QuantumOscillator_C: '3' as amount_string,
						Desc_QuartzCrystal_C: '54' as amount_string,
						Desc_RawQuartz_C: '110.25' as amount_string,
						Desc_SAMFluctuator_C: '5' as amount_string,
						Desc_SAMIngot_C: '75' as amount_string,
						Desc_SAM_C: '300' as amount_string,
						Desc_Silica_C: '33.75' as amount_string,
						Desc_SteelIngot_C: '22.5' as amount_string,
						Desc_SteelPipe_C: '15' as amount_string,
						Desc_Water_C: '40.5' as amount_string,
						Desc_Wire_C: '109' as amount_string,
					},
					output: {
						Desc_AlienPowerFuel_C: '1' as amount_string,
						Desc_DarkEnergy_C: '99' as amount_string,
						Desc_Silica_C: '11.25' as amount_string,
						Desc_Water_C: '13.5' as amount_string,
					},
					combined: {},
				},
			),
		);
	});
})
