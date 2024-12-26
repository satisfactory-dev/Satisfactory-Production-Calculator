import {
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptor';
import {
	common_base__FGRecipe__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGRecipe';
import {
	common_base__FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildingDescriptor';
import {
	common_base__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGResourceDescriptor';
import {
	common_base__FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	common_base__FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGPoleDescriptor';
import {
	common_base__FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGEquipmentDescriptor';
import {
	common_base__FGVehicleDescriptor__fueled_with_inventory__type,
	common_base__FGVehicleDescriptor__powered_no_inventory__type,
	common_base__FGVehicleDescriptor__with_inventory__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGVehicleDescriptor';
import {
	common_base__FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	common_base__FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGConsumableDescriptor';
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
	common_base__FGBuildableGeneratorNuclear__mFuel__base__type,
	common_base__FGBuildableGeneratorNuclear__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildableGeneratorNuclear';
import {
	common_base__FGBuildableFrackingActivator__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildableFrackingActivator';
import {
	common_base__FGBuildableWaterPump__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildableWaterPump';
import {
	common_base__FGBuildableResourceExtractor__miner__type,
	common_base__FGBuildableResourceExtractor__oil_extractor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildableResourceExtractor';

import {
	UnrealEngineString_right_x_C_suffix,
} from '../UnrealEngineString';
import {
	class__no_description_or_display_name__type,
	common_base__FGBuildableResourceExtractor__miner_mk3__type,
	NativeClass__type,
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

export type FGVehicleDescriptor__type = (
	| common_base__FGVehicleDescriptor__powered_no_inventory__type
	| common_base__FGVehicleDescriptor__with_inventory__type
	| common_base__FGVehicleDescriptor__fueled_with_inventory__type
);

export type imports_dict = {
	[key: string]: NativeClass__type,
};

export type NativeClass__type__wrapper<
	T extends class__no_description_or_display_name__type
> = NativeClass__type & {
	Classes: [T, ...T[]],
};

export type imports<
	FGPowerShardDescriptor extends (
		| FGPowerShardDescriptor__type
		| undefined
	) = undefined,
	FGItemDescriptorPowerBoosterFuel extends (
		| FGItemDescriptorPowerBoosterFuel__type
		| undefined
	) = undefined,
	// eslint-disable-next-line max-len
	FGAmmoTypeProjectile extends common_base__FGAmmoTypeProjectile__type = common_base__FGAmmoTypeProjectile__type,
	FGAmmoTypeInstantHit extends (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
	) = (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
	),
	// eslint-disable-next-line max-len
	FGAmmoTypeSpreadshot extends common_base__FGAmmoTypeSpreadshot__type = common_base__FGAmmoTypeSpreadshot__type,
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
	// eslint-disable-next-line max-len
	FGPoleDescriptor extends common_base__FGPoleDescriptor__type = common_base__FGPoleDescriptor__type,
	FGRecipe extends common_base__FGRecipe__type = common_base__FGRecipe__type,
	// eslint-disable-next-line max-len
	FGResourceDescriptor extends common_base__FGResourceDescriptor__type = common_base__FGResourceDescriptor__type,
	FGVehicleDescriptor extends (
		| common_base__FGVehicleDescriptor__fueled_with_inventory__type
		| common_base__FGVehicleDescriptor__powered_no_inventory__type
		| common_base__FGVehicleDescriptor__with_inventory__type
	) = (
		| common_base__FGVehicleDescriptor__fueled_with_inventory__type
		| common_base__FGVehicleDescriptor__powered_no_inventory__type
		| common_base__FGVehicleDescriptor__with_inventory__type
	),
	FGBuildableGeneratorNuclear extends (
		| common_base__FGBuildableGeneratorNuclear__type
	) = (
		| common_base__FGBuildableGeneratorNuclear__type
	),
	FGBuildableFrackingActivator extends (
		| common_base__FGBuildableFrackingActivator__type
	) = (
		| common_base__FGBuildableFrackingActivator__type
	),
	// eslint-disable-next-line max-len
	FGBuildableWaterPump extends common_base__FGBuildableWaterPump__type = common_base__FGBuildableWaterPump__type,
	FGBuildableResourceExtractor extends (
		| common_base__FGBuildableResourceExtractor__oil_extractor__type
		| common_base__FGBuildableResourceExtractor__miner_mk3__type
		| common_base__FGBuildableResourceExtractor__miner__type
	) = (
		| common_base__FGBuildableResourceExtractor__oil_extractor__type
		| common_base__FGBuildableResourceExtractor__miner_mk3__type
		| common_base__FGBuildableResourceExtractor__miner__type
	),
> = imports_dict & {
	FGAmmoTypeProjectile: NativeClass__type__wrapper<FGAmmoTypeProjectile>,
	FGAmmoTypeInstantHit: NativeClass__type__wrapper<FGAmmoTypeInstantHit>,
	FGAmmoTypeSpreadshot: NativeClass__type__wrapper<FGAmmoTypeSpreadshot>,
	FGItemDescriptorBiomass: NativeClass__type__wrapper<
		FGItemDescriptorBiomass
	>,
	FGBuildingDescriptor: NativeClass__type__wrapper<FGBuildingDescriptor>,
	FGConsumableDescriptor: NativeClass__type__wrapper<
		FGConsumableDescriptor
	>,
	FGEquipmentDescriptor: NativeClass__type__wrapper<FGEquipmentDescriptor>,
	FGItemDescriptorNuclearFuel: NativeClass__type__wrapper<
		FGItemDescriptorNuclearFuel
	>,
	FGItemDescriptor: NativeClass__type__wrapper<FGItemDescriptor>,
	FGPoleDescriptor: NativeClass__type__wrapper<FGPoleDescriptor>,
	FGRecipe: NativeClass__type__wrapper<FGRecipe>,
	FGResourceDescriptor: NativeClass__type__wrapper<FGResourceDescriptor>,
	FGVehicleDescriptor: NativeClass__type__wrapper<FGVehicleDescriptor>,
	FGBuildableGeneratorNuclear: NativeClass__type__wrapper<
		FGBuildableGeneratorNuclear
	>,
	FGBuildableFrackingActivator: NativeClass__type__wrapper<
		FGBuildableFrackingActivator
	>,
	FGBuildableWaterPump: NativeClass__type__wrapper<FGBuildableWaterPump>,
	FGBuildableResourceExtractor: NativeClass__type__wrapper<
		FGBuildableResourceExtractor
	>,
	FGPowerShardDescriptor?: (
		FGPowerShardDescriptor extends undefined
			? undefined
			: NativeClass__type__wrapper<
				Exclude<FGPowerShardDescriptor, undefined>
			>
	),
	FGItemDescriptorPowerBoosterFuel?: (
		FGItemDescriptorPowerBoosterFuel extends undefined
			? undefined
			: NativeClass__type__wrapper<
				Exclude<FGItemDescriptorPowerBoosterFuel, undefined>
			>
	),
}

export type recipe_selection_properties = {
	[key: UnrealEngineString_right_x_C_suffix]: {
		type: 'string',
		enum: [string, ...string[]],
	}
};

export type recipe_selection_properties_with_default = (
	& recipe_selection_properties[UnrealEngineString_right_x_C_suffix]
	& {
		default:string,
	}
);

export type recipe_selection_properties_with_defaults = {
	[
		key: UnrealEngineString_right_x_C_suffix
	]: recipe_selection_properties_with_default
};

export type data<
	T_PowerShard extends undefined|FGPowerShardDescriptor__type = undefined,
	T_PowerBoosterFuel extends (
		| undefined
		| FGItemDescriptorPowerBoosterFuel__type
	) = undefined,
	T_ammo extends (
		| common_base__FGAmmoTypeProjectile__type
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
		| common_base__FGAmmoTypeSpreadshot__type
	) = (
		| common_base__FGAmmoTypeProjectile__type
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
		| common_base__FGAmmoTypeSpreadshot__type
	),
	// eslint-disable-next-line max-len
	T_biomass extends common_base__FGItemDescriptorBiomass__type = common_base__FGItemDescriptorBiomass__type,
	// eslint-disable-next-line max-len
	T_buildings extends common_base__FGBuildingDescriptor__type = common_base__FGBuildingDescriptor__type,
	// eslint-disable-next-line max-len
	T_consumable extends common_base__FGConsumableDescriptor__type = common_base__FGConsumableDescriptor__type,
	// eslint-disable-next-line max-len
	T_equipment extends common_base__FGEquipmentDescriptor__type = common_base__FGEquipmentDescriptor__type,
	// eslint-disable-next-line max-len
	T_fuel_nuclear extends common_base__FGItemDescriptorNuclearFuel__type = common_base__FGItemDescriptorNuclearFuel__type,
	// eslint-disable-next-line max-len
	T_items extends common_base__FGItemDescriptor__FGResourceDescriptor__type = common_base__FGItemDescriptor__FGResourceDescriptor__type,
	// eslint-disable-next-line max-len
	T_poles extends common_base__FGPoleDescriptor__type = common_base__FGPoleDescriptor__type,
	// eslint-disable-next-line max-len
	T_recipes extends common_base__FGRecipe__type = common_base__FGRecipe__type,
	// eslint-disable-next-line max-len
	T_resources extends common_base__FGResourceDescriptor__type = common_base__FGResourceDescriptor__type,
	T_vehicles extends FGVehicleDescriptor__type = FGVehicleDescriptor__type,
	// eslint-disable-next-line max-len
	T_NuclearByproduct extends common_base__FGBuildableGeneratorNuclear__mFuel__base__type = common_base__FGBuildableGeneratorNuclear__mFuel__base__type,
> = {
	ammo: {[k: string]: T_ammo},
	biomass: {[key: string]: T_biomass},
	buildings: {[key: string]: T_buildings},
	consumable: {[key: string]: T_consumable},
	equipment: {[key: string]: T_equipment},
	fuel_nuclear: {[key: string]: T_fuel_nuclear},
	items: {[key: string]: T_items},
	poles: {[key: string]: T_poles},
	recipes: {[key: string]: T_recipes},
	resources: {[key: string]: T_resources},
	vehicles: {[key: string]: T_vehicles},
	power_shards?: (
		T_PowerShard extends undefined
			? undefined
			: {[key: string]: T_PowerShard}
	),
	power_booster_fuel?: (
		T_PowerBoosterFuel extends undefined
			? undefined
			: {[key: string]: T_PowerBoosterFuel}
	),
	ingredients: Set<(
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	)>,
	products: Set<(
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	)>,
	resource_keys: string[],
	known_byproduct: (
		(T_NuclearByproduct['mByproduct'])[]
	),
	known_not_sourced_from_recipe: (
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	)[],
	recipe_selection_enums: recipe_selection_properties_with_defaults,
	faux_ingredients_list: string[],
};
