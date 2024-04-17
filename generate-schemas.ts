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

const __dirname = __dirname_from_meta(import.meta);

const recipe_ingredients_request = {
	type: 'array',
	minItems: 1,
	items: {
		type: 'object',
		required: ['recipe', 'amount'],
		additionalProperties: false,
		properties: {
			recipe: {
				type: 'string',
				enum: FGRecipe.Classes.map(e => e.ClassName),
			},
			amount: {
				oneOf: [
					{type: 'number', minimum: 0, multipleOf: 0.000001},
					{type: 'string', pattern: '^\\d+(?:\\.\\d{1,6})?$'},
				],
			},
		},
	},
};

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

const recipe_selection = {
	type: 'object',
	minProperties: 0,
	additionalProperties: false,
	properties: recipe_selection_enums,
};

await writeFile(
	`${__dirname}/generated-schemas/recipe-ingredients-request.json`,
	`${JSON.stringify(
		{
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'recipe-ingredients-request',
			...recipe_ingredients_request,
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
