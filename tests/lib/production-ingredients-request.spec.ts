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
	Math,
} from '../../lib/Math';

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
					amount: Math.amount_string('3.75'),
				},
				{
					item: 'Desc_IronRod_C',
					amount: Math.amount_string('26.25'),
				},
				{
					item: 'Desc_IronPlate_C',
					amount: Math.amount_string('22.5'),
				},
				{
					item: 'Desc_IronScrew_C',
					amount: Math.amount_string('45'),
				},
				{
					item: 'Desc_IronIngot_C',
					amount: Math.amount_string('48.75'),
				},
				{
					item: 'Desc_OreIron_C',
					amount: Math.amount_string('448.75'),
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
					type: 'FGBuildingDescriptor',
					amount: Math.amount_string('1'),
				},
			],
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
					amount: Math.amount_string('3.750004'),
				},
				{
					item: 'Desc_IronRod_C',
					amount: Math.amount_string('26.250027'),
				},
				{
					item: 'Desc_IronPlate_C',
					amount: Math.amount_string('22.500023'),
				},
				{
					item: 'Desc_IronScrew_C',
					amount: Math.amount_string('45.000045'),
				},
				{
					item: 'Desc_IronIngot_C',
					amount: Math.amount_string('48.750049'),
				},
				{
					item: 'Desc_OreIron_C',
					amount: Math.amount_string('448.750449'),
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
					type: 'FGBuildingDescriptor',
					amount: Math.amount_string('1.000001'),
				},
			],
		};

		const test_cases:[
			unknown,
			| false
			| production_ingredients_request_result,
		][] = [
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
							item: 'Desc_LiquidOil',
							amount: Math.amount_string('1.5'),
						},
					],
					output: [
						{
							item: 'Desc_Plastic_C',
							amount: Math.amount_string('1'),
							type: 'FGItemDescriptor',
						},
						{
							item: 'Desc_HeavyOilResidue_C',
							amount: Math.amount_string('0.5'),
							type: 'FGItemDescriptor',
						},
					],
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
							type: 'FGResourceDescriptor',
						},
					],
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
							type: 'FGResourceDescriptor',
						},
						{
							item: 'Desc_FluidCanister_C',
							amount: Math.amount_string('123.456'),
							type: 'FGItemDescriptor',
						},
						{
							item: 'Desc_HeavyOilResidue_C',
							amount: Math.amount_string('30.864'),
							type: 'FGItemDescriptor',
						},
					],
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
							type: 'FGItemDescriptor',
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
							instance.calculate(data),
							expectation
						);
					}
				}
			)
		}
	})
})
