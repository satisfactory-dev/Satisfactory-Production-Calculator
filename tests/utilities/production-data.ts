import {
	FGAmmoTypeProjectile,
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit,
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot,
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGItemDescriptorBiomass,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptorBiomass';
import {
	FGBuildingDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGBuildingDescriptor';
import {
	FGConsumableDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGConsumableDescriptor';
import {
	FGEquipmentDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGEquipmentDescriptor';
import {
	FGItemDescriptorNuclearFuel,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGItemDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptor';
import {
	FGPoleDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGPoleDescriptor';
import {
	FGRecipe,
} from '../../generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGResourceDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	FGVehicleDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGVehicleDescriptor';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableGeneratorNuclear';

import {
	ProductionData,
} from '../../lib/production-data';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump,
} from '../../generated-types/update8/data/CoreUObject/FGBuildableWaterPump';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableResourceExtractor';

export const instance = new ProductionData(() => ({
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
}));
