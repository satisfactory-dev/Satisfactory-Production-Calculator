import {
	instance as v1_production_data,
} from '../utilities/production-data-1.0.ts';

import {
	flattened_production_ingredients_request_result,
} from '../utilities/flattened-production-ingredients-request-result.ts';

import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import type {
	Is,
} from '@satisfactory-dev/ajv-utilities';

import {
	GenerateValidators,
} from '../../lib/generate-validators.ts';

import {
	ProductionCalculator,
} from '../../lib/ProductionCalculator.ts';

import type {
	production_request,
	recipe_selection,
} from '../../lib/types.ts';

const v1_validators = await GenerateValidators.fromStandalone(
	import(
		`${import.meta.dirname}/../../validator/1.0.1.4.ts`,
	) as Promise<{
		recipe_selection_validator: Is<recipe_selection>,
		production_request_validator: Is<production_request>,
	}>,
);

void describe('Allowed Empty Ingredients', () => {
	void it('Behaves as expected on 1.0', async () => {
		const calculator = new ProductionCalculator(
			'1.0.1.4',
			v1_production_data,
			v1_validators,
		);

		const excited_photonic_matter = {
			pool: {
				Desc_QuantumEnergy_C: '1',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(excited_photonic_matter);
		});

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
});
