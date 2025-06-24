import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	data,
	imports,
} from './production-data/types';
import {
	recipe_selection_enums,
} from './production-data/recipe-selection-enums';
import {
	common_base__FGAmmoTypeInstantHit__base__pre_1_1__type,
	common_base__FGAmmoTypeProjectile__base__pre_1_1__type,
	common_base__FGAmmoTypeSpreadshot__pre_1_1__type,
	ItemClass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/unassigned';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel';

import {
	// eslint-disable-next-line max-len
	v1_0_base__FGItemDescriptorPowerBoosterFuel__type as FGItemDescriptorPowerBoosterFuel__type_1p1,
	// eslint-disable-next-line max-len
	v1_0_base__FGPowerShardDescriptor__type as FGPowerShardDescriptor__type_1p1,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/common/unassigned';
import {
	common_base__FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	common_base__FGAmmoTypeInstantHit__chaos__type,
	common_base__FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	common_base__FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeSpreadshot';
import {
	common_base__FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	common_base__FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildingDescriptor';
import {
	common_base__FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGConsumableDescriptor';
import {
	common_base__FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	common_base__FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGEquipmentDescriptor';
import {
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptor';
import {
	common_base__FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGPoleDescriptor';
import {
	FGAmmoTypeProjectile__base__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeProjectile';

export type ProductionData_Type = ProductionData<
	(
		| FGPowerShardDescriptor__type
		| FGPowerShardDescriptor__type_1p1
		| undefined
	),
	(
		| FGItemDescriptorPowerBoosterFuel__type
		| FGItemDescriptorPowerBoosterFuel__type_1p1
		| undefined
	),
	(
		| common_base__FGAmmoTypeProjectile__type
		| common_base__FGAmmoTypeProjectile__base__pre_1_1__type
	),
	(
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
		| common_base__FGAmmoTypeInstantHit__base__pre_1_1__type
	),
	(
		| common_base__FGAmmoTypeSpreadshot__type
		| (
			& FGAmmoTypeProjectile__base__type
			& common_base__FGAmmoTypeSpreadshot__pre_1_1__type
		)
	),
	common_base__FGItemDescriptorBiomass__type,
	common_base__FGBuildingDescriptor__type,
	common_base__FGConsumableDescriptor__type,
	common_base__FGEquipmentDescriptor__type,
	(
		| common_base__FGItemDescriptorNuclearFuel__type
	),
	(
		| common_base__FGItemDescriptor__FGResourceDescriptor__type
	),
	(
		| common_base__FGPoleDescriptor__type
	)
>;

export class ProductionData<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| FGPowerShardDescriptor__type_1p1
		| undefined
	) = undefined,
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| FGItemDescriptorPowerBoosterFuel__type_1p1
		| undefined
	) = undefined,
	FGAmmoTypeProjectile extends (
		| common_base__FGAmmoTypeProjectile__type
		| common_base__FGAmmoTypeProjectile__base__pre_1_1__type
	) = common_base__FGAmmoTypeProjectile__type,
	FGAmmoTypeInstantHit extends (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
		| common_base__FGAmmoTypeInstantHit__base__pre_1_1__type
	) = (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
	),
	FGAmmoTypeSpreadshot extends (
		| common_base__FGAmmoTypeSpreadshot__type
		| (
			& FGAmmoTypeProjectile__base__type
			& common_base__FGAmmoTypeSpreadshot__pre_1_1__type
		)
	) = common_base__FGAmmoTypeSpreadshot__type,
	// eslint-disable-next-line max-len
	FGItemDescriptorBiomass extends common_base__FGItemDescriptorBiomass__type = common_base__FGItemDescriptorBiomass__type,
	// eslint-disable-next-line max-len
	FGBuildingDescriptor extends common_base__FGBuildingDescriptor__type = common_base__FGBuildingDescriptor__type,
	// eslint-disable-next-line max-len
	FGConsumableDescriptor extends common_base__FGConsumableDescriptor__type = common_base__FGConsumableDescriptor__type,
	// eslint-disable-next-line max-len
	FGEquipmentDescriptor extends common_base__FGEquipmentDescriptor__type = common_base__FGEquipmentDescriptor__type,
	FGItemDescriptorNuclearFuel extends (
		| common_base__FGItemDescriptorNuclearFuel__type
	) = (
		| common_base__FGItemDescriptorNuclearFuel__type
	),
	FGItemDescriptor extends (
		| common_base__FGItemDescriptor__FGResourceDescriptor__type
	) = (
		| common_base__FGItemDescriptor__FGResourceDescriptor__type
	),
	FGPoleDescriptor extends (
		| common_base__FGPoleDescriptor__type
	) = common_base__FGPoleDescriptor__type,
>
{
	#imports: imports<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel,
		FGAmmoTypeProjectile,
		FGAmmoTypeInstantHit,
		FGAmmoTypeSpreadshot,
		FGItemDescriptorBiomass,
		FGBuildingDescriptor,
		FGConsumableDescriptor,
		FGEquipmentDescriptor,
		FGItemDescriptorNuclearFuel,
		FGItemDescriptor,
		FGPoleDescriptor
	>;
	#data: data<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel,
		(
			| FGAmmoTypeProjectile
			| FGAmmoTypeInstantHit
			| FGAmmoTypeSpreadshot
		)
	>;

	constructor(imports:() => imports<
		FGPowerShardDescriptor,
		FGItemDescriptorPowerBoosterFuel,
		FGAmmoTypeProjectile,
		FGAmmoTypeInstantHit,
		FGAmmoTypeSpreadshot,
		FGItemDescriptorBiomass,
		FGBuildingDescriptor,
		FGConsumableDescriptor,
		FGEquipmentDescriptor,
		FGItemDescriptorNuclearFuel,
		FGItemDescriptor,
		FGPoleDescriptor
	>)
	{
		this.#imports = imports();
		this.#data = this.#get_data();
	}

	get data(): (
		data<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel,
			(
				| FGAmmoTypeProjectile
				| FGAmmoTypeInstantHit
				| FGAmmoTypeSpreadshot
			)
		>
	)
	{
		return this.#data;
	}

	#get_data(): (
		data<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel,
			(
				| FGAmmoTypeProjectile
				| FGAmmoTypeInstantHit
				| FGAmmoTypeSpreadshot
			)
		>
	)
	{
		const {
			FGAmmoTypeProjectile,
			FGAmmoTypeInstantHit,
			FGAmmoTypeSpreadshot,
			FGItemDescriptorBiomass,
			FGBuildingDescriptor,
			FGConsumableDescriptor,
			FGEquipmentDescriptor,
			FGItemDescriptorNuclearFuel,
			FGItemDescriptor,
			FGPoleDescriptor,
			FGRecipe,
			FGResourceDescriptor,
			FGVehicleDescriptor,
			FGBuildableGeneratorNuclear,
		} = this.#imports;

		const FGPowerShardDescriptor = (
			('FGPowerShardDescriptor' in this.#imports)
				? this.#imports.FGPowerShardDescriptor
				: undefined
		);

		const FGItemDescriptorPowerBoosterFuel = (
			('FGItemDescriptorPowerBoosterFuel' in this.#imports)
				? this.#imports.FGItemDescriptorPowerBoosterFuel
				: undefined
		);

		const resources = Object.fromEntries(
			FGResourceDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const ingredients = (new Set(FGRecipe.Classes.map(
			e => e.mIngredients,
		).filter(
			(
				maybe: '' | ItemClass__type,
			): maybe is ItemClass__type => '' !== maybe,
		).flatMap(
			e => e.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass),
			),
		)));

		const products = (new Set(FGRecipe.Classes.flatMap(
			e => e.mProduct.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass),
			),
		)));

		const resource_keys = Object.keys(resources);

		const known_byproduct = FGBuildableGeneratorNuclear.Classes.flatMap(
			(e) => e.mFuel,
		).map(
			(e) => e.mByproduct,
		);

		const ammo = Object.fromEntries(
			[
				...FGAmmoTypeProjectile.Classes,
				...FGAmmoTypeInstantHit.Classes,
				...FGAmmoTypeSpreadshot.Classes,
			].map(e => [e.ClassName, e]),
		);

		const biomass = Object.fromEntries(
			FGItemDescriptorBiomass.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const consumable = Object.fromEntries(
			FGConsumableDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const equipment = Object.fromEntries(
			FGEquipmentDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const fuel_nuclear = Object.fromEntries(
			FGItemDescriptorNuclearFuel.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const items = Object.fromEntries(
			FGItemDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const power_shards:(
			FGPowerShardDescriptor extends undefined
				? undefined
				: { [key: string]: FGPowerShardDescriptor; }
		) = (
			undefined === FGPowerShardDescriptor
				? undefined
				: Object.fromEntries(
					FGPowerShardDescriptor.Classes.map(
						(e) => [e.ClassName, e],
					),
				)
		) as (
			FGPowerShardDescriptor extends undefined
				? undefined
				: { [key: string]: FGPowerShardDescriptor; }
		);

		const power_booster_fuel:(
			FGItemDescriptorPowerBoosterFuel extends undefined
				? undefined
				: { [key: string]: FGItemDescriptorPowerBoosterFuel; }
		) = (
			undefined === FGItemDescriptorPowerBoosterFuel
				? undefined
				: Object.fromEntries(
					FGItemDescriptorPowerBoosterFuel.Classes.map(
						(e) => [e.ClassName, e],
					),
				)
		) as (
			FGItemDescriptorPowerBoosterFuel extends undefined
				? undefined
				: { [key: string]: FGItemDescriptorPowerBoosterFuel; }
		);

		const result:data<
			FGPowerShardDescriptor,
			FGItemDescriptorPowerBoosterFuel,
			(
				| FGAmmoTypeProjectile
				| FGAmmoTypeInstantHit
				| FGAmmoTypeSpreadshot
			)
		> = {
			ammo,
			biomass,
			buildings: Object.fromEntries(
				FGBuildingDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			consumable,
			equipment,
			fuel_nuclear,
			items,
			poles: undefined === FGPoleDescriptor ? {} : Object.fromEntries(
				FGPoleDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			recipes: Object.fromEntries(
				FGRecipe.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			resources,
			vehicles: Object.fromEntries(
				FGVehicleDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			power_shards,
			power_booster_fuel,
			ingredients,
			products,
			resource_keys,
			known_byproduct,
			known_not_sourced_from_recipe: [
				...ingredients.values(),
			].filter(
				(maybe) => (
					!products.has(maybe)
					&& !resource_keys.includes(maybe)
					&& !known_byproduct.includes(maybe as string)
				),
			),
			recipe_selection_enums: recipe_selection_enums(this.#imports),
			faux_ingredients_list: [
				...Object.keys(ammo),
				...Object.keys(biomass),
				...Object.keys(consumable),
				...Object.keys(equipment),
				...Object.keys(fuel_nuclear),
				...Object.keys(items),
				...Object.keys(resources),
			],
		};

		return result;
	}
}
