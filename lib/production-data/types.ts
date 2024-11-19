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

export type FGVehicleDescriptor__type = (
	| common_base__FGVehicleDescriptor__powered_no_inventory__type
	| common_base__FGVehicleDescriptor__with_inventory__type
	| common_base__FGVehicleDescriptor__fueled_with_inventory__type
);

export type imports_dict = {
	[key: string]: NativeClass__type,
};

type NativeClass__type__wrapper<
	T extends class__no_description_or_display_name__type
> = NativeClass__type & {
	Classes: [T, ...T[]],
};

export type imports = imports_dict & {
	FGAmmoTypeProjectile: NativeClass__type__wrapper<
		common_base__FGAmmoTypeProjectile__type
	>,
	FGAmmoTypeInstantHit: NativeClass__type__wrapper<(
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
	)>,
	FGAmmoTypeSpreadshot: NativeClass__type__wrapper<
		common_base__FGAmmoTypeSpreadshot__type
	>,
	FGItemDescriptorBiomass: NativeClass__type__wrapper<
		common_base__FGItemDescriptorBiomass__type
	>,
	FGBuildingDescriptor: NativeClass__type__wrapper<
		common_base__FGBuildingDescriptor__type
	>,
	FGConsumableDescriptor: NativeClass__type__wrapper<
		common_base__FGConsumableDescriptor__type
	>,
	FGEquipmentDescriptor: NativeClass__type__wrapper<
		common_base__FGEquipmentDescriptor__type
	>,
	FGItemDescriptorNuclearFuel: NativeClass__type__wrapper<
		common_base__FGItemDescriptorNuclearFuel__type
	>,
	FGItemDescriptor: NativeClass__type__wrapper<
		common_base__FGItemDescriptor__FGResourceDescriptor__type
	>,
	FGPoleDescriptor: NativeClass__type__wrapper<
		common_base__FGPoleDescriptor__type
	>,
	FGRecipe: NativeClass__type__wrapper<common_base__FGRecipe__type>,
	FGResourceDescriptor: NativeClass__type__wrapper<
		common_base__FGResourceDescriptor__type
	>,
	FGVehicleDescriptor: NativeClass__type__wrapper<(
		| common_base__FGVehicleDescriptor__fueled_with_inventory__type
		| common_base__FGVehicleDescriptor__powered_no_inventory__type
		| common_base__FGVehicleDescriptor__with_inventory__type
	)>,
	FGBuildableGeneratorNuclear: NativeClass__type__wrapper<
		common_base__FGBuildableGeneratorNuclear__type
	>,
	FGBuildableFrackingActivator: NativeClass__type__wrapper<
		common_base__FGBuildableFrackingActivator__type
	>,
	FGBuildableWaterPump: NativeClass__type__wrapper<
		common_base__FGBuildableWaterPump__type
	>,
	FGBuildableResourceExtractor: NativeClass__type__wrapper<(
		| common_base__FGBuildableResourceExtractor__oil_extractor__type
		| common_base__FGBuildableResourceExtractor__miner_mk3__type
		| common_base__FGBuildableResourceExtractor__miner__type
	)>,
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
	T_NuclearByproduct extends string,
> = {
	ammo: {
		[k: string]: (
			| common_base__FGAmmoTypeProjectile__type
			| common_base__FGAmmoTypeInstantHit__chaos__type
			| common_base__FGAmmoTypeInstantHit__standard__type
			| common_base__FGAmmoTypeSpreadshot__type
		),
	},
	biomass: {[key: string]: common_base__FGItemDescriptorBiomass__type},
	buildings: {[key: string]: common_base__FGBuildingDescriptor__type},
	consumable: {[key: string]: common_base__FGConsumableDescriptor__type},
	equipment: {[key: string]: common_base__FGEquipmentDescriptor__type},
	fuel_nuclear: {
		[key: string]: common_base__FGItemDescriptorNuclearFuel__type
	},
	items: {
		[
			key: string
		]: common_base__FGItemDescriptor__FGResourceDescriptor__type
	},
	poles: {[key: string]: common_base__FGPoleDescriptor__type},
	recipes: {[key: string]: common_base__FGRecipe__type},
	resources: {[key: string]: common_base__FGResourceDescriptor__type},
	vehicles: {[key: string]: FGVehicleDescriptor__type},
	ingredients: Set<
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	>,
	products: Set<
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	>,
	resource_keys: string[],
	known_byproduct: (
		T_NuclearByproduct[]
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
