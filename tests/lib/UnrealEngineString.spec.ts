import {
	describe,
	it,
} from "node:test";
import assert from 'assert/strict';
import {
	filter_UnrealEngineString_right_x_C_suffix,
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
