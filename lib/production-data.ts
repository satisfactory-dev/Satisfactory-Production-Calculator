import {
	FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe__NativeClass,
	FGRecipe__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	FGBuildingDescriptor__NativeClass,
	FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor__NativeClass,
	FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGResourceDescriptor';
import {
	FGItemDescriptorBiomass__NativeClass,
	FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	FGPoleDescriptor__NativeClass,
	FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGPoleDescriptor';
import {
	FGEquipmentDescriptor__NativeClass,
	FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor';
import {
	FGVehicleDescriptor__fueled_with_inventory__type,
	FGVehicleDescriptor__NativeClass,
	FGVehicleDescriptor__powered_no_inventory__type,
	FGVehicleDescriptor__unfueled_with_inventory__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGVehicleDescriptor';
import {
	FGItemDescriptorNuclearFuel__NativeClass,
	FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGConsumableDescriptor__NativeClass,
	FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGConsumableDescriptor';
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';

import {
	FGItemDescriptor__NativeClass,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGAmmoTypeProjectile__NativeClass,
	FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	FGAmmoTypeInstantHit__chaos__type,
	FGAmmoTypeInstantHit__NativeClass,
	FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	FGAmmoTypeSpreadshot__NativeClass,
	FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGBuildableGeneratorNuclear__NativeClass,
	FGBuildableGeneratorNuclear__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildableGeneratorNuclear';

type FGVehicleDescriptor__type = (
	| FGVehicleDescriptor__powered_no_inventory__type
	| FGVehicleDescriptor__unfueled_with_inventory__type
	| FGVehicleDescriptor__fueled_with_inventory__type
);

export type imports = {
	FGAmmoTypeProjectile: FGAmmoTypeProjectile__NativeClass,
	FGAmmoTypeInstantHit: FGAmmoTypeInstantHit__NativeClass,
	FGAmmoTypeSpreadshot: FGAmmoTypeSpreadshot__NativeClass,
	FGItemDescriptorBiomass: FGItemDescriptorBiomass__NativeClass,
	FGBuildingDescriptor: FGBuildingDescriptor__NativeClass,
	FGConsumableDescriptor: FGConsumableDescriptor__NativeClass,
	FGEquipmentDescriptor: FGEquipmentDescriptor__NativeClass,
	FGItemDescriptorNuclearFuel: FGItemDescriptorNuclearFuel__NativeClass,
	FGItemDescriptor: FGItemDescriptor__NativeClass,
	FGPoleDescriptor: FGPoleDescriptor__NativeClass,
	FGRecipe: FGRecipe__NativeClass,
	FGResourceDescriptor: FGResourceDescriptor__NativeClass,
	FGVehicleDescriptor: FGVehicleDescriptor__NativeClass,
	FGBuildableGeneratorNuclear: FGBuildableGeneratorNuclear__NativeClass,
}

type data = {
	ammo: {
		[k: string]: (
			| FGAmmoTypeProjectile__type
			| FGAmmoTypeInstantHit__chaos__type
			| FGAmmoTypeInstantHit__standard__type
			| FGAmmoTypeSpreadshot__type
		),
	},
	biomass: {[key: string]: FGItemDescriptorBiomass__type},
	buildings: {[key: string]: FGBuildingDescriptor__type},
	consumable: {[key: string]: FGConsumableDescriptor__type},
	equipment: {[key: string]: FGEquipmentDescriptor__type},
	fuel_nuclear: {[key: string]: FGItemDescriptorNuclearFuel__type},
	items: {[key: string]: FGItemDescriptor__FGResourceDescriptor__type},
	poles: {[key: string]: FGPoleDescriptor__type},
	recipes: {[key: string]: FGRecipe__type},
	resources: {[key: string]: FGResourceDescriptor__type},
	vehicles: {[key: string]: FGVehicleDescriptor__type},
	ingredients: Set<
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	>,
	products: Set<
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	>,
	resource_keys: string[],
	known_byproduct: (
		FGBuildableGeneratorNuclear__type['mFuel'][number]['mByproduct'][]
	),
	known_not_sourced_from_recipe: (
		| `Desc_${string}_C`
		| `BP_${string}_C`
		| `Foundation_${string}_C`
		| `Recipe_${string}_C`
		| `SC_${string}_C`
	)[],
};

export class ProductionData
{
	#imports:imports;
	#data:data;

	constructor(imports:() => imports)
	{
		this.#imports = imports();
		this.#data = this.#get_data();
	}

	get data(): data
	{
		return this.#data;
	}

	#get_data(): data
	{
		const {
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
		} = this.#imports;

		const resources = Object.fromEntries(
			FGResourceDescriptor.Classes.map(
				(e): [
					FGResourceDescriptor__type[
						'ClassName'
					],
					FGResourceDescriptor__type,
				] => [e.ClassName, e]
			)
		);

		const ingredients = (new Set(FGRecipe.Classes.flatMap(
			e => e.mIngredients.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass)
			)
		)));

		const products = (new Set(FGRecipe.Classes.flatMap(
			e => e.mProduct.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass)
			)
		)));

		const resource_keys = Object.keys(resources);

		const known_byproduct = FGBuildableGeneratorNuclear.Classes.flatMap(
			(e) => e.mFuel.map(
				fuel => fuel.mByproduct
			)
		);

		return {
			ammo: Object.fromEntries(
				[
					...FGAmmoTypeProjectile.Classes,
					...FGAmmoTypeInstantHit.Classes,
					...FGAmmoTypeSpreadshot.Classes,
				].map(e => [e.ClassName, e])
			),
			biomass: Object.fromEntries(
				FGItemDescriptorBiomass.Classes.map(
					(e): [
						FGItemDescriptorBiomass__type[
							'ClassName'
						],
						FGItemDescriptorBiomass__type,
					] => [e.ClassName, e]
				)
			),
			buildings: Object.fromEntries(
				FGBuildingDescriptor.Classes.map(
					(e): [
						FGBuildingDescriptor__type[
							'ClassName'
						],
						FGBuildingDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			consumable: Object.fromEntries(
				FGConsumableDescriptor.Classes.map(
					(e): [
						FGConsumableDescriptor__type[
							'ClassName'
						],
						FGConsumableDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			equipment: Object.fromEntries(
				FGEquipmentDescriptor.Classes.map(
					(e): [
						FGEquipmentDescriptor__type[
							'ClassName'
						],
						FGEquipmentDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			fuel_nuclear: Object.fromEntries(
				FGItemDescriptorNuclearFuel.Classes.map(
					(e): [
						FGItemDescriptorNuclearFuel__type[
							'ClassName'
						],
						FGItemDescriptorNuclearFuel__type,
					] => [e.ClassName, e]
				)
			),
			items: Object.fromEntries(
				FGItemDescriptor.Classes.map(
					(e): [
						FGItemDescriptor__FGResourceDescriptor__type[
							'ClassName'
						],
						FGItemDescriptor__FGResourceDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			poles: Object.fromEntries(
				FGPoleDescriptor.Classes.map(
					(e): [
						FGPoleDescriptor__type[
							'ClassName'
						],
						FGPoleDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			recipes: Object.fromEntries(
				FGRecipe.Classes.map(
					(e): [
						FGRecipe__type[
							'ClassName'
						],
						FGRecipe__type,
					] => [e.ClassName, e]
				)
			),
			resources,
			vehicles: Object.fromEntries(
				FGVehicleDescriptor.Classes.map(
					(e): [
						FGVehicleDescriptor__type[
							'ClassName'
						],
						FGVehicleDescriptor__type,
					] => [e.ClassName, e]
				)
			),
			ingredients,
			products,
			resource_keys,
			known_byproduct,
			known_not_sourced_from_recipe: [
				...ingredients.values(),
			].filter(
				(maybe) => (
					!products.has(maybe)
					&& !resource_keys.includes(maybe)
					&& !(known_byproduct as string[]).includes(maybe)
				)
			),
		};
	}
}
