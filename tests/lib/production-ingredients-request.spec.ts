import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	production_ingredients_request_result,
	ProductionIngredientsRequest,
} from '../../lib/production-ingredients-request';
import Ajv from 'ajv/dist/2020';
import {
	amount_string,
	Math,
} from '../../lib/Math';
import BigNumber from 'bignumber.js';

function flattened_production_ingredients_request_result(
	input:production_ingredients_request_result
) : {
	ingredients: {[key: string]: amount_string},
	output: {[key: string]: amount_string},
	surplus: {[key: string]: amount_string},
} {
	const calculating:{
		ingredients: {[key: string]: BigNumber},
		output: {[key: string]: BigNumber},
		surplus: {[key: string]: BigNumber},
	} = {
		ingredients: {},
		output: {},
		surplus: {},
	};

	for (const entry of input.ingredients) {
		if (!(entry.item in calculating.ingredients)) {
			calculating.ingredients[entry.item] = BigNumber(0);
		}

		calculating.ingredients[
			entry.item
		] = calculating.ingredients[
			entry.item
		].plus(entry.amount);
	}

	for (const entry of input.output) {
		if (!(entry.item in calculating.output)) {
			calculating.output[entry.item] = BigNumber(0);
		}

		calculating.output[
			entry.item
		] = calculating.output[
			entry.item
		].plus(entry.amount);
	}

	for (const entry of input.surplus) {
		if (!(entry.item in calculating.surplus)) {
			calculating.surplus[entry.item] = BigNumber(0);
		}

		calculating.surplus[
			entry.item
		] = calculating.surplus[
			entry.item
		].plus(entry.amount);
	}

	return {
		ingredients: Object.fromEntries(
			Object.entries(
				calculating.ingredients
			).map(e => [e[0], Math.round_off(e[1])])
		),
		output: Object.fromEntries(
			Object.entries(
				calculating.output
			).map(e => [
				e[0],
				Math.round_off(e[1]),
			])
		),
		surplus: Object.fromEntries(
			Object.entries(
				calculating.surplus
			).map(e => [
				e[0],
				Math.round_off(e[1]),
			])
		),
	};
}

void describe('ProductionIngredientsRequest', () => {
	const instance = new ProductionIngredientsRequest(new Ajv({
		verbose: true,
		code: {
			source: true,
			es5: false,
			esm: true,
			optimize: true,
		},
	}));

	void describe('validates', () => {
		const result_1:production_ingredients_request_result = {
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
				{
					item: 'Desc_IronPlateReinforced_C',
					amount: Math.amount_string('22.5'),
				},
				{
					item: 'Desc_IronRod_C',
					amount: Math.amount_string('157.5'),
				},
				{
					item: 'Desc_IronPlate_C',
					amount: Math.amount_string('135'),
				},
				{
					item: 'Desc_IronScrew_C',
					amount: Math.amount_string('270'),
				},
				{
					item: 'Desc_IronIngot_C',
					amount: Math.amount_string('360'),
				},
				{
					item: 'Desc_OreIron_C',
					amount: Math.amount_string('760'),
				},
				{
					item: 'Desc_Wire_C',
					amount: Math.amount_string('50'),
				},
				{
					item: 'Desc_CopperIngot_C',
					amount: Math.amount_string('25'),
				},
				{
					item: 'Desc_OreCopper_C',
					amount: Math.amount_string('25'),
				},
				{
					item: 'Desc_Stone_C',
					amount: Math.amount_string('300'),
				},
				{
					item: 'Desc_SteelIngot_C',
					amount: Math.amount_string('400'),
				},
				{
					item: 'Desc_Coal_C',
					amount: Math.amount_string('400'),
				},
			],
			output: [
				{
					item: 'Desc_BlueprintDesigner_C',
					amount: Math.amount_string('1'),
				},
			],
			surplus: [],
		};
		const result_1000001:production_ingredients_request_result = {
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
				{
					item: 'Desc_IronPlateReinforced_C',
					amount: Math.amount_string('22.500023'),
				},
				{
					item: 'Desc_IronRod_C',
					amount: Math.amount_string('157.500158'),
				},
				{
					item: 'Desc_IronPlate_C',
					amount: Math.amount_string('135.000135'),
				},
				{
					item: 'Desc_IronScrew_C',
					amount: Math.amount_string('270.00027'),
				},
				{
					item: 'Desc_IronIngot_C',
					amount: Math.amount_string('360.00036'),
				},
				{
					item: 'Desc_OreIron_C',
					amount: Math.amount_string('760.00076'),
				},
				{
					item: 'Desc_Wire_C',
					amount: Math.amount_string('50.00005'),
				},
				{
					item: 'Desc_CopperIngot_C',
					amount: Math.amount_string('25.000025'),
				},
				{
					item: 'Desc_OreCopper_C',
					amount: Math.amount_string('25.000025'),
				},
				{
					item: 'Desc_Stone_C',
					amount: Math.amount_string('300.0003'),
				},
				{
					item: 'Desc_SteelIngot_C',
					amount: Math.amount_string('400.0004'),
				},
				{
					item: 'Desc_Coal_C',
					amount: Math.amount_string('400.0004'),
				},
			],
			output: [
				{
					item: 'Desc_BlueprintDesigner_C',
					amount: Math.amount_string('1.000001'),
				},
			],
			surplus: [],
		};

		const test_cases:[
			unknown,
			| false
			| production_ingredients_request_result,
		][] = [
			[
				{
					pool: [
						{
							production: 'Desc_IronIngot_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_IronRod_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('1'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_IronRod_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_IronScrew_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronRod_C',
							amount: Math.amount_string('0.25'),
						},
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('0.25'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('0.25'),
						},
					],
					output: [
						{
							item: 'Desc_IronScrew_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_IronPlate_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('1.5'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('1.5'),
						},
					],
					output: [
						{
							item: 'Desc_IronPlate_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_Cement_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_Stone_C',
							amount: Math.amount_string('3'),
						},
					],
					output: [
						{
							item: 'Desc_Cement_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_SteelIngot_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('1'),
						},
						{
							item: 'Desc_Coal_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_SteelIngot_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_SteelPlate_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_SteelIngot_C',
							amount: Math.amount_string('4'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('4'),
						},
						{
							item: 'Desc_Coal_C',
							amount: Math.amount_string('4'),
						},
					],
					output: [
						{
							item: 'Desc_SteelPlate_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_CopperIngot_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_OreCopper_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_CopperIngot_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_Wire_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_CopperIngot_C',
							amount: Math.amount_string('0.5'),
						},
						{
							item: 'Desc_OreCopper_C',
							amount: Math.amount_string('0.5'),
						},
					],
					output: [
						{
							item: 'Desc_Wire_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_Cable_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_Wire_C',
							amount: Math.amount_string('2'),
						},
						{
							item: 'Desc_CopperIngot_C',
							amount: Math.amount_string('1'),
						},
						{
							item: 'Desc_OreCopper_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_Cable_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_IronPlateReinforced_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronPlate_C',
							amount: Math.amount_string('6'),
						},
						{
							item: 'Desc_IronScrew_C',
							amount: Math.amount_string('12'),
						},
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('12'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('12'),
						},
						{
							item: 'Desc_IronRod_C',
							amount: Math.amount_string('3'),
						},
					],
					output: [
						{
							item: 'Desc_IronPlateReinforced_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_ModularFrame_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronPlateReinforced_C',
							amount: Math.amount_string('1.5'),
						},
						{
							item: 'Desc_IronRod_C',
							amount: Math.amount_string('10.5'),
						},
						{
							item: 'Desc_IronPlate_C',
							amount: Math.amount_string('9'),
						},
						{
							item: 'Desc_IronScrew_C',
							amount: Math.amount_string('18'),
						},
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('24'),
						},
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('24'),
						},
					],
					output: [
						{
							item: 'Desc_ModularFrame_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{pool: [{
					production: 'Desc_BlueprintDesigner_C',
					amount: 1,
				}]},
				result_1,
			],
			[
				{pool: [{
					production: 'Desc_BlueprintDesigner_C',
					amount: '1',
				}]},
				result_1,
			],
			[
				{pool: [{
					production: 'Desc_BlueprintDesigner_C',
					amount: '1.000001',
				}]},
				result_1000001,
			],
			[
				{pool: [{
					production: 'Desc_BlueprintDesigner_C',
					amount: '1.0000001',
				}]},
				false,
			],
			[
				{
					pool: [
						{
							production: 'Desc_Plastic_C',
							amount: '1',
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_LiquidOil_C',
							amount: Math.amount_string('1.5'),
						},
					],
					output: [
						{
							item: 'Desc_Plastic_C',
							amount: Math.amount_string('1'),
						},
						{
							item: 'Desc_HeavyOilResidue_C',
							amount: Math.amount_string('0.5'),
						},
					],
					surplus: [],
				},
			],
			[
				{pool: [{
					production: 'Desc_Water_C',
					amount: '123.456',
				}]},
				{
					ingredients: [],
					output: [
						{
							item: 'Desc_Water_C',
							amount: Math.amount_string('123.456'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					recipe_selection: {
						Desc_Water_C: 'Recipe_UnpackageWater_C',
					},
					pool: [
						{
							production: 'Desc_Water_C',
							amount: '123.456',
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_PackagedWater_C',
							amount: Math.amount_string('123.456'),
						},
						{
							item: 'Desc_Water_C',
							amount: Math.amount_string('123.456'),
						},
						{
							item: 'Desc_FluidCanister_C',
							amount: Math.amount_string('123.456'),
						},
						{
							item: 'Desc_Plastic_C',
							amount: Math.amount_string('61.728'),
						},
						{
							item: 'Desc_LiquidOil_C',
							amount: Math.amount_string('92.592'),
						},
					],
					output: [
						{
							item: 'Desc_Water_C',
							amount: Math.amount_string('123.456'),
						},
						{
							item: 'Desc_FluidCanister_C',
							amount: Math.amount_string('123.456'),
						},
						{
							item: 'Desc_HeavyOilResidue_C',
							amount: Math.amount_string('30.864'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					pool: [
						{
							production: 'Desc_Cable_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_Wire_C',
							amount: Math.amount_string('2'),
						},
						{
							item: 'Desc_CopperIngot_C',
							amount: Math.amount_string('1'),
						},
						{
							item: 'Desc_OreCopper_C',
							amount: Math.amount_string('1'),
						},
					],
					output: [
						{
							item: 'Desc_Cable_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [],
				},
			],
			[
				{
					input: [
						{
							item: 'Desc_Wire_C',
							amount: Math.amount_string('10'),
						},
					],
					pool: [
						{
							production: 'Desc_Cable_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [],
					output: [
						{
							item: 'Desc_Cable_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [
						{
							item: 'Desc_Wire_C',
							amount: Math.amount_string('8'),
						},
					],
				},
			],
			[
				{
					input: [
						{
							item: 'Desc_OreIron_C',
							amount: 30,
						},
					],
					pool: [
						{
							production: 'Desc_ModularFrame_C',
							amount: 1,
						},
					],
				},
				{
					ingredients: [
						{
							item: 'Desc_IronPlateReinforced_C',
							amount: Math.amount_string('1.5'),
						},
						{
							item: 'Desc_IronRod_C',
							amount: Math.amount_string('10.5'),
						},
						{
							item: 'Desc_IronPlate_C',
							amount: Math.amount_string('9'),
						},
						{
							item: 'Desc_IronScrew_C',
							amount: Math.amount_string('18'),
						},
						{
							item: 'Desc_IronIngot_C',
							amount: Math.amount_string('24'),
						},
					],
					output: [
						{
							item: 'Desc_ModularFrame_C',
							amount: Math.amount_string('1'),
						},
					],
					surplus: [
						{
							item: 'Desc_OreIron_C',
							amount: Math.amount_string('6'),
						},
					],
				},
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
							flattened_production_ingredients_request_result(
								instance.calculate(data)
							),
							flattened_production_ingredients_request_result(
								expectation
							)
						);
					}
				}
			)
		}
	})
})
