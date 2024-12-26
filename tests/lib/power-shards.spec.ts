import {
	instance as u8_production_data,
} from '../utilities/production-data';
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
import update8_production_request_schema from '../../validator/update8/production_request_schema.mjs';
import v1_production_request_schema from '../../validator/1.0/production_request_schema.mjs';
import {
	ProductionCalculator,
} from '../../lib/ProductionCalculator';
import {
	production_request,
} from '../../lib/types';
import { NoMatchError } from '@satisfactory-dev/docs.json.ts/lib';
import { amount_string } from '@signpostmarv/intermediary-number';

const update8_validators = await GenerateValidators.fromStandalone(
	Promise.resolve({
		default: update8_production_request_schema as ValidateFunction<
			production_request
		>,
	}),
);

const v1_validators = await GenerateValidators.fromStandalone(
	Promise.resolve({
		default: v1_production_request_schema as ValidateFunction<
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
			update8_validators,
		);

		assert.doesNotThrow(() => {
			calculator.validate({
				pool: {
					'Desc_CrystalShard_C': '1',
				},
			});
		})

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				calculator.calculate({
					pool: {
						'Desc_CrystalShard_C': '1',
					},
				}),
			),
			flattened_production_ingredients_request_result(
				{
					ingredients: {
						Desc_Crystal_C: '1',
					},
					output: {
						Desc_CrystalShard_C: '1',
					},
					combined: {},
				},
			),
		);
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
			v1_validators,
		);

		const power_shard_data = {
			pool: {
				'Desc_CrystalShard_C': '1',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(power_shard_data);
		})

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				calculator.calculate(power_shard_data),
			),
			flattened_production_ingredients_request_result(
				{
					ingredients: {
						Desc_Crystal_C: '1',
					},
					output: {
						Desc_CrystalShard_C: '1',
					},
					combined: {},
				},
			),
		);

		const ionized_fuel_data = {
			pool: {
				Desc_IonizedFuel_C: '1',
			},
		};

		try {
			calculator.validate(ionized_fuel_data);
		} catch (err) {
			if (err instanceof NoMatchError) {
				console.error(err.property);
			}
		}

		assert.doesNotThrow(() => {
			calculator.validate(ionized_fuel_data);
		})

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				calculator.calculate(ionized_fuel_data),
			),
			flattened_production_ingredients_request_result(
				{
					ingredients: {
						Desc_Coal_C: '0.48' as amount_string,
						Desc_CompactedCoal_C: '0.48' as amount_string,
						Desc_CrystalShard_C: '0.0625' as amount_string,
						Desc_Crystal_C: '0.0625' as amount_string,
						Desc_IronIngot_C: '0.05' as amount_string,
						Desc_IronPlate_C: '0.033334' as amount_string,
						Desc_LiquidFuel_C: '0.72' as amount_string,
						Desc_LiquidOil_C: '1.08' as amount_string,
						Desc_LiquidTurboFuel_C: '0.6' as amount_string,
						Desc_NitricAcid_C: '0.1' as amount_string,
						Desc_NitrogenGas_C: '0.4' as amount_string,
						Desc_OreIron_C: '0.05' as amount_string,
						Desc_RocketFuel_C: '1',
						Desc_Sulfur_C: '0.48' as amount_string,
						Desc_Water_C: '0.1' as amount_string,
					},
					output: {
						Desc_CompactedCoal_C: '0.225' as amount_string,
						Desc_IonizedFuel_C: '1',
						Desc_PolymerResin_C: '0.54' as amount_string,
					},
					combined: {},
				},
			),
		);
	});
})
