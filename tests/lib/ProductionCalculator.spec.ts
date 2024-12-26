import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	ProductionCalculator,
} from '../../lib/ProductionCalculator';
import {
	production_request,
	production_result,
} from '../../lib/types';
import {
	FGRecipe,
} from '../../generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableFrackingActivator';
import {
	filter_UnrealEngineString_right_x_C_suffix,
	UnrealEngineString_right_x_C_suffix,
} from '../../lib/UnrealEngineString';
import {
	FGResourceDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	FGBuildableWaterPump,
} from '../../generated-types/update8/data/CoreUObject/FGBuildableWaterPump';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableResourceExtractor';
import {
	amount_string,
	IntermediaryCalculation,
	IntermediaryNumber,
	operand_types,
} from '@signpostmarv/intermediary-number';
import {
	skip_because_docs_dot_json_not_yet_bundled,
} from '../docs_dot_json_not_yet_bundled';
import BigNumber from 'bignumber.js';
import {
	Request,
} from '../../lib/Request';
import {
	instance as production_data,
} from '../utilities/production-data';
import {
	GenerateValidators,
} from '../../lib/generate-validators';
import {
	ValidateFunction,
} from 'ajv';
import {
	flattened_production_ingredients_request_result,
} from '../utilities/flattened-production-ingredients-request-result';

// eslint-disable-next-line max-len
void describe('ProductionCalculator', skip_because_docs_dot_json_not_yet_bundled, async () => {
	const validators = await GenerateValidators.fromStandalone(
		import(
			'../../validator/production_request_schema.mjs'
		) as unknown as Promise<{
			default: ValidateFunction<production_request>,
		}>,
	);
	const instance = new ProductionCalculator(
		production_data,
		validators,
	);

	let does_not_throw_cases:UnrealEngineString_right_x_C_suffix[] =
		FGRecipe.Classes.reduce(
			(was, is) => {
				for (const product of is.mProduct) {
					const Desc_C = UnrealEngineString_right_x_C_suffix(
						product.ItemClass,
					);

					if (!was.includes(Desc_C)) {
						was.push(Desc_C);
					}
				}

				return was;
			},
			FGResourceDescriptor.Classes.filter(
				(maybe) => (
					'RF_SOLID' === maybe.mForm
					&& filter_UnrealEngineString_right_x_C_suffix(
						maybe.ClassName,
					)
				),
			).map(e => e.ClassName as UnrealEngineString_right_x_C_suffix),
		);

	does_not_throw_cases = [
		...FGBuildableFrackingActivator.Classes,
		...FGBuildableWaterPump.Classes,
		...FGBuildableResourceExtractor.Classes,
	].reduce(
		(was, is) => {
			if (is.mAllowedResources instanceof Array) {
				for (const resource of is.mAllowedResources) {
					const Desc_C = UnrealEngineString_right_x_C_suffix(
						resource,
					);

					if (!was.includes(Desc_C)) {
						was.push(Desc_C);
					}
				}
			}

			return was;
		},
		does_not_throw_cases,
	);

	void describe('calculate', () => {
		for (const Desc_C of does_not_throw_cases) {
			void it(
				`${
					instance.constructor.name
				}.calculate({pool: {${Desc_C}: 1}}) behaves`,
				() => {
					const result = instance.calculate({
						pool: {
							[Desc_C]: '1' as amount_string,
						},
					});

					assert.strictEqual(
						Desc_C in result.output,
						true,
					)
				},
			)
		}
	})

	void describe('validates', () => {
		const result_1:production_result = {
			ingredients: {
				Desc_ModularFrame_C: IntermediaryNumber.create('15'),
				Desc_Cable_C: IntermediaryNumber.create('25'),
				Desc_Cement_C: IntermediaryNumber.create('100'),
				Desc_SteelPlate_C: IntermediaryNumber.create('100'),
				Desc_IronPlateReinforced_C: IntermediaryNumber.create('22.5'),
				Desc_IronRod_C: IntermediaryNumber.create('157.5'),
				Desc_IronPlate_C: IntermediaryNumber.create('135'),
				Desc_IronScrew_C: IntermediaryNumber.create('270'),
				Desc_IronIngot_C: IntermediaryNumber.create('360'),
				Desc_OreIron_C: IntermediaryNumber.create('760'),
				Desc_Wire_C: IntermediaryNumber.create('50'),
				Desc_CopperIngot_C: IntermediaryNumber.create('25'),
				Desc_OreCopper_C: IntermediaryNumber.create('25'),
				Desc_Stone_C: IntermediaryNumber.create('300'),
				Desc_SteelIngot_C: IntermediaryNumber.create('400'),
				Desc_Coal_C: IntermediaryNumber.create('400'),
			},
			output: {
				Desc_BlueprintDesigner_C: IntermediaryNumber.create('1'),
			},
			combined: {
				Desc_BlueprintDesigner_C: {
					output: IntermediaryNumber.create('1'),
					surplus: IntermediaryNumber.create('0'),
				},
			},
		};
		const result_1000001:production_result = {
			ingredients: {
				Desc_ModularFrame_C: IntermediaryNumber.create('15.000015'),
				Desc_Cable_C: IntermediaryNumber.create('25.000025'),
				Desc_Cement_C: IntermediaryNumber.create('100.0001'),
				Desc_SteelPlate_C: IntermediaryNumber.create('100.0001'),
				Desc_IronPlateReinforced_C: IntermediaryNumber.create(
					'22.5000225',
				),
				Desc_IronRod_C: IntermediaryNumber.create('157.5001575'),
				Desc_IronPlate_C: IntermediaryNumber.create('135.000135'),
				Desc_IronScrew_C: IntermediaryNumber.create('270.00027'),
				Desc_IronIngot_C: IntermediaryNumber.create('360.00036'),
				Desc_OreIron_C: IntermediaryNumber.create('760.00076'),
				Desc_Wire_C: IntermediaryNumber.create('50.00005'),
				Desc_CopperIngot_C: IntermediaryNumber.create('25.000025'),
				Desc_OreCopper_C: IntermediaryNumber.create('25.000025'),
				Desc_Stone_C: IntermediaryNumber.create('300.0003'),
				Desc_SteelIngot_C: IntermediaryNumber.create('400.0004'),
				Desc_Coal_C: IntermediaryNumber.create('400.0004'),
			},
			output: {
				Desc_BlueprintDesigner_C: IntermediaryNumber.create(
					'1.000001',
				),
			},
			combined: {
				Desc_BlueprintDesigner_C: {
					output: IntermediaryNumber.create('1.000001'),
					surplus: IntermediaryNumber.create('0'),
				},
			},
		};

		const test_cases:[
			production_request<
				(
					| amount_string
					| operand_types
				),
				(
					| amount_string
					| operand_types
				)
			>,
			(
				| false
				| production_result<
					(
						| amount_string
						| BigNumber
						| operand_types
					)
				>
			)
		][] = [
			[
				{
					pool: {
						Desc_IronIngot_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_OreIron_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_IronIngot_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_IronIngot_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_IronRod_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronIngot_C: IntermediaryNumber.create('1'),
						Desc_OreIron_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_IronRod_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_IronRod_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_IronScrew_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronRod_C: IntermediaryNumber.create('0.25'),
						Desc_IronIngot_C: IntermediaryNumber.create('0.25'),
						Desc_OreIron_C: IntermediaryNumber.create('0.25'),
					},
					output: {
						Desc_IronScrew_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_IronScrew_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_IronPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronIngot_C: IntermediaryNumber.create('1.5'),
						Desc_OreIron_C: IntermediaryNumber.create('1.5'),
					},
					output: {
						Desc_IronPlate_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_IronPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_Cement_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Stone_C: IntermediaryNumber.create('3'),
					},
					output: {
						Desc_Cement_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_Cement_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_SteelIngot_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_OreIron_C: IntermediaryNumber.create('1'),
						Desc_Coal_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_SteelIngot_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_SteelIngot_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_SteelPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_SteelIngot_C: IntermediaryNumber.create('4'),
						Desc_OreIron_C: IntermediaryNumber.create('4'),
						Desc_Coal_C: IntermediaryNumber.create('4'),
					},
					output: {
						Desc_SteelPlate_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_SteelPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_CopperIngot_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_OreCopper_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_CopperIngot_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_CopperIngot_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_Wire_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_CopperIngot_C: IntermediaryNumber.create('0.5'),
						Desc_OreCopper_C: IntermediaryNumber.create('0.5'),
					},
					output: {
						Desc_Wire_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_Wire_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_Cable_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Wire_C: IntermediaryNumber.create('2'),
						Desc_CopperIngot_C: IntermediaryNumber.create('1'),
						Desc_OreCopper_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_Cable_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_Cable_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_IronPlateReinforced_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronPlate_C: IntermediaryNumber.create('6'),
						Desc_IronScrew_C: IntermediaryNumber.create('12'),
						Desc_IronIngot_C: IntermediaryNumber.create('12'),
						Desc_OreIron_C: IntermediaryNumber.create('12'),
						Desc_IronRod_C: IntermediaryNumber.create('3'),
					},
					output: {
						Desc_IronPlateReinforced_C: IntermediaryNumber.create(
							'1',
						),
					},
					combined: {
						Desc_IronPlateReinforced_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_ModularFrame_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronPlateReinforced_C: IntermediaryNumber.create(
							'1.5',
						),
						Desc_IronRod_C: IntermediaryNumber.create('10.5'),
						Desc_IronPlate_C: IntermediaryNumber.create('9'),
						Desc_IronScrew_C: IntermediaryNumber.create('18'),
						Desc_IronIngot_C: IntermediaryNumber.create('24'),
						Desc_OreIron_C: IntermediaryNumber.create('24'),
					},
					output: {
						Desc_ModularFrame_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_ModularFrame_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{pool: {
					Desc_BlueprintDesigner_C: '1' as amount_string,
				}},
				result_1,
			],
			[
				{pool: {
					Desc_BlueprintDesigner_C: '1',
				}},
				result_1,
			],
			[
				{pool: {
					Desc_BlueprintDesigner_C: '1.000001' as amount_string,
				}},
				result_1000001,
			],
			[
				{pool: {
					// not actually amount_string
					Desc_BlueprintDesigner_C: '1.0000001' as amount_string,
				}},
				false,
			],
			[
				{
					pool: {
						Desc_Plastic_C: '1',
					},
				},
				{
					ingredients: {
						Desc_LiquidOil_C: IntermediaryNumber.create('1.5'),
					},
					output: {
						Desc_Plastic_C: IntermediaryNumber.create('1'),
						Desc_HeavyOilResidue_C: IntermediaryNumber.create(
							'0.5',
						),
					},
					combined: {
						Desc_Plastic_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_HeavyOilResidue_C: {
							output: IntermediaryNumber.create('0.5'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{pool: {
					Desc_Water_C: '123.456' as amount_string,
				}},
				{
					ingredients: {},
					output: {
						Desc_Water_C: IntermediaryNumber.create('123.456'),
					},
					combined: {
						Desc_Water_C: {
							output: IntermediaryNumber.create('123.456'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					recipe_selection: {
						Desc_Water_C: 'Recipe_UnpackageWater_C',
					},
					pool: {
						Desc_Water_C: '123.456' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_PackagedWater_C: IntermediaryNumber.create(
							'123.456',
						),
						Desc_Water_C: IntermediaryNumber.create('123.456'),
						Desc_FluidCanister_C: IntermediaryNumber.create(
							'123.456',
						),
						Desc_Plastic_C: IntermediaryNumber.create('61.728'),
						Desc_LiquidOil_C: IntermediaryNumber.create('92.592'),
					},
					output: {
						Desc_Water_C: IntermediaryNumber.create('123.456'),
						Desc_FluidCanister_C: IntermediaryNumber.create(
							'123.456',
						),
						Desc_HeavyOilResidue_C: IntermediaryNumber.create(
							'30.864',
						),
					},
					combined: {
						Desc_Water_C: {
							output: IntermediaryNumber.create('123.456'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_FluidCanister_C: {
							output: IntermediaryNumber.create('123.456'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_HeavyOilResidue_C: {
							output: IntermediaryNumber.create('30.864'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_Cable_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Wire_C: IntermediaryNumber.create('2'),
						Desc_CopperIngot_C: IntermediaryNumber.create('1'),
						Desc_OreCopper_C: IntermediaryNumber.create('1'),
					},
					output: {
						Desc_Cable_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_Cable_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					input: {
						Desc_Wire_C: '10' as amount_string,
					},
					pool: {
						Desc_Cable_C: '1' as amount_string,
					},
				},
				{
					ingredients: {},
					output: {
						Desc_Cable_C: IntermediaryNumber.create('1'),
					},
					surplus: {
						Desc_Wire_C: IntermediaryNumber.create('8'),
					},
					combined: {
						Desc_Cable_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_Wire_C: {
							output: IntermediaryNumber.create('0'),
							surplus: IntermediaryNumber.create('1'),
						},
					},
				},
			],
			[
				{
					input: {
						Desc_OreIron_C: '30' as amount_string,
					},
					pool: {
						Desc_ModularFrame_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronPlateReinforced_C: IntermediaryNumber.create(
							'1.5',
						),
						Desc_IronRod_C: IntermediaryNumber.create('10.5'),
						Desc_IronPlate_C: IntermediaryNumber.create('9'),
						Desc_IronScrew_C: IntermediaryNumber.create('18'),
						Desc_IronIngot_C: IntermediaryNumber.create('24'),
					},
					output: {
						Desc_ModularFrame_C: IntermediaryNumber.create('1'),
					},
					surplus: {
						Desc_OreIron_C: IntermediaryNumber.create('6'),
					},
					combined: {
						Desc_ModularFrame_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_OreIron_C: {
							output: IntermediaryNumber.create('0'),
							surplus: IntermediaryNumber.create('6'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_UraniumCell_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Cement_C: IntermediaryNumber.create('0.6'),
						Desc_OreUranium_C: IntermediaryNumber.create('2'),
						Desc_Stone_C: IntermediaryNumber.create('1.8'),
						Desc_Sulfur_C: IntermediaryNumber.create('1.6'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('1.6'),
						Desc_Water_C: IntermediaryNumber.create('1.6'),
					},
					output: {
						Desc_UraniumCell_C: IntermediaryNumber.create('1'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('0.4'),
					},
					combined: {
						Desc_UraniumCell_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_SulfuricAcid_C: {
							output: IntermediaryNumber.create('0.4'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_NuclearFuelRod_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Cement_C: IntermediaryNumber.create('45'),
						// eslint-disable-next-line max-len
						Desc_CircuitBoardHighSpeed_C: IntermediaryNumber.create('5'),
						Desc_Coal_C: IntermediaryNumber.create('81.75'),
						Desc_CopperIngot_C: IntermediaryNumber.create('80'),
						Desc_CopperSheet_C: IntermediaryNumber.create('25'),
						// eslint-disable-next-line max-len
						Desc_ElectromagneticControlRod_C: IntermediaryNumber.create('5'),
						Desc_GoldIngot_C: IntermediaryNumber.create('20'),
						Desc_HighSpeedWire_C: IntermediaryNumber.create('100'),
						Desc_OreCopper_C: IntermediaryNumber.create('80'),
						Desc_OreGold_C: IntermediaryNumber.create('60'),
						Desc_OreIron_C: IntermediaryNumber.create('81.75'),
						Desc_OreUranium_C: IntermediaryNumber.create('100'),
						Desc_Stator_C: IntermediaryNumber.create('7.5'),
						Desc_SteelIngot_C: IntermediaryNumber.create('81.75'),
						Desc_SteelPipe_C: IntermediaryNumber.create('22.5'),
						Desc_SteelPlateReinforced_C: IntermediaryNumber.create(
							'3',
						),
						Desc_SteelPlate_C: IntermediaryNumber.create('12'),
						Desc_Stone_C: IntermediaryNumber.create('135'),
						Desc_Sulfur_C: IntermediaryNumber.create('80'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('80'),
						Desc_UraniumCell_C: IntermediaryNumber.create('50'),
						Desc_Water_C: IntermediaryNumber.create('80'),
						Desc_Wire_C: IntermediaryNumber.create('60'),
					},
					output: {
						Desc_NuclearFuelRod_C: IntermediaryNumber.create('1'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('20'),
					},
					combined: {
						Desc_NuclearFuelRod_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_SulfuricAcid_C: {
							output: IntermediaryNumber.create('20'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_NuclearWaste_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_Cement_C: IntermediaryNumber.create('0.9'),
						// eslint-disable-next-line max-len
						Desc_CircuitBoardHighSpeed_C: IntermediaryNumber.create('0.1'),
						Desc_Coal_C: IntermediaryNumber.create('1.635'),
						Desc_CopperIngot_C: IntermediaryNumber.create('1.6'),
						Desc_CopperSheet_C: IntermediaryNumber.create('0.5'),
						// eslint-disable-next-line max-len
						Desc_ElectromagneticControlRod_C: IntermediaryNumber.create('0.1'),
						Desc_GoldIngot_C: IntermediaryNumber.create('0.4'),
						Desc_HighSpeedWire_C: IntermediaryNumber.create('2'),
						Desc_NuclearFuelRod_C: IntermediaryNumber.create(
							'0.02',
						),
						Desc_OreCopper_C: IntermediaryNumber.create('1.6'),
						Desc_OreGold_C: IntermediaryNumber.create('1.2'),
						Desc_OreIron_C: IntermediaryNumber.create('1.635'),
						Desc_OreUranium_C: IntermediaryNumber.create('2'),
						Desc_Stator_C: IntermediaryNumber.create('0.15'),
						Desc_SteelIngot_C: IntermediaryNumber.create('1.635'),
						Desc_SteelPipe_C: IntermediaryNumber.create('0.45'),
						// eslint-disable-next-line max-len
						Desc_SteelPlateReinforced_C: IntermediaryNumber.create('0.06'),
						Desc_SteelPlate_C: IntermediaryNumber.create('0.24'),
						Desc_Stone_C: IntermediaryNumber.create('2.7'),
						Desc_Sulfur_C: IntermediaryNumber.create('1.6'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('1.6'),
						Desc_UraniumCell_C: IntermediaryNumber.create('1'),
						Desc_Water_C: IntermediaryNumber.create('1.6'),
						Desc_Wire_C: IntermediaryNumber.create('1.2'),
					},
					output: {
						Desc_NuclearWaste_C: IntermediaryNumber.create('1'),
						Desc_SulfuricAcid_C: IntermediaryNumber.create('0.4'),
					},
					combined: {
						Desc_NuclearWaste_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_SulfuricAcid_C: {
							output: IntermediaryNumber.create('0.4'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					recipe_selection: {
						Desc_Plastic_C: 'Recipe_Alternate_Plastic_1_C',
						Desc_Rubber_C: 'Recipe_Alternate_RecycledRubber_C',
					},
					pool: {
						Desc_Plastic_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_LiquidOil_C: IntermediaryNumber.create('1.5'),
						Desc_LiquidFuel_C: IntermediaryNumber.One,
						Desc_Plastic_C: IntermediaryCalculation.fromString(
							'1/3',
						),
						Desc_Rubber_C: IntermediaryCalculation.fromString(
							'2/3',
						),
					},
					output: {
						Desc_Plastic_C: IntermediaryNumber.create('1'),
						Desc_PolymerResin_C: IntermediaryNumber.create('0.75'),
					},
					surplus: {
						Desc_Plastic_C: IntermediaryCalculation.fromString(
							'(8 + (1/3)) / 100',
						),
					},
					combined: {
						Desc_PolymerResin_C: {
							output: IntermediaryNumber.create('0.75'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_Plastic_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0.083334'),
						},
					},
				},
			],
			[
				{
					recipe_selection: {
						Desc_IronPlate_C: 'Recipe_Alternate_CoatedIronPlate_C',
						Desc_Plastic_C: 'Recipe_Alternate_Plastic_1_C',
						Desc_Rubber_C: 'Recipe_Alternate_RecycledRubber_C',
					},
					pool: {
						Desc_IronPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronIngot_C: IntermediaryCalculation.fromString(
							'2/3',
						),
						Desc_LiquidFuel_C: IntermediaryCalculation.fromString(
							'(1 + (1/3))/10',
						),
						Desc_LiquidOil_C: IntermediaryNumber.create('0.2'),
						Desc_OreIron_C: IntermediaryCalculation.fromString(
							'2/3',
						),
						Desc_Plastic_C: IntermediaryNumber.create('0.177778'),
						Desc_Rubber_C: IntermediaryNumber.create('0.088889'),
					},
					output: {
						Desc_IronPlate_C: IntermediaryNumber.create('1'),
						Desc_PolymerResin_C: IntermediaryNumber.create('0.1'),
					},
					combined: {
						Desc_IronPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_PolymerResin_C: {
							output: IntermediaryNumber.create('0.1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_IronPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_IronIngot_C: IntermediaryNumber.create('1.5'),
						Desc_OreIron_C: IntermediaryNumber.create('1.5'),
					},
					output: {
						Desc_IronPlate_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_IronPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					input: {
						Desc_IronIngot_C: '3' as amount_string,
					},
					pool: {
						Desc_IronPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {},
					output: {
						Desc_IronPlate_C: IntermediaryNumber.create('1'),
					},
					surplus: {
						Desc_IronIngot_C: IntermediaryNumber.create('1.5'),
					},
					combined: {
						Desc_IronPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_IronIngot_C: {
							output: IntermediaryNumber.create('0'),
							surplus: IntermediaryNumber.create('1.5'),
						},
					},
				},
			],
			[
				{
					pool: {
						Desc_SteelPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_SteelIngot_C: IntermediaryNumber.create('4'),
						Desc_OreIron_C: IntermediaryNumber.create('4'),
						Desc_Coal_C: IntermediaryNumber.create('4'),
					},
					output: {
						Desc_SteelPlate_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_SteelPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					recipe_selection: {
						Desc_SteelIngot_C: 'Recipe_Alternate_IngotSteel_1_C',
					},
					pool: {
						Desc_SteelPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_SteelIngot_C: IntermediaryNumber.create('4'),
						Desc_IronIngot_C: IntermediaryCalculation.fromString(
							'2 + (2/3)',
						),
						Desc_OreIron_C: IntermediaryCalculation.fromString(
							'2 + (2/3)',
						),
						Desc_Coal_C: IntermediaryCalculation.fromString(
							'2 + (2/3)',
						),
					},
					output: {
						Desc_SteelPlate_C: IntermediaryNumber.create('1'),
					},
					combined: {
						Desc_SteelPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
					},
				},
			],
			[
				{
					input: {
						Desc_IronIngot_C: '3' as amount_string,
					},
					recipe_selection: {
						Desc_SteelIngot_C: 'Recipe_Alternate_IngotSteel_1_C',
					},
					pool: {
						Desc_SteelPlate_C: '1' as amount_string,
					},
				},
				{
					ingredients: {
						Desc_SteelIngot_C: IntermediaryNumber.create('4'),
						Desc_Coal_C: IntermediaryCalculation.fromString(
							'2 + (2/3)',
						),
					},
					output: {
						Desc_SteelPlate_C: IntermediaryNumber.create('1'),
					},
					surplus: {
						Desc_IronIngot_C: IntermediaryCalculation.fromString(
							'1/3',
						),
					},
					combined: {
						Desc_SteelPlate_C: {
							output: IntermediaryNumber.create('1'),
							surplus: IntermediaryNumber.create('0'),
						},
						Desc_IronIngot_C: {
							output: IntermediaryNumber.create('0'),
							surplus: IntermediaryCalculation.fromString('1/3'),
						},
					},
				},
			],
			[
				{
					input: {
						Desc_IronIngot_C: '360' as amount_string,
					},
					pool: {
						Desc_BlueprintDesigner_C: '1' as amount_string,
					},
				},
				{
					ingredients: Object.fromEntries(
						Object.entries(result_1.ingredients).filter(
							(maybe) => 'Desc_IronIngot_C' !== maybe[0],
						).map(
							(ingredient) => {
								if (ingredient[0] === 'Desc_OreIron_C') {
									return [
										'Desc_OreIron_C',
										IntermediaryNumber.create('400'),
									];
								}

								return ingredient;
							},
						),
					),
					output: result_1.output,
					combined: Object.fromEntries(
						Object.entries(result_1.output).map(e => {
							return [
								e[0],
								{
									output: e[1],
									surplus: IntermediaryNumber.Zero,
								},
							];
						}),
					),
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
						data,
					);

					if (false === expectation) {
						assert.throws(get_result);
					} else {
						assert.doesNotThrow(get_result);

						assert.deepEqual(
							flattened_production_ingredients_request_result(
								instance.calculate(data),
							),
							flattened_production_ingredients_request_result(
								expectation,
							),
						);
					}
				},
			)

			if (false === expectation) {
				continue;
			}

			void it(
				`behaves with a typed version of ${
					JSON.stringify(data)
				}`,
				() => {
					const request = new Request<
						| amount_string
						| operand_types
					>();

					request.input = data.input;
					request.pool = data.pool;
					request.recipe_selection = data.recipe_selection;


					const get_result = () => instance.validate(
						request,
					);
					assert.doesNotThrow(get_result);

					assert.deepEqual(
						flattened_production_ingredients_request_result(
							instance.calculate(request),
						),
						flattened_production_ingredients_request_result(
							expectation,
						),
					);

					assert.deepEqual(
						flattened_production_ingredients_request_result(
							instance.calculate(request.toData()),
						),
						flattened_production_ingredients_request_result(
							expectation,
						),
					);
				},
			)
		}

		for (const Desc_C of does_not_throw_cases) {
			void it(
				`${
					instance.constructor.name
				}.validate({pool: {${Desc_C}: 1}}) behaves`,
				() => {
					const get_result = () => instance.validate({
						pool:{
							[Desc_C]: '1' as amount_string,
						},
					});

					assert.doesNotThrow(get_result);
				},
			)
		}
	})
})
