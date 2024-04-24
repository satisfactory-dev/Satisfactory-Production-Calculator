import assert from 'assert';
import {
	ValidateFunction,
} from 'ajv/dist/2020';
import production_ingredients_request_validator from
	'../validator/production_ingredients_request_schema.mjs';
import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions.js';
import {
	FGItemDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptor';
import {
	FGItemDescriptor__FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe,
} from '../generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGRecipe__type,
} from '../generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	amount_string,
	Math,
	number_arg,
} from './Math';
import {
	PlannerRequest,
	UnrealEngineString_right_x_C_suffix,
} from './planner-request';
import {
	FGBuildingDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGBuildingDescriptor';
import {
	FGBuildingDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGResourceDescriptor';
import {
	integer_string__type,
} from '../generated-types/update8/common/unassigned';
import {
	UnrealEngineString,
} from '../generated-types/update8/utils/validators';
import BigNumber from 'bignumber.js';
import {
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';
import {
	is_string,
} from '@satisfactory-clips-archive/docs.json.ts/lib/StringStartsWith.js';
import {
	FGItemDescriptorBiomass__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	FGItemDescriptorBiomass,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptorBiomass';
import {
	FGPoleDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGPoleDescriptor';
import {
	FGPoleDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGPoleDescriptor';
import {
	FGEquipmentDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor';
import {
	FGEquipmentDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGEquipmentDescriptor';
import {
	FGAmmoTypeProjectile,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeProjectile';
import {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
} from '../generated-types/update8/classes/CoreUObject/FGVehicleDescriptor';
import {
	FGVehicleDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGVehicleDescriptor';
import {
	FGItemDescriptorNuclearFuel__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGItemDescriptorNuclearFuel,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGConsumableDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGConsumableDescriptor';
import {
	FGConsumableDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGConsumableDescriptor';
import {
	FGAmmoTypeInstantHit,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeSpreadshot';

const ammo = Object.fromEntries(
	[
		...FGAmmoTypeProjectile.Classes,
		...FGAmmoTypeInstantHit.Classes,
		...FGAmmoTypeSpreadshot.Classes,
	].map(e => [e.ClassName, e])
);
const biomass:{
	[
		key in FGItemDescriptorBiomass__type[
			'ClassName'
		]
	]: FGItemDescriptorBiomass__type
} = Object.fromEntries(
	FGItemDescriptorBiomass.Classes.map(e => [e.ClassName, e])
);
const buildings:{
	[
		key in FGBuildingDescriptor__type[
			'ClassName'
		]
	]: FGBuildingDescriptor__type
} = Object.fromEntries(
	FGBuildingDescriptor.Classes.map(e => [e.ClassName, e])
);
const consumable:{
	[
		key in FGConsumableDescriptor__type[
			'ClassName'
		]
	]: FGConsumableDescriptor__type
} = Object.fromEntries(
	FGConsumableDescriptor.Classes.map(e => [e.ClassName, e])
);
const equipment:{
	[
		key in FGEquipmentDescriptor__type[
			'ClassName'
		]
	]: FGEquipmentDescriptor__type
} = Object.fromEntries(
	FGEquipmentDescriptor.Classes.map(e => [e.ClassName, e])
);

const fuel_nuclear:{
	[
		key in FGItemDescriptorNuclearFuel__type[
			'ClassName'
		]
	]: FGItemDescriptorNuclearFuel__type
} = Object.fromEntries(
	FGItemDescriptorNuclearFuel.Classes.map(e => [e.ClassName, e])
);

const items:{
	[
		key in FGItemDescriptor__FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGItemDescriptor__FGResourceDescriptor__type;
} = Object.fromEntries(
	FGItemDescriptor.Classes.map(e => [e.ClassName, e])
);
const poles:{
	[
		key in FGPoleDescriptor__type[
			'ClassName'
		]
	]: FGPoleDescriptor__type
} = Object.fromEntries(
	FGPoleDescriptor.Classes.map(e => [e.ClassName, e])
);
const recipes:{
	[
		key in FGRecipe__type[
			'ClassName'
		]
	]: FGRecipe__type
} = Object.fromEntries(
	FGRecipe.Classes.map(e => [e.ClassName, e])
);
const resources:{
	[
		key in FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGResourceDescriptor__type
} = Object.fromEntries(
	FGResourceDescriptor.Classes.map(e => [e.ClassName, e])
);

type FGVehicleDescriptor__type = (
	| FGVehicleDescriptor__powered_no_inventory__type
	| FGVehicleDescriptor__unfueled_with_inventory__type
	| FGVehicleDescriptor__fueled_with_inventory__type
);

const vehicles:{
	[
		key in FGVehicleDescriptor__type[
			'ClassName'
		]
	]: FGVehicleDescriptor__type
} = Object.fromEntries(
	FGVehicleDescriptor.Classes.map(e => [e.ClassName, e])
);

/**
 * @todo remove hardcoding
 */
const known_not_sourced_from_recipe = [
	'Desc_HUBParts_C',
	'Desc_FlowerPetals_C',
	'Desc_Gift_C',
	'Desc_StingerParts_C',
	'Desc_Mycelia_C',
	'Desc_Nut_C',
	'Desc_Crystal_C',
];

/**
 * @todo remove hardcoding
 */
const known_byproduct = [
	'Desc_NuclearWaste_C',
	'Desc_PlutoniumWaste_C',
];

export type production_ingredients_request = {
	input?: recipe_ingredients_request_output<amount_string>[],
	recipe_selection?: {
		[key in `${'Desc'|'BP'|'Foundation'}_${string}_C`]: `${'Recipe'|'Build'}_${string}_C`
	},
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: number_arg,
	}[],
};

export type recipe_ingredients_request_ingredient<
T extends amount_string|BigNumber = amount_string
> = {
	item: keyof typeof items,
	amount: T,
};
export type recipe_ingredients_request_output<
	T extends amount_string|BigNumber = amount_string
> = {
	item: (
		keyof (
			| typeof buildings
			| typeof items
			| typeof resources
		)
	),
	amount: T,
};

export type production_ingredients_request_result<
	T extends amount_string|BigNumber = amount_string
> = {
	ingredients: recipe_ingredients_request_ingredient<T>[],
	output: recipe_ingredients_request_output<T>[],
	surplus: recipe_ingredients_request_output<T>[],
};

export class ProductionIngredientsRequest extends PlannerRequest<
	production_ingredients_request,
	production_ingredients_request_result
> {
	constructor()
	{
		super(
			production_ingredients_request_validator as ValidateFunction<
				production_ingredients_request
			>
		);
	}

	fromUrlQuery(query:string): production_ingredients_request
	{
		const regex =
			/^(input|pool|recipe_selection)\[(?:Desc|BP|Foundation)_[^.]+_C\]$/
		;
		const params = new URLSearchParams(query);

		const keys = [...params.keys()].filter(maybe => regex.test(maybe));

		const input = keys.filter(maybe => maybe.startsWith('input['));
		const pool = keys.filter(maybe => maybe.startsWith('pool['));
		const recipe_selection = Object.fromEntries(keys.filter(
			maybe => maybe.startsWith('recipe_selection[')
		).map((e): [string, unknown] => [
			e.substring(17, e.length - 1),
			params.get(e),
		]).filter((maybe): maybe is [
			string,
			`${'Recipe'|'Build'}_${string}_C`,
		] => {
			return (
				is_string(maybe[1])
				&& /^(?:Recipe|Build)_[^.]+_C$/.test(maybe[1])
			);
		}));

		function map_filter(
			keys:string[],
			key_prefix:string
		): {
			item: keyof typeof recipe_selection_schema['properties'],
			amount: amount_string
		}[] {
			return keys.map((e) => {
				return {
					item: e.substring(
						key_prefix.length,
						e.length - 1
					),
					amount: params.get(e),
				};
			}).filter(
				(maybe): maybe is {
					item: keyof typeof recipe_selection_schema['properties'],
					amount: amount_string
				} => {
					return (
						is_string(maybe.item)
						&& maybe.item in recipe_selection_schema.properties
						&& Math.is_amount_string(maybe.amount)
					);
				}
			);
		}

		const result:production_ingredients_request = {
			pool: map_filter(pool, 'pool['),
		};

		const input_value = map_filter(input, 'input[');

		if (input_value.length) {
			result.input = input_value;
		}

		if (Object.keys(recipe_selection).length > 0) {
			result.recipe_selection = recipe_selection;
		}

		return result;
	}

	protected calculate_precisely(
		data:production_ingredients_request,
		surplus?:recipe_ingredients_request_output<BigNumber>[]
	): production_ingredients_request_result<BigNumber> {
		const ingredients:{
			[key in keyof typeof items]: BigNumber;
		} = {};
		const input:{[key: string]: BigNumber} = {};
		for (const entry of (surplus || data.input || [])) {
			if (!(entry.item in input)) {
				input[entry.item] = BigNumber(0);
			}

			input[entry.item] = input[entry.item].plus(entry.amount);
		}
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: BigNumber;
		} = {};

		for (const entry of data.pool) {
			const {item: production, amount:output_amount} = entry;
			let {amount} = entry;
			let amount_from_input = BigNumber(0);

			if (production in input) {
				if (input[production].isLessThan(amount)) {
					amount_from_input = input[production].minus(0);
					amount = BigNumber(amount).minus(amount_from_input);
				} else {
					amount_from_input = BigNumber(output_amount);
					amount = BigNumber(0);
				}
			}

			output[production] = amount_from_input;

			if (0 === BigNumber(amount).comparedTo(0)) {
				continue;
			}

			const recipe = (
				data.recipe_selection && production in data.recipe_selection
					? data.recipe_selection[production]
					: recipe_selection_schema.properties[production].default
			);

			if (undefined === recipes[recipe]) {
				assert.strictEqual(
					recipe.startsWith('Build_'),
					true,
					new NoMatchError(
						{
							production,
							amount,
							recipe,
						},
						'Expecting to find a building recipe!'
					)
				);

				assert.strictEqual(
					production in resources,
					true,
					new NoMatchError(
						{
							recipe,
							expected: production,
						},
						`Supported ingredient found but missing item!`
					)
				);

				output[
					production as keyof typeof resources
				] = Math.append_multiply(
					output[production as keyof typeof resources],
					1,
					amount
				);

				continue;
			}

			const {
				mIngredients,
				mProduct,
			} = recipes[recipe];

			const ingredient_amounts = mIngredients.map(
				e => ProductionIngredientsRequest.amend_ItemClass_amount(
					e
				).Amount
			);

			const product_amounts = mProduct.map(
				e => ProductionIngredientsRequest.amend_ItemClass_amount(
					e
				).Amount
			);

			const amounts = [
				...ingredient_amounts,
				...product_amounts,
			];

			assert.strictEqual(
				amounts.length >= 2,
				true,
				new NoMatchError(
					{
						amounts,
					},
					'Expected at least two numbers!'
				)
			);

			const divisor = Math.least_common_multiple(
				[
					1,
					...product_amounts,
				] as [number_arg, number_arg, ...number_arg[]]
			);

			for (const ingredient of mIngredients) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass
				);

				assert.strictEqual(
					(
						Desc_C in ammo
						|| Desc_C in biomass
						|| Desc_C in consumable
						|| Desc_C in equipment
						|| Desc_C in items
						|| Desc_C in resources
					),
					true,
					new NoMatchError(
						{
							recipe,
							ingredient: ingredient.ItemClass.right,
							expected: Desc_C,
						},
						`Supported ingredient found (${Desc_C}) but missing item!`
					)
				);

				if (!(Desc_C in ingredients)) {
					ingredients[Desc_C] = BigNumber(0);
				}

				ingredients[Desc_C] = Math.append_multiply(
					ingredients[Desc_C],
					BigNumber(
						ProductionIngredientsRequest.amend_ItemClass_amount(
							ingredient
						).Amount
					).dividedBy(
						divisor
					),
					amount
				);
			}

			for (const product of mProduct) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					product.ItemClass
				);

				assert.strictEqual(
					(
						Desc_C in ammo
						|| Desc_C in biomass
						|| Desc_C in buildings
						|| Desc_C in consumable
						|| Desc_C in equipment
						|| Desc_C in fuel_nuclear
						|| Desc_C in items
						|| Desc_C in poles
						|| Desc_C in resources
						|| Desc_C in vehicles
					),
					true,
					new NoMatchError(
						{
							recipe,
							product: product.ItemClass.right,
							expected: Desc_C,
						},
						`Supported product found (${Desc_C}) but missing item!`
					)
				);

				if (!(Desc_C in output)) {
					output[Desc_C] = BigNumber(0);
				}

				output[Desc_C] = Math.append_multiply(
					output[Desc_C],
					BigNumber(
						ProductionIngredientsRequest.amend_ItemClass_amount(
							product
						).Amount
					).dividedBy(
						divisor
					),
					amount
				);
			}
		}

		const result:production_ingredients_request_result<BigNumber> = {
			ingredients: Object.entries(ingredients).map(e => {
				return {
					item: e[0],
					amount: BigNumber.max(0, e[1].minus(input[e[0]] || 0)),
				};
			}).filter(maybe => maybe.amount.isGreaterThan(0)),
			output: Object.entries(output).map(e => {
				return {
					item: e[0],
					amount: e[1],
				};
			}),
			surplus: Object.entries(input).map(e => {
				return {
					item: e[0],
					amount: e[1]
						.minus(ingredients[e[0]] || 0)
						.minus(output[e[0]] || 0),
				};
			}).filter(maybe => maybe.amount.isGreaterThan(0)),
		};

		return result;
	}

	protected calculate_validated(
		data:production_ingredients_request
	): production_ingredients_request_result {
		const initial_result = this.calculate_precisely(data);
		const results = [initial_result];
		let surplus:recipe_ingredients_request_output<
			BigNumber
		>[] = initial_result.surplus;

		let checking_recursively = initial_result.ingredients.filter(
			maybe => !(maybe.item in resources)
		);

		while (checking_recursively.length > 0) {
			const when_done:recipe_ingredients_request_ingredient<
				BigNumber
			>[] = [];

			for (const check_deeper of checking_recursively) {
				assert.strictEqual(
					(
						check_deeper.item in recipe_selection_schema[
							'properties'
						]
						|| known_not_sourced_from_recipe.includes(
							check_deeper.item
						)
						|| known_byproduct.includes(
							check_deeper.item
						)
					),
					true,
					new NoMatchError(
						check_deeper.item,
						`Item (${check_deeper.item}) not found in recipe selection!`
					)
				);

				if (
					known_not_sourced_from_recipe.includes(
						check_deeper.item
					)
					|| known_byproduct.includes(
						check_deeper.item
					)
				) {
					continue;
				}

				const deeper_result = this.calculate_precisely(
					{
						...data,
						pool: [{
							item: (
								check_deeper.item as keyof (
									typeof recipe_selection_schema[
										'properties'
									]
								)
							),
							amount: check_deeper.amount,
						}],
					},
					surplus
				);
				surplus = deeper_result.surplus;

				const self_output = deeper_result.output.find(
					maybe => maybe.item === check_deeper.item
				);

				not_undefined(self_output);

				self_output.amount = self_output.amount.minus(
					check_deeper.amount
				);

				const maybe_check_further = deeper_result.ingredients.filter(
					maybe => !(maybe.item in resources)
				);

				if (maybe_check_further.length) {
					when_done.push(...maybe_check_further);
				}

				results.push(deeper_result);
			}

			checking_recursively = when_done;
		}

		const ingredients:{[key: string]: BigNumber} = {};
		const output:{[key: string]: BigNumber} = {};

		for (const entry of results) {
			for (const ingredient of entry.ingredients) {
				if (!(ingredient.item in ingredients)) {
					ingredients[ingredient.item] = ingredient.amount;
				} else {
					ingredients[
						ingredient.item
					] = ingredients[ingredient.item].plus(
						ingredient.amount
					);
				}
			}

			for (const output_entry of entry.output) {
				if (!(output_entry.item in output)) {
					output[output_entry.item] = output_entry.amount;
				} else {
					output[
						output_entry.item
					] = output[output_entry.item].plus(
						output_entry.amount
					);
				}
			}
		}

		return {
			ingredients: Object.entries(ingredients).map(e => {
				return {
					item: e[0],
					amount: Math.round_off(e[1]),
				}
			}),
			output: Object.entries(output).map(e => {
				return {
					item: e[0],
					amount: Math.round_off(e[1]),
				}
			}).filter(maybe => '0' !== maybe.amount),
			surplus: surplus.filter(
				maybe => maybe.amount.isGreaterThan(0)
			).map(e => {
				return {
					item: e.item,
					amount: Math.round_off(e.amount),
				};
			}),
		};
	}

	static amend_ItemClass_amount(
		ItemClass:{
			ItemClass: UnrealEngineString;
			Amount: integer_string__type;
		}
	): {
		ItemClass: UnrealEngineString;
		Amount: number_arg;
	} {

		const Desc_c = UnrealEngineString_right_x_C_suffix(
			ItemClass.ItemClass
		);

		return {
			ItemClass: ItemClass.ItemClass,
			Amount: (
				(
					(
						Desc_c in resources
						&& 'RF_SOLID' !== resources[Desc_c].mForm
					)
					|| (
						Desc_c in items
						&& 'RF_SOLID' !== items[Desc_c].mForm
					)
				)
					? BigNumber(ItemClass.Amount).dividedBy(1000)
					: ItemClass.Amount
			),
		};
	}
}
