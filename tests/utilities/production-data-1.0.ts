import {
	FGAmmoTypeProjectile,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot,
} from '../../generated-types/1.0/data/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGItemDescriptorBiomass,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptorBiomass';
import {
	FGBuildingDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGBuildingDescriptor';
import {
	FGConsumableDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGConsumableDescriptor';
import {
	FGEquipmentDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGEquipmentDescriptor';
import {
	FGItemDescriptorNuclearFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGItemDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGItemDescriptor';
import {
	FGPoleDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGPoleDescriptor';
import {
	FGRecipe,
} from '../../generated-types/1.0/data/CoreUObject/FGRecipe';
import {
	FGResourceDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGResourceDescriptor';
import {
	FGVehicleDescriptor,
} from '../../generated-types/1.0/data/CoreUObject/FGVehicleDescriptor';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableGeneratorNuclear';

import {
	ProductionData,
} from '../../lib/production-data';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump,
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableWaterPump';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGBuildableResourceExtractor';
import {
	FGPowerShardDescriptor,
// eslint-disable-next-line max-len
} from '../../generated-types/1.0/data/CoreUObject/FGPowerShardDescriptor';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';

export const instance = new ProductionData<
	FGPowerShardDescriptor__type
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
}));
