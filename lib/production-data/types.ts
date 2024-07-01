import {
	FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe__NativeClass,
	FGRecipe__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	FGBuildingDescriptor__NativeClass,
	FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor__NativeClass,
	FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGResourceDescriptor';
import {
	FGItemDescriptorBiomass__NativeClass,
	FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	FGPoleDescriptor__NativeClass,
	FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGPoleDescriptor';
import {
	FGEquipmentDescriptor__NativeClass,
	FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor';
import {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__NativeClass,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGVehicleDescriptor';
import {
	FGItemDescriptorNuclearFuel__NativeClass,
	FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGConsumableDescriptor__NativeClass,
	FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGConsumableDescriptor';
import {
	FGItemDescriptor__NativeClass,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGAmmoTypeProjectile__NativeClass,
	FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit__chaos__type,
	FGAmmoTypeInstantHit__NativeClass,
	FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot__NativeClass,
	FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGBuildableGeneratorNuclear__NativeClass,
	FGBuildableGeneratorNuclear__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableGeneratorNuclear';
import {
	FGBuildableFrackingActivator__NativeClass,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump__NativeClass,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableWaterPump';
import {
	FGBuildableResourceExtractor__NativeClass,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableResourceExtractor';

import {
	UnrealEngineString_right_x_C_suffix,
} from '../UnrealEngineString';

export type FGVehicleDescriptor__type = (
	| FGVehicleDescriptor__powered_no_inventory__type
	| FGVehicleDescriptor__unfueled_with_inventory__type
	| FGVehicleDescriptor__fueled_with_inventory__type
);

export type imports = {
	FGAmmoTypeProjectile: FGAmmoTypeProjectile__NativeClass,
	FGAmmoTypeInstantHit: FGAmmoTypeInstantHit__NativeClass,
	FGAmmoTypeSpreadshot: FGAmmoTypeSpreadshot__NativeClass,
	FGItemDescriptorBiomass: FGItemDescriptorBiomass__NativeClass,
	FGBuildingDescriptor: FGBuildingDescriptor__NativeClass,
	FGConsumableDescriptor: FGConsumableDescriptor__NativeClass,
	FGEquipmentDescriptor: FGEquipmentDescriptor__NativeClass,
	FGItemDescriptorNuclearFuel: FGItemDescriptorNuclearFuel__NativeClass,
	FGItemDescriptor: FGItemDescriptor__NativeClass,
	FGPoleDescriptor: FGPoleDescriptor__NativeClass,
	FGRecipe: FGRecipe__NativeClass,
	FGResourceDescriptor: FGResourceDescriptor__NativeClass,
	FGVehicleDescriptor: FGVehicleDescriptor__NativeClass,
	FGBuildableGeneratorNuclear: FGBuildableGeneratorNuclear__NativeClass,
	FGBuildableFrackingActivator: FGBuildableFrackingActivator__NativeClass,
	FGBuildableWaterPump: FGBuildableWaterPump__NativeClass,
	FGBuildableResourceExtractor: FGBuildableResourceExtractor__NativeClass,
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

export type data = {
	ammo: {
		[k: string]: (
			| FGAmmoTypeProjectile__type
			| FGAmmoTypeInstantHit__chaos__type
			| FGAmmoTypeInstantHit__standard__type
			| FGAmmoTypeSpreadshot__type
		),
	},
	biomass: {[key: string]: FGItemDescriptorBiomass__type},
	buildings: {[key: string]: FGBuildingDescriptor__type},
	consumable: {[key: string]: FGConsumableDescriptor__type},
	equipment: {[key: string]: FGEquipmentDescriptor__type},
	fuel_nuclear: {[key: string]: FGItemDescriptorNuclearFuel__type},
	items: {[key: string]: FGItemDescriptor__FGResourceDescriptor__type},
	poles: {[key: string]: FGPoleDescriptor__type},
	recipes: {[key: string]: FGRecipe__type},
	resources: {[key: string]: FGResourceDescriptor__type},
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
		FGBuildableGeneratorNuclear__type['mFuel'][number]['mByproduct'][]
	),
	known_not_sourced_from_recipe: (
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	)[],
	recipe_selection_enums: recipe_selection_properties_with_defaults,
};
