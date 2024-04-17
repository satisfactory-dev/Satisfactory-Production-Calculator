import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	recipe_ingredients_request_result,
	RecipeIngredientsRequest,
} from '../../lib/recipe-ingredients-request';
import Ajv from 'ajv/dist/2020';
import {
	Math,
} from '../../lib/Math';

void describe('RecipeIngredientsRequest', () => {
	const instance = new RecipeIngredientsRequest(new Ajv({
		verbose: true,
		code: {
			source: true,
			es5: false,
			esm: true,
			optimize: true,
		},
	}));

	void describe('validates', () => {
		const result_1:recipe_ingredients_request_result = {
			ingredients: [
				{
					item: 'Desc_ModularFrame_C',
					amount: Math.amount_string('15'),
				},
				{
					item: 'Desc_Cable_C',
					amount: Math.amount_string('25'),
				},
				{
					item: 'Desc_Cement_C',
					amount: Math.amount_string('100'),
				},
				{
					item: 'Desc_SteelPlate_C',
					amount: Math.amount_string('100'),
				},
			],
			output: [
				{
					item: 'Desc_BlueprintDesigner_C',
					type: 'FGBuildingDescriptor',
					amount: Math.amount_string('1'),
				},
			],
		};
		const result_1000001:recipe_ingredients_request_result = {
			ingredients: [
				{
					item: 'Desc_ModularFrame_C',
					amount: Math.amount_string('15.000015'),
				},
				{
					item: 'Desc_Cable_C',
					amount: Math.amount_string('25.000025'),
				},
				{
					item: 'Desc_Cement_C',
					amount: Math.amount_string('100.0001'),
				},
				{
					item: 'Desc_SteelPlate_C',
					amount: Math.amount_string('100.0001'),
				},
			],
			output: [
				{
					item: 'Desc_BlueprintDesigner_C',
					type: 'FGBuildingDescriptor',
					amount: Math.amount_string('1.000001'),
				},
			],
		};

		const test_cases:[
			unknown,
			| false
			| recipe_ingredients_request_result,
		][] = [
			[
				[{
					recipe: 'Recipe_BlueprintDesigner_C',
					amount: 1,
				}],
				result_1,
			],
			[
				[{
					recipe: 'Recipe_BlueprintDesigner_C',
					amount: '1',
				}],
				result_1,
			],
			[
				[{
					recipe: 'Recipe_BlueprintDesigner_C',
					amount: '1.000001',
				}],
				result_1000001,
			],
			[
				[{
					recipe: 'Recipe_BlueprintDesigner_C',
					amount: '1.0000001',
				}],
				false,
			],
		];

		for (const entry of test_cases) {
			const [data, expectation] = entry;

			void it(
				`${
					expectation ? 'behaves' : 'throws'
				} with ${JSON.stringify(data)}`,
				() => {
					const get_result = () => instance.validate(
						data
					);

					if (false === expectation) {
						assert.throws(get_result);
					} else {
						assert.doesNotThrow(get_result);
						assert.deepEqual(
							instance.calculate(data),
							expectation
						);
					}
				}
			)
		}
	})
})
