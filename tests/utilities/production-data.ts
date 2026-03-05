import {
	FGAmmoTypeProjectile,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeProjectile.ts';
import {
	FGAmmoTypeInstantHit,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeInstantHit.ts';
import {
	FGAmmoTypeSpreadshot,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGAmmoTypeSpreadshot.ts';
import {
	FGItemDescriptorBiomass,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptorBiomass.ts';
import {
	FGBuildingDescriptor,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildingDescriptor.ts';
import {
	FGConsumableDescriptor,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGConsumableDescriptor.ts';
import {
	FGEquipmentDescriptor,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGEquipmentDescriptor.ts';
import {
	FGItemDescriptorNuclearFuel,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptorNuclearFuel.ts';
import {
	FGItemDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGItemDescriptor.ts';
import {
	FGPoleDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGPoleDescriptor.ts';
import {
	FGRecipe,
} from '../../generated-types/update8/data/CoreUObject/FGRecipe.ts';
import {
	FGResourceDescriptor,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGResourceDescriptor.ts';
import {
	FGVehicleDescriptor,
} from '../../generated-types/update8/data/CoreUObject/FGVehicleDescriptor.ts';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableGeneratorNuclear.ts';

import {
	ProductionData,
} from '../../lib/production-data.ts';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableFrackingActivator.ts';
import {
	FGBuildableWaterPump,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableWaterPump.ts';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line @stylistic/max-len
} from '../../generated-types/update8/data/CoreUObject/FGBuildableResourceExtractor.ts';

export const instance = new ProductionData<
	undefined
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
}));
