import {
	update8,
} from '../../generated-types/0.8.3.3/data.ts';

import type {
	update8_imports,
} from '../../lib/production-data/types.ts';

import {
	ProductionData,
} from '../../lib/production-data.ts';

import type {
	FGAmmoTypeInstantHit_Desc_CartridgeChaos_C,
	FGAmmoTypeInstantHit_Desc_CartridgeStandard_C,
	FGAmmoTypeProjectile,
	FGAmmoTypeSpreadshot,
	FGBuildableFrackingActivator,
	FGBuildableGeneratorNuclear,
	FGBuildableResourceExtractor_miner_mk1,
	FGBuildableResourceExtractor_miner_mk2,
	FGBuildableResourceExtractor_miner_mk3,
	FGBuildableResourceExtractor_oil,
	FGBuildableWaterPump,
	FGItemDescriptorNuclearFuel,
} from '@satisfactory-dev/docs.json.ts/generated-types/0.8.3.3/classes.ts';

import type {
	FGBuildingDescriptor,
	FGConsumableDescriptor,
	FGPoleDescriptor,
	FGRecipe,
	FGVehicleDescriptor_Desc_CyberWagon_C,
	FGVehicleDescriptor_Desc_DroneTransport_C,
	FGVehicleDescriptor_Desc_Explorer_C,
	FGVehicleDescriptor_Desc_FreightWagon_C,
	FGVehicleDescriptor_Desc_Locomotive_C,
	FGVehicleDescriptor_Desc_Tractor_C,
	FGVehicleDescriptor_Desc_Truck_C,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.6.1.5/classes/Base.0.8.3.3.js';

import type {
	FGBuildableManufacturer_Build_AssemblerMk1_C,
	FGBuildableManufacturer_Build_Blender_C,
	FGBuildableManufacturer_Build_ConstructorMk1_C,
	FGBuildableManufacturer_Build_FoundryMk1_C,
	FGBuildableManufacturer_Build_HadronCollider_C,
	FGBuildableManufacturer_Build_ManufacturerMk1_C,
	FGBuildableManufacturer_Build_OilRefinery_C,
	FGBuildableManufacturer_Build_Packager_C,
	FGBuildableManufacturer_Build_SmelterMk1_C,
	FGEquipmentDescriptor,
	FGItemDescriptor,
	FGItemDescriptorBiomass,
	FGResourceDescriptor,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.6.1.5/classes.js';

import {
	find,
} from '../../lib/version-specific/0.8.3.3/find.ts';

const FGAmmoTypeProjectile: update8_imports['FGAmmoTypeProjectile'] = find<
	FGAmmoTypeProjectile,
	'FGAmmoTypeProjectile'
>('FGAmmoTypeProjectile', update8);

const FGAmmoTypeInstantHit: update8_imports['FGAmmoTypeInstantHit'] = find<
	(
		| FGAmmoTypeInstantHit_Desc_CartridgeChaos_C
		| FGAmmoTypeInstantHit_Desc_CartridgeStandard_C
	),
	'FGAmmoTypeInstantHit'
>('FGAmmoTypeInstantHit', update8);

const FGAmmoTypeSpreadshot: update8_imports['FGAmmoTypeSpreadshot'] = find<
	FGAmmoTypeSpreadshot,
	'FGAmmoTypeSpreadshot'
>('FGAmmoTypeSpreadshot', update8);

const FGItemDescriptorBiomass: update8_imports[
	'FGItemDescriptorBiomass'
] = find<
	FGItemDescriptorBiomass,
	'FGItemDescriptorBiomass'
>('FGItemDescriptorBiomass', update8);

const FGBuildableManufacturer: update8_imports[
	'FGBuildableManufacturer'
] = find<
	(
		| FGBuildableManufacturer_Build_AssemblerMk1_C
		| FGBuildableManufacturer_Build_Blender_C
		| FGBuildableManufacturer_Build_ConstructorMk1_C
		| FGBuildableManufacturer_Build_FoundryMk1_C
		| FGBuildableManufacturer_Build_HadronCollider_C
		| FGBuildableManufacturer_Build_ManufacturerMk1_C
		| FGBuildableManufacturer_Build_OilRefinery_C
		| FGBuildableManufacturer_Build_Packager_C
		| FGBuildableManufacturer_Build_SmelterMk1_C
	),
	'FGBuildableManufacturer'
>('FGBuildableManufacturer', update8);

const FGBuildingDescriptor: update8_imports['FGBuildingDescriptor'] = find<
	FGBuildingDescriptor,
	'FGBuildingDescriptor'
>('FGBuildingDescriptor', update8);

const FGConsumableDescriptor: update8_imports['FGConsumableDescriptor'] = find<
	FGConsumableDescriptor,
	'FGConsumableDescriptor'
>('FGConsumableDescriptor', update8);

const FGEquipmentDescriptor: update8_imports['FGEquipmentDescriptor'] = find<
	FGEquipmentDescriptor,
	'FGEquipmentDescriptor'
>('FGEquipmentDescriptor', update8);

const FGItemDescriptorNuclearFuel: update8_imports[
	'FGItemDescriptorNuclearFuel'
] = find<
	FGItemDescriptorNuclearFuel,
	'FGItemDescriptorNuclearFuel'
>('FGItemDescriptorNuclearFuel', update8);

const FGItemDescriptor: update8_imports['FGItemDescriptor'] = find<
	FGItemDescriptor,
	'FGItemDescriptor'
>('FGItemDescriptor', update8);

const FGPoleDescriptor: update8_imports['FGPoleDescriptor'] = find<
	FGPoleDescriptor,
	'FGPoleDescriptor'
>('FGPoleDescriptor', update8);

const FGRecipe: update8_imports['FGRecipe'] = find<
	FGRecipe,
	'FGRecipe'
>('FGRecipe', update8);

const FGResourceDescriptor: update8_imports['FGResourceDescriptor'] = find<
	FGResourceDescriptor,
	'FGResourceDescriptor'
>('FGResourceDescriptor', update8);

const FGVehicleDescriptor: update8_imports['FGVehicleDescriptor'] = find<
	(
		| FGVehicleDescriptor_Desc_CyberWagon_C
		| FGVehicleDescriptor_Desc_DroneTransport_C
		| FGVehicleDescriptor_Desc_Explorer_C
		| FGVehicleDescriptor_Desc_FreightWagon_C
		| FGVehicleDescriptor_Desc_Locomotive_C
		| FGVehicleDescriptor_Desc_Tractor_C
		| FGVehicleDescriptor_Desc_Truck_C
	),
	'FGVehicleDescriptor'
>('FGVehicleDescriptor', update8);

const FGBuildableGeneratorNuclear: update8_imports[
	'FGBuildableGeneratorNuclear'
] = find<
	FGBuildableGeneratorNuclear,
	'FGBuildableGeneratorNuclear'
>('FGBuildableGeneratorNuclear', update8);

const FGBuildableFrackingActivator: update8_imports[
	'FGBuildableFrackingActivator'
] = find<
	FGBuildableFrackingActivator,
	'FGBuildableFrackingActivator'
>('FGBuildableFrackingActivator', update8);

const FGBuildableWaterPump: update8_imports['FGBuildableWaterPump'] = find<
	FGBuildableWaterPump,
	'FGBuildableWaterPump'
>('FGBuildableWaterPump', update8);

const FGBuildableResourceExtractor: update8_imports[
	'FGBuildableResourceExtractor'
] = find<
	(
		| FGBuildableResourceExtractor_miner_mk1
		| FGBuildableResourceExtractor_miner_mk2
		| FGBuildableResourceExtractor_miner_mk3
		| FGBuildableResourceExtractor_oil
	),
	'FGBuildableResourceExtractor'
>('FGBuildableResourceExtractor', update8);

export const instance = new ProductionData<
	update8_imports
>(() => ({
	FGAmmoTypeProjectile,
	FGAmmoTypeInstantHit,
	FGAmmoTypeSpreadshot,
	FGItemDescriptorBiomass,
	FGBuildableManufacturer,
	FGBuildableManufacturerVariablePower: undefined,
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
	FGPowerShardDescriptor: undefined,
	FGItemDescriptorPowerBoosterFuel: undefined,
}));
