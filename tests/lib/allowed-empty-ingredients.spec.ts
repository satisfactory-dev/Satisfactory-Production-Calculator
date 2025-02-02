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

void describe('Allowed Empty Ingredients', () => {
	void it('Behaves as expected on 1.0', async () => {
		const calculator = new ProductionCalculator(
			v1_production_data,
			v1_validators,
		);

		const excited_photonic_matter = {
			pool: {
				'Desc_QuantumEnergy_C': '1',
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
					},
					output: {
						Desc_QuantumEnergy_C: '1',
					},
					combined: {},
				},
			),
		);
	});
})
