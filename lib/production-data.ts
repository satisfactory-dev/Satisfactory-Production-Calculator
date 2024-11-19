import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	data,
	imports,
} from './production-data/types/update8';
import {
	recipe_selection_enums,
} from './production-data/recipe-selection-enums';
import {
	ItemClass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/unassigned';

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
				(e) => [e.ClassName, e],
			),
		);

		const ingredients = (new Set(FGRecipe.Classes.map(
			e => e.mIngredients,
		).filter(
			(
				maybe: '' | ItemClass__type,
			): maybe is ItemClass__type => '' !== maybe,
		).flatMap(
			e => e.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass),
			),
		)));

		const products = (new Set(FGRecipe.Classes.flatMap(
			e => e.mProduct.map(
				e => UnrealEngineString_right_x_C_suffix(e.ItemClass),
			),
		)));

		const resource_keys = Object.keys(resources);

		const known_byproduct = FGBuildableGeneratorNuclear.Classes.flatMap(
			(e) => e.mFuel,
		).map(
			(e) => e.mByproduct,
		);

		const ammo = Object.fromEntries(
			[
				...FGAmmoTypeProjectile.Classes,
				...FGAmmoTypeInstantHit.Classes,
				...FGAmmoTypeSpreadshot.Classes,
			].map(e => [e.ClassName, e]),
		);

		const biomass = Object.fromEntries(
			FGItemDescriptorBiomass.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const consumable = Object.fromEntries(
			FGConsumableDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const equipment = Object.fromEntries(
			FGEquipmentDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const fuel_nuclear = Object.fromEntries(
			FGItemDescriptorNuclearFuel.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		const items = Object.fromEntries(
			FGItemDescriptor.Classes.map(
				(e) => [e.ClassName, e],
			),
		);

		return {
			ammo,
			biomass,
			buildings: Object.fromEntries(
				FGBuildingDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			consumable,
			equipment,
			fuel_nuclear,
			items,
			poles: Object.fromEntries(
				FGPoleDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			recipes: Object.fromEntries(
				FGRecipe.Classes.map(
					(e) => [e.ClassName, e],
				),
			),
			resources,
			vehicles: Object.fromEntries(
				FGVehicleDescriptor.Classes.map(
					(e) => [e.ClassName, e],
				),
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
					&& !(known_byproduct as string[]).includes(maybe as string)
				),
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
