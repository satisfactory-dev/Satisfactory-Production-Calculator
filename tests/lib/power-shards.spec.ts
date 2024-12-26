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
	});
})
