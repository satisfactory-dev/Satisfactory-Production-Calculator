import {
	writeFile,
} from 'fs/promises';
import {
	FGRecipe,
} from './generated-types/update8/data/CoreUObject/FGRecipe';
import {
	__dirname_from_meta,
} from './Docs.json.ts/lib/__dirname';
import {
	UnrealEngineString_right_x_C_suffix,
} from './lib/planner-request';

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

const recipe_selection = {
	type: 'object',
	minProperties: 0,
	additionalProperties: false,
	properties: FGRecipe.Classes.reduce(
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
	),
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
