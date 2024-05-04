import {
	FGItemDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptor';
import {
	FGItemDescriptor__FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe,
} from '../generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGRecipe__type,
} from '../generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	UnrealEngineString_right_x_C_suffix,
} from './planner-request';
import {
	FGBuildingDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGBuildingDescriptor';
import {
	FGBuildingDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	FGResourceDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGResourceDescriptor';
import {
	FGItemDescriptorBiomass__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	FGItemDescriptorBiomass,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptorBiomass';
import {
	FGPoleDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGPoleDescriptor';
import {
	FGPoleDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGPoleDescriptor';
import {
	FGEquipmentDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor';
import {
	FGEquipmentDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGEquipmentDescriptor';
import {
	FGAmmoTypeProjectile,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeProjectile';
import {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
} from '../generated-types/update8/classes/CoreUObject/FGVehicleDescriptor';
import {
	FGVehicleDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGVehicleDescriptor';
import {
	FGItemDescriptorNuclearFuel__type,
} from '../generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGItemDescriptorNuclearFuel,
} from '../generated-types/update8/data/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGConsumableDescriptor__type,
} from '../generated-types/update8/classes/CoreUObject/FGConsumableDescriptor';
import {
	FGConsumableDescriptor,
} from '../generated-types/update8/data/CoreUObject/FGConsumableDescriptor';
import {
	FGAmmoTypeInstantHit,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot,
} from '../generated-types/update8/data/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGBuildableGeneratorNuclear,
} from '../generated-types/update8/data/CoreUObject/FGBuildableGeneratorNuclear';

export const ammo = Object.fromEntries(
	[
		...FGAmmoTypeProjectile.Classes,
		...FGAmmoTypeInstantHit.Classes,
		...FGAmmoTypeSpreadshot.Classes,
	].map(e => [e.ClassName, e])
);

export const biomass:{
	[
		key in FGItemDescriptorBiomass__type[
			'ClassName'
		]
	]: FGItemDescriptorBiomass__type
} = Object.fromEntries(
	FGItemDescriptorBiomass.Classes.map(e => [e.ClassName, e])
);

export const buildings:{
	[
		key in FGBuildingDescriptor__type[
			'ClassName'
		]
	]: FGBuildingDescriptor__type
} = Object.fromEntries(
	FGBuildingDescriptor.Classes.map(e => [e.ClassName, e])
);

export const consumable:{
	[
		key in FGConsumableDescriptor__type[
			'ClassName'
		]
	]: FGConsumableDescriptor__type
} = Object.fromEntries(
	FGConsumableDescriptor.Classes.map(e => [e.ClassName, e])
);

export const equipment:{
	[
		key in FGEquipmentDescriptor__type[
			'ClassName'
		]
	]: FGEquipmentDescriptor__type
} = Object.fromEntries(
	FGEquipmentDescriptor.Classes.map(e => [e.ClassName, e])
);

export const fuel_nuclear:{
	[
		key in FGItemDescriptorNuclearFuel__type[
			'ClassName'
		]
	]: FGItemDescriptorNuclearFuel__type
} = Object.fromEntries(
	FGItemDescriptorNuclearFuel.Classes.map(e => [e.ClassName, e])
);

export const items:{
	[
		key in FGItemDescriptor__FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGItemDescriptor__FGResourceDescriptor__type;
} = Object.fromEntries(
	FGItemDescriptor.Classes.map(e => [e.ClassName, e])
);

export const poles:{
	[
		key in FGPoleDescriptor__type[
			'ClassName'
		]
	]: FGPoleDescriptor__type
} = Object.fromEntries(
	FGPoleDescriptor.Classes.map(e => [e.ClassName, e])
);

export const recipes:{
	[
		key in FGRecipe__type[
			'ClassName'
		]
	]: FGRecipe__type
} = Object.fromEntries(
	FGRecipe.Classes.map(e => [e.ClassName, e])
);

export const resources:{
	[
		key in FGResourceDescriptor__type[
			'ClassName'
		]
	]: FGResourceDescriptor__type
} = Object.fromEntries(
	FGResourceDescriptor.Classes.map(e => [e.ClassName, e])
);

type FGVehicleDescriptor__type = (
	| FGVehicleDescriptor__powered_no_inventory__type
	| FGVehicleDescriptor__unfueled_with_inventory__type
	| FGVehicleDescriptor__fueled_with_inventory__type
);

export const vehicles:{
	[
		key in FGVehicleDescriptor__type[
			'ClassName'
		]
	]: FGVehicleDescriptor__type
} = Object.fromEntries(
	FGVehicleDescriptor.Classes.map(e => [e.ClassName, e])
);

export const ingredients = (new Set(FGRecipe.Classes.flatMap(
	e => e.mIngredients.map(
		e => UnrealEngineString_right_x_C_suffix(e.ItemClass)
	)
)));

export const products = (new Set(FGRecipe.Classes.flatMap(
	e => e.mProduct.map(
		e => UnrealEngineString_right_x_C_suffix(e.ItemClass)
	)
)));

export const resource_keys = Object.keys(resources);

export const known_byproduct:string[] = FGBuildableGeneratorNuclear.Classes.flatMap(
	(e) => e.mFuel.map(
		fuel => fuel.mByproduct
	)
);

export const known_not_sourced_from_recipe:string[] = [
	...ingredients.values(),
].filter(
	maybe => (
		!products.has(maybe)
		&& !resource_keys.includes(maybe)
		&& !known_byproduct.includes(maybe)
	)
);
