import {
	FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor.js';
import {
	FGRecipe__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGRecipe.js';
import {
	FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildingDescriptor.js';
import {
	FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGResourceDescriptor.js';
import {
	FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass.js';
import {
	FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGPoleDescriptor.js';
import {
	FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor.js';
import {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGVehicleDescriptor.js';
import {
	FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel.js';
import {
	FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGConsumableDescriptor.js';
import {
	FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeProjectile.js';
import {
	FGAmmoTypeInstantHit__chaos__type,
	FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeInstantHit.js';
import {
	FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeSpreadshot.js';
import {
	FGBuildableGeneratorNuclear__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableGeneratorNuclear.js';
import {
	FGBuildableFrackingActivator__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableFrackingActivator.js';
import {
	FGBuildableWaterPump__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableWaterPump.js';
import {
	FGBuildableResourceExtractor__miner__type,
	FGBuildableResourceExtractor__oil_extractor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableResourceExtractor.js';

import {
	data as common_data,
	FGVehicleDescriptor__type as common_FGVehicleDescriptor__type,
	imports as common_imports,
} from '../types.ts';
import {
	FGBuildableResourceExtractor__miner_mk3__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/common/unassigned.js';
import {
	common_base__FGBuildableGeneratorNuclear__mFuel__NuclearFuelRod__type,
	common_base__FGBuildableGeneratorNuclear__mFuel__PlutoniumFuelRod__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildableGeneratorNuclear.js';

export type FGVehicleDescriptor__type = common_FGVehicleDescriptor__type & (
	| FGVehicleDescriptor__powered_no_inventory__type
	| FGVehicleDescriptor__unfueled_with_inventory__type
	| FGVehicleDescriptor__fueled_with_inventory__type
);

export type imports = common_imports<
	undefined,
	undefined,
	FGAmmoTypeProjectile__type,
	(
		| FGAmmoTypeInstantHit__chaos__type
		| FGAmmoTypeInstantHit__standard__type
	),
	FGAmmoTypeSpreadshot__type,
	FGItemDescriptorBiomass__type,
	FGBuildingDescriptor__type,
	FGConsumableDescriptor__type,
	FGItemDescriptor__FGResourceDescriptor__type,
	FGItemDescriptorNuclearFuel__type,
	FGItemDescriptor__FGResourceDescriptor__type,
	FGPoleDescriptor__type,
	FGRecipe__type,
	FGResourceDescriptor__type,
	(
		| FGVehicleDescriptor__powered_no_inventory__type
		| FGVehicleDescriptor__unfueled_with_inventory__type
		| FGVehicleDescriptor__fueled_with_inventory__type
	),
	FGBuildableGeneratorNuclear__type,
	FGBuildableFrackingActivator__type,
	FGBuildableWaterPump__type,
	(
		| FGBuildableResourceExtractor__oil_extractor__type
		| FGBuildableResourceExtractor__miner_mk3__type
		| FGBuildableResourceExtractor__miner__type
	)
>

export type data = common_data<
	undefined,
	undefined,
	(
		| FGAmmoTypeProjectile__type
		| FGAmmoTypeInstantHit__chaos__type
		| FGAmmoTypeInstantHit__standard__type
		| FGAmmoTypeSpreadshot__type
	),
	FGItemDescriptorBiomass__type,
	FGBuildingDescriptor__type,
	FGConsumableDescriptor__type,
	FGEquipmentDescriptor__type,
	FGItemDescriptorNuclearFuel__type,
	FGItemDescriptor__FGResourceDescriptor__type,
	FGPoleDescriptor__type,
	FGRecipe__type,
	FGResourceDescriptor__type,
	FGVehicleDescriptor__type,
	(
		| common_base__FGBuildableGeneratorNuclear__mFuel__NuclearFuelRod__type
		// eslint-disable-next-line max-len
		| common_base__FGBuildableGeneratorNuclear__mFuel__PlutoniumFuelRod__type
	)
>;
