import BigNumber from 'bignumber.js';

import {
	filter_UnrealEngineString_right_x_C_suffix,
	UnrealEngineString_right_x_C_suffix,
} from '../UnrealEngineString';
import {
	imports,
	recipe_selection_properties,
	recipe_selection_properties_with_default,
	recipe_selection_properties_with_defaults,
} from './types';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib';
import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel';
import {
	common_base__FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGPoleDescriptor';
import {
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptor';
import {
	common_base__FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	common_base__FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGEquipmentDescriptor';
import {
	common_base__FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGConsumableDescriptor';
import {
	common_base__FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildingDescriptor';
import {
	common_base__FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	common_base__FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGAmmoTypeProjectile__base__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	common_base__FGAmmoTypeInstantHit__base__pre_1_1__type,
	common_base__FGAmmoTypeProjectile__base__pre_1_1__type,
	common_base__FGAmmoTypeSpreadshot__pre_1_1__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/unassigned';
import {
	common_base__FGAmmoTypeInstantHit__chaos__type,
	common_base__FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	common_base__FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeProjectile';


export function recipe_selection_enums<
	T_PowerShard extends undefined|FGPowerShardDescriptor__type = undefined,
	// eslint-disable-next-line max-len
	T_PowerBoosterFuel extends undefined|FGItemDescriptorPowerBoosterFuel__type = undefined,
	T_AmmoTypeProjectile extends (
		| common_base__FGAmmoTypeProjectile__type
		| common_base__FGAmmoTypeProjectile__base__pre_1_1__type
	) = common_base__FGAmmoTypeProjectile__type,
	T_AmmoTypeInstantHit extends (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
		| common_base__FGAmmoTypeInstantHit__base__pre_1_1__type
	) = (
		| common_base__FGAmmoTypeInstantHit__chaos__type
		| common_base__FGAmmoTypeInstantHit__standard__type
	),
	T_AmmoTypeSpreadshot extends (
		| common_base__FGAmmoTypeSpreadshot__type
		| (
			& FGAmmoTypeProjectile__base__type
			& common_base__FGAmmoTypeSpreadshot__pre_1_1__type
		)
	) = common_base__FGAmmoTypeSpreadshot__type,
	// eslint-disable-next-line max-len
	T_ItemDescriptorBiomass extends common_base__FGItemDescriptorBiomass__type = common_base__FGItemDescriptorBiomass__type,
	// eslint-disable-next-line max-len
	T_BuildingDescriptor extends common_base__FGBuildingDescriptor__type = common_base__FGBuildingDescriptor__type,
	// eslint-disable-next-line max-len
	T_ConsumableDescriptor extends common_base__FGConsumableDescriptor__type = common_base__FGConsumableDescriptor__type,
	// eslint-disable-next-line max-len
	T_EquipmentDescriptor extends common_base__FGEquipmentDescriptor__type = common_base__FGEquipmentDescriptor__type,
	T_ItemDescriptorNuclearFuel extends (
		| common_base__FGItemDescriptorNuclearFuel__type
	) = (
		| common_base__FGItemDescriptorNuclearFuel__type
	),
	T_ItemDescriptor extends (
		| common_base__FGItemDescriptor__FGResourceDescriptor__type
	) = (
		| common_base__FGItemDescriptor__FGResourceDescriptor__type
	),
	T_PoleDescriptor extends (
		| common_base__FGPoleDescriptor__type
	) = common_base__FGPoleDescriptor__type,
>(
	imports:imports<
		T_PowerShard,
		T_PowerBoosterFuel,
		T_AmmoTypeProjectile,
		T_AmmoTypeInstantHit,
		T_AmmoTypeSpreadshot,
		T_ItemDescriptorBiomass,
		T_BuildingDescriptor,
		T_ConsumableDescriptor,
		T_EquipmentDescriptor,
		T_ItemDescriptorNuclearFuel,
		T_ItemDescriptor,
		T_PoleDescriptor
	>,
): recipe_selection_properties_with_defaults {
	const {
		FGRecipe,
		FGResourceDescriptor,
		FGBuildableGeneratorNuclear,
		FGBuildableFrackingActivator,
		FGBuildableWaterPump,
		FGBuildableResourceExtractor,
	} = imports;

	let recipe_selection_enums = FGRecipe.Classes.reduce(
		(
			was:recipe_selection_properties,
			is,
		): recipe_selection_properties => {
			for (const product of is.mProduct) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					product.ItemClass,
				);

				if (!(Desc_C in was)) {
					was[Desc_C] = {type: 'string', enum: [is.ClassName]};
				} else {
					was[Desc_C].enum.push(is.ClassName);
				}
			}

			return was;
		},
		{} as recipe_selection_properties,
	);

	const RF_SOLID = FGResourceDescriptor.Classes.filter(
		(maybe) => (
			'RF_SOLID' === maybe.mForm
			&& filter_UnrealEngineString_right_x_C_suffix(
				maybe.ClassName,
			)
		),
	).map(e => e.ClassName as UnrealEngineString_right_x_C_suffix);

	for (
		const nuke_gen_fuel of FGBuildableGeneratorNuclear.Classes[0].mFuel
	) {
		const fuel = nuke_gen_fuel.mFuelClass;
		const byproduct = nuke_gen_fuel.mByproduct;
		const faux_recipe = `Recipe_--faux--${
			FGBuildableGeneratorNuclear.Classes[0].ClassName
		}--${
			fuel
		}--${
			BigNumber(1).dividedBy(
				nuke_gen_fuel.mByproductAmount,
			).toString()
		}--_C`;

		if (!(byproduct in recipe_selection_enums)) {
			// eslint-disable-next-line max-len
			recipe_selection_enums[byproduct as keyof typeof recipe_selection_enums] = {
				type: 'string',
				enum: [
					faux_recipe,
				],
			};
		} else {
			// eslint-disable-next-line max-len
			recipe_selection_enums[byproduct as keyof typeof recipe_selection_enums].enum.push(faux_recipe);
		}
	}

	recipe_selection_enums = [
		...FGBuildableFrackingActivator.Classes,
		...FGBuildableWaterPump.Classes,
		...FGBuildableResourceExtractor.Classes,
	].reduce(
		(
			was:recipe_selection_properties,
			is,
		): recipe_selection_properties => {
			if (!(is.mAllowedResources instanceof Array)) {
				for (const Desc_C of RF_SOLID) {
					if (!(Desc_C in was)) {
						was[Desc_C] = {
							type: 'string',
							enum: [is.ClassName],
						};
					} else {
						was[Desc_C].enum.push(is.ClassName);
					}
				}

				return was;
			}

			for (const resource of is.mAllowedResources) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					resource,
				);

				if (!(Desc_C in was)) {
					was[Desc_C] = {type: 'string', enum: [is.ClassName]};
				} else {
					was[Desc_C].enum.push(is.ClassName);
				}
			}

			return was;
		},
		recipe_selection_enums,
	);

	const preferred_defaults = [
		'Build_MinerMk1_C',
		'Build_OilPump_C',
		'Build_WaterPump_C',
		// have to ensure OilPump & WaterPump come first
		'Build_FrackingSmasher_C',
		// 1.0 compact coal needs a default
		'Recipe_Alternate_EnrichedCoal_C',
		'Recipe_PowerCrystalShard_1_C',
	];

	const permitted_first_match = [
		'Desc_AlienProtein_C',
		'Desc_GenericBiomass_C',
		'Desc_Medkit_C',
		'Desc_FicsiteIngot_C',
		'Desc_CrystalShard_C',
	];

	for (const entry of Object.entries(recipe_selection_enums)) {
		const [key, value] = entry;

		const default_value = (
			1 === value.enum.length
				? value.enum[0]
				: (
					preferred_defaults.find(
						maybe => value.enum.includes(maybe),
					)
					|| value.enum.find(
						maybe => maybe === key.replace(/^Desc_/, 'Recipe_'),
					)
					|| (
						value.enum.find(maybe => maybe.includes('_Alternate_'))
							? value.enum.find(
								maybe => (
									!maybe.includes('_Alternate_')
									&& !maybe.includes('_Unpackage')
								),
							)
							: undefined
					)
					|| (
						(
							value.enum.find(
								maybe => maybe.includes('_Alternate_'),
							)
							&& ! value.enum.find(
								maybe => (
									!maybe.includes('_Alternate_')
									&& !maybe.includes('_Unpackage')
								),
							)
						)
							? [...value.enum.filter(
								maybe => maybe.includes('_Alternate_'),
							)].sort((a, b) => a.length - b.length)[0]
							: undefined
					)
					|| (
						(
							value.enum.find(
								maybe => maybe.startsWith('Recipe_Liquid'),
							)
							&& value.enum.find(
								maybe => maybe.startsWith('Recipe_Unpackage'),
							)
						)
							? value.enum.find(
								maybe => maybe.startsWith('Recipe_Liquid'),
							)
							: undefined
					) || (
						(
							value.enum.find(
								maybe => maybe.startsWith('Recipe_Ingot'),
							)
							&& value.enum.find(
								maybe => maybe.startsWith('Recipe_Pure'),
							)
						)
							? value.enum.find(
								maybe => maybe.startsWith('Recipe_Ingot'),
							)
							: undefined
					) || (
						key.startsWith('Desc_')
							? value.enum.find(
								maybe => `Recipe_${key.substring(5)}` === maybe,
							)
							: undefined
					) || (
						permitted_first_match.includes(key)
							? value.enum[0]
							: undefined
					) || (
						value.enum.every(
							maybe => /^Recipe_.+_\d+_C$/.test(maybe),
						)
							? value.enum.find(maybe => maybe.endsWith('_1_C'))
							: undefined
					)
				)
		);

		if (undefined === default_value) {
			throw new NoMatchError(
				{
					[key]: value,
				},
				'Could not find default!',
			);
		}

		(
			value as unknown as recipe_selection_properties_with_default
		).default = default_value;

		value.enum = value.enum.sort((a, b) => {
			if (
				a === (
					// eslint-disable-next-line max-len
					value as unknown as recipe_selection_properties_with_default
				).default
			) {
				return -1;
			} else if (
				b === (
					// eslint-disable-next-line max-len
					value as unknown as recipe_selection_properties_with_default
				).default
			) {
				return 1;
			}

			if (a.startsWith('Build_')) {
				if (b.startsWith('Build_')) {
					return 0;
				}

				return -1;
			} else if (b.startsWith('Build_')) {
				return 1;
			} else if (
				a.startsWith('Recipe_')
				&& !a.startsWith('Recipe_Alternate_')
			) {
				if (
					b.startsWith('Recipe_')
					&& b.startsWith('Recipe_Alternate')
				) {
					return -1;
				}
			}

			return 0;
		});
	}

	return recipe_selection_enums as recipe_selection_properties_with_defaults;
}
