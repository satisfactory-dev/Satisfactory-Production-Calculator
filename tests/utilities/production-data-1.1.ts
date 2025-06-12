import {
	FGAmmoTypeProjectile,
} from '../../generated-types/1.1/data/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit,
} from '../../generated-types/1.1/data/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot,
} from '../../generated-types/1.1/data/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGItemDescriptorBiomass,
} from '../../generated-types/1.1/data/CoreUObject/FGItemDescriptorBiomass';
import {
	FGBuildingDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGBuildingDescriptor';
import {
	FGConsumableDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGConsumableDescriptor';
import {
	FGEquipmentDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGEquipmentDescriptor';
import {
	FGItemDescriptorNuclearFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/1.1/data/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGItemDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGItemDescriptor';
import {
	FGRecipe,
} from '../../generated-types/1.1/data/CoreUObject/FGRecipe';
import {
	FGResourceDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGResourceDescriptor';
import {
	FGVehicleDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGVehicleDescriptor';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line max-len
} from '../../generated-types/1.1/data/CoreUObject/FGBuildableGeneratorNuclear';

import {
	ProductionData,
} from '../../lib/production-data';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from '../../generated-types/1.1/data/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump,
} from '../../generated-types/1.1/data/CoreUObject/FGBuildableWaterPump';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from '../../generated-types/1.1/data/CoreUObject/FGBuildableResourceExtractor';
import {
	FGPowerShardDescriptor,
} from '../../generated-types/1.1/data/CoreUObject/FGPowerShardDescriptor';
import {
	v1_0_base__FGItemDescriptorPowerBoosterFuel__type,
	v1_0_base__FGPowerShardDescriptor__type,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/common/unassigned';
import {
	FGItemDescriptorPowerBoosterFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/1.1/data/CoreUObject/FGItemDescriptorPowerBoosterFuel';
import {
	FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit__chaos__type,
	FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeSpreadshot';
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
	common_base__FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGEquipmentDescriptor';
import {
	common_base__FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptor';
import {
	common_base__FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGPoleDescriptor';

export const instance = new ProductionData<
	v1_0_base__FGPowerShardDescriptor__type,
	v1_0_base__FGItemDescriptorPowerBoosterFuel__type,
	FGAmmoTypeProjectile__type,
	(
		| FGAmmoTypeInstantHit__chaos__type
		| FGAmmoTypeInstantHit__standard__type
	),
	FGAmmoTypeSpreadshot__type,
	common_base__FGItemDescriptorBiomass__type,
	common_base__FGBuildingDescriptor__type,
	common_base__FGConsumableDescriptor__type,
	common_base__FGEquipmentDescriptor__type,
	common_base__FGItemDescriptorNuclearFuel__type,
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
	common_base__FGPoleDescriptor__type
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
			FGPoleDescriptor: undefined,
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
