import {
	writeFile,
} from 'fs/promises';
import {
	FGRecipe,
} from './generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGBuildableFrackingActivator,
} from './generated-types/update8/data/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump,
} from './generated-types/update8/data/CoreUObject/FGBuildableWaterPump';
import {
	__dirname_from_meta,
} from './Docs.json.ts/lib/__dirname';
import {
	filter_UnrealEngineString_right_x_C_suffix,
	UnrealEngineString_right_x_C_suffix,
} from './lib/planner-request';
import {
	FGBuildableResourceExtractor,
} from './generated-types/update8/data/CoreUObject/FGBuildableResourceExtractor';
import {
	FGResourceDescriptor,
} from './generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	NoMatchError,
} from './Docs.json.ts/lib/Exceptions';

const __dirname = __dirname_from_meta(import.meta);

type recipe_selection_properties = {
	[key: UnrealEngineString_right_x_C_suffix]: {
		type: 'string',
		enum: [string, ...string[]],
	}
};

let recipe_selection_enums = FGRecipe.Classes.reduce(
	(was:recipe_selection_properties, is): recipe_selection_properties => {
		for (const product of is.mProduct) {
			const Desc_C = UnrealEngineString_right_x_C_suffix(
				product.ItemClass
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
			maybe.ClassName
		)
	)
).map(e => e.ClassName as UnrealEngineString_right_x_C_suffix);

recipe_selection_enums = [
	...FGBuildableFrackingActivator.Classes,
	...FGBuildableWaterPump.Classes,
	...FGBuildableResourceExtractor.Classes,
].reduce(
	(was:recipe_selection_properties, is): recipe_selection_properties => {
		if (!(is.mAllowedResources instanceof Array)) {
			for (const Desc_C of RF_SOLID) {
				if (!(Desc_C in was)) {
					was[Desc_C] = {type: 'string', enum: [is.ClassName]};
				} else {
					was[Desc_C].enum.push(is.ClassName);
				}
			}

			return was;
		}

		for (const resource of is.mAllowedResources) {
			const Desc_C = UnrealEngineString_right_x_C_suffix(
				resource
			);

			if (!(Desc_C in was)) {
				was[Desc_C] = {type: 'string', enum: [is.ClassName]};
			} else {
				was[Desc_C].enum.push(is.ClassName);
			}
		}

		return was;
	},
	recipe_selection_enums
);

const preferred_defaults = [
	'Build_MinerMk1_C',
	'Build_OilPump_C',
	'Build_WaterPump_C',
	// have to ensure OilPump & WaterPump come first
	'Build_FrackingSmasher_C',
];

const permitted_first_match = [
	'Desc_AlienProtein_C',
	'Desc_GenericBiomass_C',
	'Desc_Medkit_C',
];

for (const entry of Object.entries(recipe_selection_enums)) {
	const [key, value] = entry;

	const default_value = (
		1 === value.enum.length
			? value.enum[0]
			: (
				preferred_defaults.find(maybe => value.enum.includes(maybe))
				|| value.enum.find(
					maybe => maybe === key.replace(/^Desc_/, 'Recipe_')
				)
				|| (
					value.enum.find(maybe => maybe.includes('_Alternate_'))
						? value.enum.find(
							maybe => !maybe.includes('_Alternate_')
						)
						: undefined
				)
				|| (
					(
						value.enum.find(
							maybe => maybe.startsWith('Recipe_Liquid')
						)
						&& value.enum.find(
							maybe => maybe.startsWith('Recipe_Unpackage')
						)
					)
						? value.enum.find(
							maybe => maybe.startsWith('Recipe_Liquid')
						)
						: undefined
				) || (
					(
						value.enum.find(
							maybe => maybe.startsWith('Recipe_Ingot')
						)
						&& value.enum.find(
							maybe => maybe.startsWith('Recipe_Pure')
						)
					)
						? value.enum.find(
							maybe => maybe.startsWith('Recipe_Ingot')
						)
						: undefined
				) || (
					key.startsWith('Desc_')
						? value.enum.find(
							maybe => `Recipe_${key.substring(5)}` === maybe
						)
						: undefined
				) || (
					permitted_first_match.includes(key)
						? value.enum[0]
						: undefined
				) || (
					value.enum.every(maybe => /^Recipe_.+_\d+_C$/.test(maybe))
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
			'Could not find default!'
		);
	}

	(
		value as unknown as (
			& recipe_selection_properties
			& {
				default:string,
			}
		)
	).default = default_value;
}

const recipe_selection = {
	type: 'object',
	additionalProperties: false,
	properties: recipe_selection_enums,
};

const production_ingredients_request = {
	type: 'object',
	required: ['pool'],
	additionalProperties: false,
	$defs: {
		number_arg: {
			oneOf: [
				{type: 'number', minimum: 0, multipleOf: 0.000001},
				{
					type: 'string',
					pattern: '^\\d+(?:\\.\\d{1,6})?$',
				},
			],
		},
	},
	properties: {
		input: {
			type: 'array',
			minItems: 1,
			uniqueItems: true,
			items: {
				type: 'object',
				required: ['item', 'amount'],
				additionalProperties: false,
				properties: {
					item: {
						type: 'string',
						enum: Object.keys(recipe_selection_enums),
					},
					amount: {
						$ref: '#/$defs/number_arg',
					},
				},
			},
		},
		recipe_selection: {
			$ref: 'recipe-selection',
		},
		pool: {
			type: 'array',
			minItems: 1,
			items: {
				type: 'object',
				required: ['item', 'amount'],
				additionalProperties: false,
				properties: {
					item: {
						type: 'string',
						enum: {
							$ref: 'recipe-selection#required',
						},
					},
					amount: {
						$ref: '#/$defs/number_arg',
					},
				},
			},
		},
	},
};

await writeFile(
	`${__dirname}/generated-schemas/production-ingredients-request.json`,
	`${JSON.stringify(
		{
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'production-ingredients-request',
			...production_ingredients_request,
		},
		null,
		'\t'
	)}\n`
);

await writeFile(
	`${__dirname}/generated-schemas/recipe-selection.json`,
	`${JSON.stringify(
		{
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'recipe-selection',
			...recipe_selection,
		},
		null,
		'\t'
	)}\n`
);
