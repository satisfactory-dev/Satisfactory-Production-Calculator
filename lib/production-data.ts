import type {
	hasClassName,
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/Base.js';

import {
	get_string_C,
} from './utilities/get_string_C.ts';

import {
	recipe_selection_enums,
} from './production-data/recipe-selection-enums.ts';

import type {
	by_version,
	supported_versions,
} from './supported.ts';

import type {
	NativeClass__type,
} from './production-data/types.ts';

class ProductionData<
	Version extends supported_versions,
> {
	#data: by_version[Version]['data'];

	#imports: by_version[Version]['imports'];

	#save_compatibility_targets: (`${string}_C`[]) | undefined = undefined;

	constructor(imports: () => by_version[Version]['imports']) {
		this.#imports = imports();
		this.#data = this.#get_data();
	}

	get data(): by_version[Version]['data'] {
		return this.#data;
	}

	get save_compatibility_targets(): `${string}_C`[] {
		if (undefined === this.#save_compatibility_targets) {
			const result: `${string}_C`[] = [];

			const schematics = this.#imports.FGSchematic;

			if (schematics) {
				const save_compatibility = schematics.Classes.find((
					maybe,
				) => 'Schematic_SaveCompatibility_C' === get_string_C(
					maybe.ClassName,
				));

				if (save_compatibility) {
					result.push(...save_compatibility.mUnlocks
						.filter((maybe) => 'mRecipes' in maybe)
						.flatMap((e) => e.mRecipes.map(get_string_C)));
				}
			}

			this.#save_compatibility_targets = result;
		}

		return this.#save_compatibility_targets;
	}

	#get_data(): by_version[Version]['data'] {
		type result = by_version[Version]['data'];

		const {
			FGAmmoTypeProjectile,
			FGAmmoTypeInstantHit,
			FGAmmoTypeSpreadshot,
			FGItemDescriptorBiomass,
			FGBuildable,
			FGBuildableConveyorBelt,
			FGBuildableConveyorLift,
			FGBuildablePipeline,
			FGBuildingDescriptor,
			FGConsumableDescriptor,
			FGEquipmentDescriptor,
			FGItemDescriptorNuclearFuel,
			FGItemDescriptor,
			FGPoleDescriptor,
			FGRecipe,
			FGSchematic,
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

		const ammo = {
			...ProductionData.#reduce(FGAmmoTypeProjectile),
			...ProductionData.#reduce(FGAmmoTypeInstantHit),
			...ProductionData.#reduce(FGAmmoTypeSpreadshot),
		};

		const belts = ProductionData.#reduce(FGBuildableConveyorBelt);

		const lifts = ProductionData.#reduce(FGBuildableConveyorLift);

		const pipes = ProductionData.#reduce(FGBuildablePipeline);

		const biomass = ProductionData.#reduce(FGItemDescriptorBiomass);

		const buildable = ProductionData.#reduce(FGBuildable);

		const buildings = ProductionData.#reduce(FGBuildingDescriptor);

		const consumable = ProductionData.#reduce(FGConsumableDescriptor);

		const equipment = ProductionData.#reduce(FGEquipmentDescriptor);

		const fuel_nuclear = ProductionData.#reduce(
			FGItemDescriptorNuclearFuel,
		);

		const items = ProductionData.#reduce(FGItemDescriptor);

		const manufacturers = {
			...ProductionData.#reduce(FGBuildableManufacturer),
			...ProductionData.#reduce(FGBuildableManufacturerVariablePower),
		};

		const poles = ProductionData.#reduce(FGPoleDescriptor);

		const power_booster_fuel = ProductionData.#reduce(
			FGItemDescriptorPowerBoosterFuel,
		);

		const power_shards = ProductionData.#reduce(FGPowerShardDescriptor);

		const recipes = ProductionData.#reduce(FGRecipe);

		const resources = ProductionData.#reduce(FGResourceDescriptor);

		const vehicles = ProductionData.#reduce(FGVehicleDescriptor);

		const schematics = ProductionData.#reduce(FGSchematic);

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

		const compatibility_schematic = FGSchematic.Classes.find(
			(maybe) => 'Schematic_SaveCompatibility_C' === maybe.ClassName,
		);

		const skip_unless_one_of_these = FGSchematic.Classes.filter(
			(maybe) => 'Schematic_SaveCompatibility_C' !== maybe.ClassName,
		).flatMap((
			schematic,
		) => schematic.mUnlocks
			.filter((maybe) => 'mRecipes' in maybe)
			.flatMap((
				recipes,
			) => recipes.mRecipes.map((e) => get_string_C(e))),
		);

		const compatibility_recipes = (
			(
				compatibility_schematic?.mUnlocks
					.filter((maybe) => 'mRecipes' in maybe)
					.flatMap((
						recipes,
					) => recipes.mRecipes.map((e) => get_string_C(e)))
			) || []
		).filter((maybe) => !skip_unless_one_of_these.includes(maybe));

		const supported_recipes = FGRecipe.Classes.filter((
			maybe,
		) => !compatibility_recipes.includes(maybe.ClassName));

		return {
			ammo,
			belts,
			biomass,
			buildable,
			buildings,
			consumable,
			equipment,
			fuel_nuclear,
			items,
			lifts,
			manufacturers,
			pipes,
			poles,
			power_booster_fuel,
			power_shards,
			recipes,
			resources,
			vehicles,
			ingredients,
			products,
			resource_keys,
			schematics,
			known_byproduct,
			known_not_sourced_from_recipe,
			recipe_selection_enums: recipe_selection_enums_value,
			faux_ingredients_list,
			compatibility_recipes,
			supported_recipes,
		} as result;
	}

	static #reduce<
		T1 extends NativeClass__type<`FG${string}`, hasClassName>,
	>(
		source: T1 | undefined,
	): {[key: `${string}_C`]: T1['Classes'][number]} {
		if (!source) {
			return {};
		}

		return source.Classes.reduce((
			was,
			is,
		): {[key: `${string}_C`]: T1['Classes'][number]} => {
			was[is.ClassName] = is;

			return was;
		}, {});
	}
}

export {
	ProductionData,
};
