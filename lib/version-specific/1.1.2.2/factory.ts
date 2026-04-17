import type {
	release_1_1_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1.2.2/types.ts';

import type {
	FGConsumableDescriptor,
	FGEquipmentDescriptor,
	FGItemDescriptor,
	FGItemDescriptorBiomass,
	FGItemDescriptorNuclearFuel,
	FGItemDescriptorPowerBoosterFuel,
	FGPowerShardDescriptor,
	FGRecipe,
	FGResourceDescriptor,
	FGVehicleDescriptor_Desc_CyberWagon_C,
	FGVehicleDescriptor_Desc_DroneTransport_C,
	FGVehicleDescriptor_Desc_Explorer_C,
	FGVehicleDescriptor_Desc_FreightWagon_C,
	FGVehicleDescriptor_Desc_Locomotive_C,
	FGVehicleDescriptor_Desc_Tractor_C,
	FGVehicleDescriptor_Desc_Truck_C,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0.1.4/classes.ts';

import type {
	FGAmmoTypeInstantHit_Desc_CartridgeChaos_C,
	FGAmmoTypeInstantHit_Desc_CartridgeStandard_C,
	FGAmmoTypeProjectile,
	FGAmmoTypeSpreadshot,
	FGBuildable_occupied,
	FGBuildable_tiered,
	FGBuildable_unoccupied_and_untiered,
	FGBuildableFrackingActivator,
	FGBuildableGeneratorNuclear,
	FGBuildableManufacturer_Build_AssemblerMk1_C,
	FGBuildableManufacturer_Build_Blender_C,
	FGBuildableManufacturer_Build_ConstructorMk1_C,
	FGBuildableManufacturer_Build_Converter_C,
	FGBuildableManufacturer_Build_FoundryMk1_C,
	FGBuildableManufacturer_Build_HadronCollider_C,
	FGBuildableManufacturer_Build_ManufacturerMk1_C,
	FGBuildableManufacturer_Build_OilRefinery_C,
	FGBuildableManufacturer_Build_Packager_C,
	FGBuildableManufacturer_Build_QuantumEncoder_C,
	FGBuildableManufacturer_Build_SmelterMk1_C,
	FGBuildableResourceExtractor_miner_mk1,
	FGBuildableResourceExtractor_miner_mk2,
	FGBuildableResourceExtractor_miner_mk3,
	FGBuildableResourceExtractor_oil,
	FGBuildableWaterPump,
	FGBuildingDescriptor,
	FGSchematic_with_described_unlocks,
	FGSchematic_without_described_unlocks,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1.2.2/classes.ts';

import type {
	version_1p1_imports,
} from '../../production-data/types.ts';

import {
	ProductionData,
} from '../../production-data.ts';

import {
	find,
} from './find.ts';

export default (
	release_1_1: release_1_1_docs,
): ProductionData<version_1p1_imports> => {
	const FGAmmoTypeProjectile: version_1p1_imports[
		'FGAmmoTypeProjectile'
	] = find<
		FGAmmoTypeProjectile,
		'FGAmmoTypeProjectile'
	>('FGAmmoTypeProjectile', release_1_1);

	const FGAmmoTypeInstantHit: version_1p1_imports[
		'FGAmmoTypeInstantHit'
	] = find<
		(
			| FGAmmoTypeInstantHit_Desc_CartridgeChaos_C
			| FGAmmoTypeInstantHit_Desc_CartridgeStandard_C
		),
		'FGAmmoTypeInstantHit'
	>('FGAmmoTypeInstantHit', release_1_1);

	const FGAmmoTypeSpreadshot: version_1p1_imports[
		'FGAmmoTypeSpreadshot'
	] = find<
		FGAmmoTypeSpreadshot,
		'FGAmmoTypeSpreadshot'
	>('FGAmmoTypeSpreadshot', release_1_1);

	const FGItemDescriptorBiomass: version_1p1_imports[
		'FGItemDescriptorBiomass'
	] = find<
		FGItemDescriptorBiomass,
		'FGItemDescriptorBiomass'
	>('FGItemDescriptorBiomass', release_1_1);

	const FGBuildableManufacturer: version_1p1_imports[
		'FGBuildableManufacturer'
	] = find<
		(
			| FGBuildableManufacturer_Build_AssemblerMk1_C
			| FGBuildableManufacturer_Build_Blender_C
			| FGBuildableManufacturer_Build_ConstructorMk1_C
			| FGBuildableManufacturer_Build_FoundryMk1_C
			| FGBuildableManufacturer_Build_ManufacturerMk1_C
			| FGBuildableManufacturer_Build_OilRefinery_C
			| FGBuildableManufacturer_Build_Packager_C
			| FGBuildableManufacturer_Build_QuantumEncoder_C
			| FGBuildableManufacturer_Build_SmelterMk1_C
		),
		'FGBuildableManufacturer'
	>('FGBuildableManufacturer', release_1_1);

	const FGBuildableManufacturerVariablePower: version_1p1_imports[
		'FGBuildableManufacturerVariablePower'
	] = find<
		(
			| FGBuildableManufacturer_Build_Converter_C
			| FGBuildableManufacturer_Build_HadronCollider_C
			| FGBuildableManufacturer_Build_QuantumEncoder_C
		),
		'FGBuildableManufacturerVariablePower'
	>('FGBuildableManufacturerVariablePower', release_1_1);

	const FGBuildingDescriptor: version_1p1_imports[
		'FGBuildingDescriptor'
	] = find<
		FGBuildingDescriptor,
		'FGBuildingDescriptor'
	>('FGBuildingDescriptor', release_1_1);

	const FGConsumableDescriptor: version_1p1_imports[
		'FGConsumableDescriptor'
	] = find<
		FGConsumableDescriptor,
		'FGConsumableDescriptor'
	>('FGConsumableDescriptor', release_1_1);

	const FGEquipmentDescriptor: version_1p1_imports[
		'FGEquipmentDescriptor'
	] = find<
		FGEquipmentDescriptor,
		'FGEquipmentDescriptor'
	>('FGEquipmentDescriptor', release_1_1);

	const FGItemDescriptorNuclearFuel: version_1p1_imports[
		'FGItemDescriptorNuclearFuel'
	] = find<
		FGItemDescriptorNuclearFuel,
		'FGItemDescriptorNuclearFuel'
	>('FGItemDescriptorNuclearFuel', release_1_1);

	const FGItemDescriptor: version_1p1_imports['FGItemDescriptor'] = find<
		FGItemDescriptor,
		'FGItemDescriptor'
	>('FGItemDescriptor', release_1_1);

	const FGItemDescriptorPowerBoosterFuel: version_1p1_imports[
		'FGItemDescriptorPowerBoosterFuel'
	] = find<
		FGItemDescriptorPowerBoosterFuel,
		'FGItemDescriptorPowerBoosterFuel'
	>('FGItemDescriptorPowerBoosterFuel', release_1_1);

	const FGPowerShardDescriptor: version_1p1_imports[
		'FGPowerShardDescriptor'
	] = find<
		FGPowerShardDescriptor,
		'FGPowerShardDescriptor'
	>('FGPowerShardDescriptor', release_1_1);

	const FGRecipe: version_1p1_imports['FGRecipe'] = find<
		FGRecipe,
		'FGRecipe'
	>('FGRecipe', release_1_1);

	const FGResourceDescriptor: version_1p1_imports[
		'FGResourceDescriptor'
	] = find<
		FGResourceDescriptor,
		'FGResourceDescriptor'
	>('FGResourceDescriptor', release_1_1);

	const FGVehicleDescriptor: version_1p1_imports[
		'FGVehicleDescriptor'
	] = find<
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
	>('FGVehicleDescriptor', release_1_1);

	const FGBuildable: version_1p1_imports[
		'FGBuildable'
	] = find<
		(
			| FGBuildable_occupied
			| FGBuildable_tiered
			| FGBuildable_unoccupied_and_untiered
		),
		'FGBuildable'
	>('FGBuildable', release_1_1);

	const FGBuildableGeneratorNuclear: version_1p1_imports[
		'FGBuildableGeneratorNuclear'
	] = find<
		FGBuildableGeneratorNuclear,
		'FGBuildableGeneratorNuclear'
	>('FGBuildableGeneratorNuclear', release_1_1);

	const FGBuildableFrackingActivator: version_1p1_imports[
		'FGBuildableFrackingActivator'
	] = find<
		FGBuildableFrackingActivator,
		'FGBuildableFrackingActivator'
	>('FGBuildableFrackingActivator', release_1_1);

	const FGBuildableWaterPump: version_1p1_imports[
		'FGBuildableWaterPump'
	] = find<
		FGBuildableWaterPump,
		'FGBuildableWaterPump'
	>('FGBuildableWaterPump', release_1_1);

	const FGBuildableResourceExtractor: version_1p1_imports[
		'FGBuildableResourceExtractor'
	] = find<
		(
			| FGBuildableResourceExtractor_miner_mk1
			| FGBuildableResourceExtractor_miner_mk2
			| FGBuildableResourceExtractor_miner_mk3
			| FGBuildableResourceExtractor_oil
		),
		'FGBuildableResourceExtractor'
	>('FGBuildableResourceExtractor', release_1_1);

	const FGSchematic: version_1p1_imports['FGSchematic'] = find<
		(
			| FGSchematic_with_described_unlocks
			| FGSchematic_without_described_unlocks
		),
		'FGSchematic'
	>('FGSchematic', release_1_1);

	return new ProductionData<
		version_1p1_imports
	>(() => ({
		FGAmmoTypeProjectile,
		FGAmmoTypeInstantHit,
		FGAmmoTypeSpreadshot,
		FGItemDescriptorBiomass,
		FGBuildable,
		FGBuildableManufacturer,
		FGBuildableManufacturerVariablePower,
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
		FGSchematic,
	}));
};
