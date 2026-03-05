import type {
	FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor.js';
import type {
	FGRecipe__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGRecipe.js';
import type {
	FGBuildingDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildingDescriptor.js';
import type {
	FGResourceDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGResourceDescriptor.js';
import type {
	FGItemDescriptorBiomass__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass.js';
import type {
	FGPoleDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGPoleDescriptor.js';
import type {
	FGEquipmentDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor.js';
import type {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGVehicleDescriptor.js';
import type {
	FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel.js';
import type {
	FGConsumableDescriptor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGConsumableDescriptor.js';
import type {
	FGAmmoTypeProjectile__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeProjectile.js';
import type {
	FGAmmoTypeInstantHit__chaos__type,
	FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeInstantHit.js';
import type {
	FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeSpreadshot.js';
import type {
	FGBuildableGeneratorNuclear__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableGeneratorNuclear.js';
import type {
	FGBuildableFrackingActivator__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableFrackingActivator.js';
import type {
	FGBuildableWaterPump__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableWaterPump.js';
import type {
	FGBuildableResourceExtractor__miner__type,
	FGBuildableResourceExtractor__oil_extractor__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableResourceExtractor.js';

import type {
	data as common_data,
	FGVehicleDescriptor__type as common_FGVehicleDescriptor__type,
	imports as common_imports,
} from '../types.ts';
import type {
	FGBuildableResourceExtractor__miner_mk3__type,
// eslint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/common/unassigned.js';
import type {
	common_base__FGBuildableGeneratorNuclear__mFuel__NuclearFuelRod__type,
	common_base__FGBuildableGeneratorNuclear__mFuel__PlutoniumFuelRod__type,
// eslint-disable-next-line @stylistic/max-len
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
>;

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
		// eslint-disable-next-line @stylistic/max-len
		| common_base__FGBuildableGeneratorNuclear__mFuel__PlutoniumFuelRod__type
	)
>;
