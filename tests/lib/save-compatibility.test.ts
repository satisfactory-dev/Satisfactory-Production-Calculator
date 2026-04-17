import {
	describe,
	it,
} from 'node:test';

import assert from 'node:assert/strict';

import {
	instance as update8,
} from '../utilities/production-data.ts';

import {
	instance as release_1_0,
} from '../utilities/production-data-1.0.ts';

import {
	instance as release_1_1,
} from '../utilities/production-data-1.1.ts';

void describe('ProductionData::save_compatibility_targets', () => {
	const data = {
		'0.8.3.3': update8,
		'1.0.1.4': release_1_0,
		'1.1.2.2': release_1_1,
	};

	const data_sets: [string, boolean][] = [
		['Recipe_SteelWall_8x4_C', true],
		['foo', false],
	];

	for (const [version, version_data] of Object.entries(data)) {
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
