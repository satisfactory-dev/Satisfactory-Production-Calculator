import {
	FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptor';
import {
	FGRecipe__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGRecipe';
import {
	FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGBuildingDescriptor';
import {
	FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGResourceDescriptor';
import {
	FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGPoleDescriptor';
import {
	FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGEquipmentDescriptor';
import {
	FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/classes/CoreUObject/FGConsumableDescriptor';
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	data,
	FGVehicleDescriptor__type,
	imports,
} from './production-data/types';
import {
	recipe_selection_enums,
} from './production-data/recipe-selection-enums';

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

		const ammo = Object.fromEntries(
			[
				...FGAmmoTypeProjectile.Classes,
				...FGAmmoTypeInstantHit.Classes,
				...FGAmmoTypeSpreadshot.Classes,
			].map(e => [e.ClassName, e])
		);

		const biomass = Object.fromEntries(
			FGItemDescriptorBiomass.Classes.map(
				(e): [
					FGItemDescriptorBiomass__type[
						'ClassName'
					],
					FGItemDescriptorBiomass__type,
				] => [e.ClassName, e]
			)
		);

		const consumable = Object.fromEntries(
			FGConsumableDescriptor.Classes.map(
				(e): [
					FGConsumableDescriptor__type[
						'ClassName'
					],
					FGConsumableDescriptor__type,
				] => [e.ClassName, e]
			)
		);

		const equipment = Object.fromEntries(
			FGEquipmentDescriptor.Classes.map(
				(e): [
					FGEquipmentDescriptor__type[
						'ClassName'
					],
					FGEquipmentDescriptor__type,
				] => [e.ClassName, e]
			)
		);

		const fuel_nuclear = Object.fromEntries(
			FGItemDescriptorNuclearFuel.Classes.map(
				(e): [
					FGItemDescriptorNuclearFuel__type[
						'ClassName'
					],
					FGItemDescriptorNuclearFuel__type,
				] => [e.ClassName, e]
			)
		);

		const items = Object.fromEntries(
			FGItemDescriptor.Classes.map(
				(e): [
					FGItemDescriptor__FGResourceDescriptor__type[
						'ClassName'
					],
					FGItemDescriptor__FGResourceDescriptor__type,
				] => [e.ClassName, e]
			)
		);

		return {
			ammo,
			biomass,
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
			consumable,
			equipment,
			fuel_nuclear,
			items,
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
			recipe_selection_enums: recipe_selection_enums(this.#imports),
			faux_ingredients_list: [
				...Object.keys(ammo),
				...Object.keys(biomass),
				...Object.keys(consumable),
				...Object.keys(equipment),
				...Object.keys(fuel_nuclear),
				...Object.keys(items),
				...Object.keys(resources),
			],
		};
	}
}
