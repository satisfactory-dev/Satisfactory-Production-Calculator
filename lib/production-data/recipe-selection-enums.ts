import BigNumber from 'bignumber.js';

import type {

	// oxlint-disable-next-line @stylistic/max-len
	FGBuildableResourceExtractor_only_allow_certain_resources as FGBuildableResourceExtractor_only_allow_certain_resources__update8,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/classes/Base.overridable--0.8.3.3.js';

import type {

	// oxlint-disable-next-line @stylistic/max-len
	FGBuildableResourceExtractor_only_allow_certain_resources as FGBuildableResourceExtractor_only_allow_certain_resources__v1p0,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/classes/Base.overridable--1.0.1.4.js';

import type {

	// oxlint-disable-next-line @stylistic/max-len
	FGBuildableResourceExtractor_only_allow_certain_resources as FGBuildableResourceExtractor_only_allow_certain_resources__v1p1,

	// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/classes/Base.overridable--1.1.2.2.js';

import type {
	recipe_selection_properties,
	recipe_selection_properties_with_defaults,
	update8_imports,
	version_1p0_imports,
	version_1p1_imports,
} from './types.ts';

import type {
	FGBuildableFrackingActivator,
	FGBuildableResourceExtractor,
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes.ts';

import {
	get_string_C,
} from '../utilities/get_string_C.ts';

function FGBuildableResourceExtractor_only_allow_certain_resources(
	maybe: (
		| FGBuildableResourceExtractor
		| FGBuildableFrackingActivator
		| FGBuildableResourceExtractor_only_allow_certain_resources__update8
		| FGBuildableResourceExtractor_only_allow_certain_resources__v1p0
		| FGBuildableResourceExtractor_only_allow_certain_resources__v1p1
	),
): maybe is (
	| FGBuildableResourceExtractor_only_allow_certain_resources__update8
	| FGBuildableResourceExtractor_only_allow_certain_resources__v1p0
	| FGBuildableResourceExtractor_only_allow_certain_resources__v1p1
) {
	return 'mAllowedResources' in maybe;
}

export function recipe_selection_enums<
	T_import extends (
		| update8_imports
		| version_1p0_imports
		| version_1p1_imports
	),
>(
	imports: T_import,
): recipe_selection_properties_with_defaults {
	const {
		FGRecipe,
		FGResourceDescriptor,
		FGBuildableGeneratorNuclear,
		FGBuildableFrackingActivator,
		FGBuildableWaterPump,
		FGBuildableResourceExtractor,
	} = imports;

	// oxlint-disable-next-line @stylistic/max-len
	let recipe_selection_enums: recipe_selection_properties = FGRecipe.Classes.reduce(
		(
			was: recipe_selection_properties,
			is,
		): recipe_selection_properties => {
			if (is.mProduct) {
				for (const product of is.mProduct) {
					const Desc_C = get_string_C(
						product.ItemClass,
					);

					if (!(Desc_C in was)) {
						was[Desc_C] = {type: 'string', enum: [is.ClassName]};
					} else {
						was[Desc_C].enum.push(is.ClassName);
					}
				}
			}

			return was;
		},
		{} as recipe_selection_properties,
	);

	const RF_SOLID = FGResourceDescriptor.Classes.filter(
		(maybe) => (
			'RF_SOLID' === maybe.mForm
			&& maybe.ClassName
		),
	).map((e) => e.ClassName);

	for (
		const nuke_gen_fuel of FGBuildableGeneratorNuclear.Classes[0].mFuel
	) {
		const fuel = nuke_gen_fuel.mFuelClass;
		const byproduct = nuke_gen_fuel.mByproduct;

		if ('' === byproduct) {
			continue;
		}

		if ('' === nuke_gen_fuel.mByproductAmount) {
			throw new Error(`${fuel} has empty mByproductAmount`);
		}

		const faux_recipe: `${string}_C` = `Recipe_--faux--${
			FGBuildableGeneratorNuclear.Classes[0].ClassName
		}--${
			fuel
		}--${
			BigNumber(1).dividedBy(
				nuke_gen_fuel.mByproductAmount,
			).toString()
		}--_C`;

		if (!(byproduct in recipe_selection_enums)) {
			// eslint-disable-next-line @stylistic/max-len
			recipe_selection_enums[byproduct as keyof typeof recipe_selection_enums] = {
				type: 'string',
				enum: [
					faux_recipe,
				],
			};
		} else {
			// eslint-disable-next-line @stylistic/max-len
			recipe_selection_enums[byproduct as keyof typeof recipe_selection_enums].enum.push(faux_recipe);
		}
	}

	for (const is of [
		...FGBuildableFrackingActivator.Classes,
		...FGBuildableWaterPump.Classes,
		...FGBuildableResourceExtractor.Classes,
	] as (
		| FGBuildableFrackingActivator
		| FGBuildableResourceExtractor
	)[]) {
		if (FGBuildableResourceExtractor_only_allow_certain_resources(is)) {
			for (const resource of is.mAllowedResources) {
				const Desc_C = get_string_C(
					resource,
				);

				if (!(Desc_C in recipe_selection_enums)) {
					recipe_selection_enums[Desc_C] = {
						type: 'string',
						enum: [is.ClassName],
					};
				} else {
					recipe_selection_enums[Desc_C].enum.push(is.ClassName);
				}
			}
		} else {
			for (const Desc_C of RF_SOLID) {
				if (!(Desc_C in recipe_selection_enums)) {
					recipe_selection_enums[Desc_C] = {
						type: 'string',
						enum: [is.ClassName],
					};
				} else {
					recipe_selection_enums[Desc_C].enum.push(is.ClassName);
				}
			}
		}
	}

	for (const extractor of FGBuildableResourceExtractor.Classes) {
		if (!('mParticleMap' in extractor)) {
			continue;
		}

		for (const {
			ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3,
		} of extractor.mParticleMap) {
			const resource_C = get_string_C(
				ResourceNode_16_2100B5C34EE8DF7958D78A974512F3C3,
			);

			if (!(resource_C in recipe_selection_enums)) {
				recipe_selection_enums[resource_C] = {
					type: 'string',
					enum: [extractor.ClassName],
				};
			} else {
				recipe_selection_enums[resource_C].enum.push(
					extractor.ClassName,
				);
			}
		}
	}

	const preferred_defaults: `${string}_C`[] = [
		'Build_MinerMk1_C',
		'Build_OilPump_C',
		'Build_WaterPump_C',

		// have to ensure OilPump & WaterPump come first
		'Build_FrackingSmasher_C',

		// 1.0 compact coal needs a default
		'Recipe_Alternate_EnrichedCoal_C',
		'Recipe_PowerCrystalShard_1_C',
	];

	const permitted_first_match: `${string}_C`[] = [
		'Desc_AlienProtein_C',
		'Desc_GenericBiomass_C',
		'Desc_Medkit_C',
		'Desc_FicsiteIngot_C',
		'Desc_CrystalShard_C',
	];

	return Object.fromEntries(
		Object.entries(recipe_selection_enums)
			.map(([key, value]) => {
				const default_value = (
					1 === value.enum.length
						? value.enum[0]
						: (
							preferred_defaults.find(
								(maybe) => value.enum.includes(maybe),
							)
							|| value.enum.find((
								maybe,
							) => maybe === key.replace(/^Desc_/, 'Recipe_'))
							|| (
								value.enum.find((
									maybe,
								) => maybe.includes('_Alternate_'))
									? value.enum.find(
										(maybe) => (
											!maybe.includes('_Alternate_')
											&& !maybe.includes('_Unpackage')
										),
									)
									: undefined
							)
							|| (
								(
									value.enum.find((
										maybe,
									) => maybe.includes('_Alternate_'))
									&& !value.enum.find(
										(maybe) => (
											!maybe.includes('_Alternate_')
											&& !maybe.includes('_Unpackage')
										),
									)
								)
									? [...value.enum.filter((
										maybe,
									) => maybe.includes('_Alternate_'))]
										.sort((a, b) => a.length - b.length)[0]
									: undefined
							)
							|| (
								(
									value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Liquid'))
									&& value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Unpackage'))
								)
									? value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Liquid'))
									: undefined
							) || (
								(
									value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Ingot'))
									&& value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Pure'))
								)
									? value.enum.find((
										maybe,
									) => maybe.startsWith('Recipe_Ingot'))
									: undefined
							) || (
								key.startsWith('Desc_')
									? value.enum.find(
										(maybe) => `Recipe_${
											key.substring(5)
										}` === maybe,
									)
									: undefined
							) || (
								permitted_first_match.includes(key)
									? value.enum[0]
									: undefined
							) || (
								value.enum.every(
									(maybe) => /^Recipe_.+_\d+_C$/.test(maybe),
								)
									? value.enum.find((
										maybe,
									) => maybe.endsWith('_1_C'))
									: undefined
							)
						)
				);

				if (undefined === default_value) {
					throw new Error(
						`Could not find default for ${key}`,
					);
				}

				// oxlint-disable-next-line @stylistic/max-len
				const replacement_value = {
					...value,
					default: default_value,
				};

				replacement_value.enum = value.enum.sort((a, b) => {
					if (
						a === replacement_value.default
					) {
						return -1;
					} else if (
						b === replacement_value.default
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

				return [key, replacement_value];
			}),
	);
}
