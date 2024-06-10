import {
	writeFile,
} from 'fs/promises';
import {
	FGRecipe,
} from './generated-types/update8/data/CoreUObject/FGRecipe';
import {
	FGBuildableFrackingActivator,
// eslint-disable-next-line max-len
} from './generated-types/update8/data/CoreUObject/FGBuildableFrackingActivator';
import {
	FGBuildableWaterPump,
} from './generated-types/update8/data/CoreUObject/FGBuildableWaterPump';
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';
import {
	filter_UnrealEngineString_right_x_C_suffix,
	UnrealEngineString_right_x_C_suffix,
} from './lib/planner-request';
import {
	FGBuildableResourceExtractor,
// eslint-disable-next-line max-len
} from './generated-types/update8/data/CoreUObject/FGBuildableResourceExtractor';
import {
	FGResourceDescriptor,
} from './generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions';
import {
	FGBuildableGeneratorNuclear,
// eslint-disable-next-line max-len
} from './generated-types/update8/data/CoreUObject/FGBuildableGeneratorNuclear';
import BigNumber from 'bignumber.js';

const __dirname = __dirname_from_meta(import.meta);

type recipe_selection_properties = {
	[key: UnrealEngineString_right_x_C_suffix]: {
		type: 'string',
		enum: [string, ...string[]],
	}
};
type recipe_selection_properties_with_default = (
	& recipe_selection_properties
	& {
		default:string,
	}
);

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

for (const nuke_gen_fuel of FGBuildableGeneratorNuclear.Classes[0].mFuel) {
	const fuel = nuke_gen_fuel.mFuelClass;
	const byproduct = nuke_gen_fuel.mByproduct;
	const faux_recipe = `Recipe_--faux--${
		FGBuildableGeneratorNuclear.Classes[0].ClassName
	}--${
		fuel
	}--${
		BigNumber(1).dividedBy(nuke_gen_fuel.mByproductAmount).toString()
	}--_C`;

	if (!(byproduct in recipe_selection_enums)) {
		recipe_selection_enums[byproduct] = {
			type: 'string',
			enum: [
				faux_recipe,
			],
		};
	} else {
		recipe_selection_enums[byproduct].enum.push(faux_recipe);
	}
}

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
							maybe => (
								!maybe.includes('_Alternate_')
								&& !maybe.includes('_Unpackage')
							)
						)
						: undefined
				)
				|| (
					(
						value.enum.find(maybe => maybe.includes('_Alternate_'))
						&& ! value.enum.find(
							maybe => (
								!maybe.includes('_Alternate_')
								&& !maybe.includes('_Unpackage')
							)
						)
					)
						? [...value.enum.filter(
							maybe => maybe.includes('_Alternate_')
						)].sort((a, b) => a.length - b.length)[0]
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
		value as unknown as recipe_selection_properties_with_default
	).default = default_value;

	value.enum = value.enum.sort((a, b) => {
		if (
			a === (
				value as unknown as recipe_selection_properties_with_default
			).default
		) {
			return -1;
		} else if (
			b === (
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
		amount_string: {
			type: 'string',
			pattern: '^\\d+(?:\\.\\d{1,6})?$',
		},
		amount_string_flexible: {
			oneOf: [
				{$ref: '#/$defs/amount_string'},
				{
					type: 'string',
					pattern: '^\\d*(?:\\.\\d{1,6})$',
				},
				{
					type: 'string',
					pattern: '^\\d+$',
				},
			],
		},
		numeric_string: {
			type: 'string',
			pattern: '^-?(?:\\d*\\.\\d+|\\d+(?:\\.\\d+)?)$',
		},
		number_arg: {
			oneOf: [
				{type: 'number', minimum: 0, multipleOf: 0.000001},
				{$ref: '#/$defs/amount_string'},
				{$ref: '#/$defs/CanConvertTypeJson'},
			],
		},
		item_amount_object: {
			type: 'object',
			required: ['item', 'amount'],
			additionalProperties: false,
			properties: {
				item: {
					type: 'string',
					enum: Object.keys(recipe_selection_enums).sort((a, b) => {
						return a.localeCompare(b);
					}),
				},
				amount: {
					$ref: '#/$defs/number_arg',
				},
			},
		},
		IntermediaryNumber: {
			type: 'object',
			required: ['type', 'value'],
			additionalProperties: false,
			properties: {
				type: {type: 'string', const: 'IntermediaryNumber'},
				value: {
					oneOf: [
						{$ref: '#/$defs/amount_string_flexible'},
						{$ref: '#/$defs/numeric_string'},
						{
							type: 'string',
							pattern: '^(-?\\d+(?:\\.\\d+))e([+-])(\\d+)$',
						},
					],
				},
			},
		},
		IntermediaryCalculation: {
			type: 'object',
			required: ['type', 'left', 'operation', 'right'],
			additionalProperties: false,
			properties: {
				type: {type: 'string', const: 'IntermediaryCalculation'},
				left: {$ref: '#/$defs/CanConvertTypeJson'},
				operation: {
					type: 'string',
					enum: [
						'+',
						'-',
						'*',
						'x',
						'/',
						'%',
					],
				},
				right: {$ref: '#/$defs/CanConvertTypeJson'},
			},
		},
		CanConvertTypeJson: {
			oneOf: [
				{$ref: '#/$defs/IntermediaryNumber'},
				{$ref: '#/$defs/IntermediaryCalculation'},
			],
		},
	},
	properties: {
		input: {
			type: 'array',
			minItems: 1,
			uniqueItems: true,
			items: {
				$ref: '#/$defs/item_amount_object',
			},
		},
		recipe_selection: {
			$ref: 'recipe-selection',
		},
		pool: {
			type: 'array',
			minItems: 1,
			items: {
				$ref: '#/$defs/item_amount_object',
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
