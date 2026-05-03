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

import {
	Root,
} from '../../lib/production-chain.ts';

import type {
	amount_string,
} from '@satisfactory-dev/intermediary-number';
import production_data from '../utilities/production-data.ts';

const update8_validators = await GenerateValidators.fromStandalone(
	import(
		`${import.meta.dirname}/../../validator/0.8.3.3.ts`,
	) as Promise<{
		recipe_selection_validator: Is<recipe_selection>,
		production_request_validator: Is<production_request>,
	}>,
);

const v1_validators = await GenerateValidators.fromStandalone(
	import(
		`${import.meta.dirname}/../../validator/1.0.1.4.ts`,
	) as Promise<{
		recipe_selection_validator: Is<recipe_selection>,
		production_request_validator: Is<production_request>,
	}>,
);

void describe('Power Shards\' existence in production data', () => {
	void it('Behaves as expected on Update 8', async () => {
		const u8_production_data = await production_data('0.8.3.3', 'en-US');

		assert.strictEqual(
			(
				!('power_shards' in u8_production_data.data)
				|| 0 === Object.keys(
					u8_production_data.data.power_shards,
				).length
			),
			true,
		);
		assert.strictEqual(
			'Desc_CrystalShard_C' in u8_production_data.data.items,
			true,
		);

		const calculator = new ProductionCalculator(
			'0.8.3.3',
			u8_production_data,
			update8_validators,
		);

		assert.doesNotThrow(() => {
			calculator.validate({
				pool: {
					Desc_CrystalShard_C: '1',
				},
			});
		});

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				await calculator.calculate({data: {
					pool: {
						Desc_CrystalShard_C: '1',
					},
				}}),
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

	void it('Behaves as expected on 1.0', async () => {
		const v1_production_data = await production_data('1.0.1.4', 'en-US');

		const {data} = v1_production_data;

		assert.strictEqual(
			('power_shards' in data),
			true,
		);

		const {power_shards} = data;
		assert.strictEqual(
			'Desc_CrystalShard_C' in (
				power_shards
			),
			true,
		);
		assert.strictEqual(
			'Desc_CrystalShard_C' in v1_production_data.data.items,
			false,
		);

		const calculator = new ProductionCalculator(
			'1.0.1.4',
			v1_production_data,
			v1_validators,
		);

		const power_shard_data = {
			pool: {
				Desc_CrystalShard_C: '1',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(power_shard_data);
		});

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				await calculator.calculate({
					data: power_shard_data,
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

		const ionized_fuel_data = {
			pool: {
				Desc_IonizedFuel_C: '1',
			},
		};

		assert.doesNotThrow(() => {
			calculator.validate(ionized_fuel_data);
		});

		assert.deepEqual(
			flattened_production_ingredients_request_result(
				await calculator.calculate({
					data: ionized_fuel_data,
				}),
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

		const get_result = () => {
			const chain = new Root(
				v1_production_data,
				'Desc_CrystalShard_C',
				{
					Desc_CrystalShard_C: 'Recipe_SyntheticPowerShard_C',
				},
				'1.0.1.4',
			);

			console.debug({
				result: chain.result,
			});
		};

		assert.doesNotThrow(get_result);
	});
});
