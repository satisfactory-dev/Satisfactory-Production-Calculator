import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import production_data from '../utilities/production-data.ts';

import type {
	supported_versions,
} from '../../lib/supported.ts';

void describe('ProductionData::save_compatibility_targets', async () => {
	const data: supported_versions[] = [
		'0.8.3.3',
		'1.0.1.4',
		'1.1.2.2',
		'1.2.2.0',
	];

	const data_sets: [string, boolean][] = [
		['Recipe_SteelWall_8x4_C', true],
		['foo', false],
	];

	for (const version of data) {
		const version_data = await production_data(version, 'en-US');

		const targets = (
			version_data.save_compatibility_targets as string[]
		);

		for (const [
			target,
			has,
		] of data_sets) {
			void it(
				`expect ${
					version
				} to${
					has ? ' ' : ' not '
				}have ${
					target
				} listed as a save compatibility target`,
				() => {
					assert.equal(
						targets.includes(
							target,
						),
						has,
					);
				},
			);
		}
	}
});
