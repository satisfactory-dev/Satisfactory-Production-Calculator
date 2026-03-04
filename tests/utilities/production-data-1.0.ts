import {
	FGAmmoTypeProjectile,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeProjectile.ts';
import {
	FGAmmoTypeInstantHit,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeInstantHit.ts';
import {
	FGAmmoTypeSpreadshot,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeSpreadshot.ts';
import {
	FGItemDescriptorBiomass,
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptorBiomass.ts';
import {
	FGBuildingDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGBuildingDescriptor.ts';
import {
	FGConsumableDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGConsumableDescriptor.ts';
import {
	FGEquipmentDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGEquipmentDescriptor.ts';
import {
	FGItemDescriptorNuclearFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptorNuclearFuel.ts';
import {
	FGItemDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptor.ts';
import {
	FGPoleDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGPoleDescriptor.ts';
import {
	FGRecipe,
} from '../../generated-types/1.0/data/CoreUObject/FGRecipe.ts';
import {
	FGResourceDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGResourceDescriptor.ts';
import {
	FGVehicleDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGVehicleDescriptor.ts';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableGeneratorNuclear.ts';

import {
	ProductionData,
} from '../../lib/production-data.ts';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableFrackingActivator.ts';
import {
	FGBuildableWaterPump,
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableWaterPump.ts';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableResourceExtractor.ts';
import {
	FGPowerShardDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGPowerShardDescriptor.ts';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor.js';
import {
	FGItemDescriptorPowerBoosterFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptorPowerBoosterFuel.ts';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel.js';

export const instance = new ProductionData<
	FGPowerShardDescriptor__type,
	FGItemDescriptorPowerBoosterFuel__type
>(() => ({
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
	FGBuildableFrackingActivator,
	FGBuildableWaterPump,
	FGBuildableResourceExtractor,
	FGPowerShardDescriptor,
	FGItemDescriptorPowerBoosterFuel,
}));
