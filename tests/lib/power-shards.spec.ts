import {
	instance as u8_production_data,
} from '../utilities/production-data';
import {
	instance as v1_production_data,
} from '../utilities/production-data-1.0';
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
import production_request_schema from '../../validator/production_request_schema.mjs';
import {
	ProductionCalculator,
} from '../../lib/ProductionCalculator';
import {
	production_request,
} from '../../lib/types';

const validators = await GenerateValidators.fromStandalone(
	Promise.resolve({
		default: production_request_schema as ValidateFunction<
			production_request
		>,
	}),
);

void describe('Power Shards\' existence in production data', () => {
	void it('Behaves as expected on Update 8', () => {
		assert.strictEqual(
			(
				! ('power_shards' in u8_production_data.data)
				|| undefined === u8_production_data.data.power_shards
			),
			true,
		);
		assert.strictEqual(
			'Desc_CrystalShard_C' in u8_production_data.data.items,
			true,
		);

		const calculator = new ProductionCalculator(
			u8_production_data,
			validators,
		);

		assert.doesNotThrow(() => {
			calculator.validate({
				pool: {
					'Desc_CrystalShard_C': '1',
				},
			});
		})
	});

	void it('Behaves as expected on 1.0', () => {
		const {data} = v1_production_data;

		assert.strictEqual(
			('power_shards' in data),
			true,
		);

		const {power_shards} = data;
		assert.strictEqual(
			'Desc_CrystalShard_C' in (
				power_shards as Exclude<typeof power_shards, undefined>
			),
			true,
		);
		assert.strictEqual(
			'Desc_CrystalShard_C' in v1_production_data.data.items,
			false,
		);

		const calculator = new ProductionCalculator(
			v1_production_data,
			validators,
		);

		assert.doesNotThrow(() => {
			calculator.validate({
				pool: {
					'Desc_CrystalShard_C': '1',
				},
			});
		})
	});
})
