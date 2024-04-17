import {
	writeFile,
} from 'fs/promises';
import {
	FGRecipe,
} from './generated-types/update8/data/CoreUObject/FGRecipe.js';
import {
	__dirname_from_meta,
} from './Docs.json.ts/lib/__dirname.js';

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
