import {
	describe,
	it,
} from "node:test";
import assert from 'assert/strict';
import {
	filter_UnrealEngineString_right_x_C_suffix,
	is_UnrealEngineString_right,
} from "../../lib/UnrealEngineString";

void describe('filter_UnrealEngineString_right_x_C_suffix', () => {
	const data_set:[string, boolean][] = [
		['Desc_Foo_C', true],
		['Desc_Foo_c', false],
		['BP_Foo_C', true],
		['BP_Foo_c', false],
		['Foundation_Foo_C', true],
		['Foundation_Foo_c', false],
		['nope', false],
	];

	for (const entry of data_set) {
		const [input, expectation] = entry;
		void it(
			`filter_UnrealEngineString_right_x_C_suffix(${
				input
			}) returns ${
				expectation
			}`,
			() => {
				assert.equal(
					filter_UnrealEngineString_right_x_C_suffix(input),
					expectation,
				);
			},
		);
	}
})

void describe('is_UnrealEngineString_right', () => {
	const data_set:[string, boolean][] = [
		// eslint-disable-next-line max-len
		['/Game/FactoryGame/Buildable/-Shared/WorkBench/BP_WorkBenchComponent.BP_WorkBenchComponent_C', true],
		['/Script/FactoryGame.FGBuildGun', false],
		['nope', false],
	];

	for (const entry of data_set) {
		const [input, expectation] = entry;
		void it(
			`is_UnrealEngineString_right(${
				input
			}) returns ${
				expectation
			}`,
			() => {
				assert.equal(
					is_UnrealEngineString_right(input),
					expectation,
				);
			},
		);
	}
})
