import type {
	supported_imports,
	update8_data,
	update8_imports,
	version_1p0_data,
	version_1p0_imports,
	version_1p1_data,
} from './production-data/types.ts';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import {
	recipe_selection_enums,
} from './production-data/recipe-selection-enums.ts';

class ProductionData<
	T_Imports extends supported_imports,
> {
	#data: (
		T_Imports extends update8_imports
			? update8_data
			: (
				T_Imports extends version_1p0_imports
					? version_1p0_data
					: version_1p1_data
			)
	);

	#imports: T_Imports;

	constructor(imports: () => T_Imports) {
		this.#imports = imports();
		this.#data = this.#get_data();
	}

	get data(): (
		T_Imports extends update8_imports
			? update8_data
			: (
				T_Imports extends version_1p0_imports
					? version_1p0_data
					: version_1p1_data
			)
	) {
		return this.#data;
	}

	#get_data(): (
		T_Imports extends update8_imports
			? update8_data
			: (
				T_Imports extends version_1p0_imports
					? version_1p0_data
					: version_1p1_data
			)
	) {
		type result = (
			T_Imports extends update8_imports
				? update8_data
				: (
					T_Imports extends version_1p0_imports
						? version_1p0_data
						: version_1p1_data
				)
		);

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

		const FGBuildableManufacturer = (
			('FGBuildableManufacturer' in this.#imports)
				? this.#imports.FGBuildableManufacturer
				: undefined
		);

		const FGBuildableManufacturerVariablePower = (
			('FGBuildableManufacturerVariablePower' in this.#imports)
				? this.#imports.FGBuildableManufacturerVariablePower
				: undefined
		);

		const FGPowerShardDescriptor = (
			('FGPowerShardDescriptor' in this.#imports)
				? this.#imports.FGPowerShardDescriptor
				: undefined
		);

		const FGItemDescriptorPowerBoosterFuel = (
			('FGItemDescriptorPowerBoosterFuel' in this.#imports)
				? this.#imports.FGItemDescriptorPowerBoosterFuel
				: undefined
		);

		const ammo: result['ammo'] = [
			FGAmmoTypeProjectile,
			FGAmmoTypeInstantHit,
			FGAmmoTypeSpreadshot,
		].reduce(
			(was, is): result['ammo'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const biomass: result['biomass'] = [
			FGItemDescriptorBiomass,
		].reduce(
			(was, is): result['biomass'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const buildings: result['buildings'] = [
			FGBuildingDescriptor,
		].reduce(
			(was, is): result['buildings'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const consumable: result['consumable'] = [
			FGConsumableDescriptor,
		].reduce(
			(was, is): result['consumable'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const equipment: result['equipment'] = [
			FGEquipmentDescriptor,
		].reduce(
			(was, is): result['equipment'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const fuel_nuclear: result['fuel_nuclear'] = [
			FGItemDescriptorNuclearFuel,
		].reduce(
			(was, is): result['fuel_nuclear'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const items: result['items'] = [
			FGItemDescriptor,
		].reduce(
			(was, is): result['items'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const manufacturers: result['manufacturers'] = [
			FGBuildableManufacturer,
			FGBuildableManufacturerVariablePower,
		].reduce(
			(was, is): result['manufacturers'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const poles: result['poles'] = [
			FGPoleDescriptor,
		].reduce(
			(was, is): result['poles'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const power_booster_fuel: result['power_booster_fuel'] = [
			FGItemDescriptorPowerBoosterFuel,
		].reduce(
			(was, is): result['power_booster_fuel'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const power_shards: result['power_shards'] = [
			FGPowerShardDescriptor,
		].reduce(
			(was, is): result['power_shards'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const recipes: result['recipes'] = [
			FGRecipe,
		].reduce(
			(was, is): result['recipes'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const resources: result['resources'] = [
			FGResourceDescriptor,
		].reduce(
			(was, is): result['resources'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const vehicles: result['vehicles'] = [
			FGVehicleDescriptor,
		].reduce(
			(was, is): result['vehicles'] => {
				if (is) {
					for (const item of is.Classes) {
						was[item.ClassName] = item;
					}
				}

				return was;
			},
			{},
		);

		const ingredients: result[
			'ingredients'
		] = (new Set(FGRecipe.Classes.map(
			(e) => e.mIngredients,
		).filter(
			(
				maybe,
			): maybe is Exclude<typeof maybe, null> => null !== maybe,
		).flatMap(
			(e) => e.map(
				(e) => get_string_C(e.ItemClass),
			),
		)));

		const products: result['products'] = (new Set(FGRecipe.Classes.flatMap(
			(e) => (
				!e.mProduct
					? []
					: e.mProduct.map(
						(e) => get_string_C(e.ItemClass),
					)),
		)));

		const resource_keys: result['resource_keys'] = Object.keys(resources);

		const known_byproduct: result[
			'known_byproduct'
		] = FGBuildableGeneratorNuclear.Classes
			.flatMap(
				(e) => e.mFuel,
			).map(
				(e) => e.mByproduct,
			)
			.filter((maybe) => !!maybe);

		const known_not_sourced_from_recipe: result[
			'known_not_sourced_from_recipe'
		] = [
			...ingredients,
		].filter(
			(maybe) => (
				!products.has(maybe)
				&& !resource_keys.includes(maybe)
				&& !(known_byproduct as string[]).includes(maybe as string)
			),
		);

		const recipe_selection_enums_value: result[
			'recipe_selection_enums'
		] = recipe_selection_enums(this.#imports);

		const faux_ingredients_list: result[
			'faux_ingredients_list'
		] = [
			...Object.keys(ammo),
			...Object.keys(biomass),
			...Object.keys(consumable),
			...Object.keys(equipment),
			...Object.keys(fuel_nuclear),
			...Object.keys(items),
			...Object.keys(resources),
		];

		return {
			ammo,
			biomass,
			buildings,
			consumable,
			equipment,
			fuel_nuclear,
			items,
			manufacturers,
			poles,
			power_booster_fuel,
			power_shards,
			recipes,
			resources,
			vehicles,
			ingredients,
			products,
			resource_keys,
			known_byproduct,
			known_not_sourced_from_recipe,
			recipe_selection_enums: recipe_selection_enums_value,
			faux_ingredients_list,
		} as result;
	}
}

export {
	ProductionData,
};
