import {
	describe,
	it,
} from 'node:test';

import assert from 'assert/strict';

import {
	get_string_C,
	has_string_C,
} from '../../lib/utilities/get_string_C.ts';

const data_set: (
	| [string, boolean, `${string}_C`]
	| [string, boolean]
)[] = [
	['Desc_Foo_C', true, 'Desc_Foo_C'],
	['Desc_Foo_c', false],
	['BP_Foo_C', true, 'BP_Foo_C'],
	['BP_Foo_c', false],
	['Foundation_Foo_C', true, 'Foundation_Foo_C'],
	['Foundation_Foo_c', false],
	['nope', false],
	[
		// eslint-disable-next-line @stylistic/max-len
		'/Game/FactoryGame/Buildable/-Shared/WorkBench/BP_WorkBenchComponent.BP_WorkBenchComponent_C',
		true,
		'BP_WorkBenchComponent_C',
	],
	[
		// eslint-disable-next-line @stylistic/max-len
		'/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C',
		true,
		'Build_ConstructorMk1_C',
	],
	['/Script/FactoryGame.FGBuildGun', false],
	['nope', false],
];

void describe('has_string_C', () => {
	for (const entry of data_set) {
		const [input, expectation] = entry;

		void it(
			`has_string_C(${
				input
			}) returns ${
				expectation
			}`,
			() => {
				assert.equal(
					has_string_C(input),
					expectation,
				);
			},
		);
	}
});

void describe('get_string_C', () => {
	for (const entry of data_set) {
		const [input, , result] = entry;

		void it(
			`get_string_C(${
				input
			}) behaves as expected`,
			() => {
				if (result) {
					assert.equal(get_string_C(input), result);
				} else {
					assert.throws(() => get_string_C(input));
				}
			},
		);
	}
});
