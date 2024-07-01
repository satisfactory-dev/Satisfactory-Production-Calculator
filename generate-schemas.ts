import {
	writeFile,
} from 'fs/promises';
import {
	instance as production_data,
} from './tests/utilities/production-data';
import {
	GenerateSchemas,
} from './lib/generate-schemas';

const __dirname = import.meta.dirname;

const {
	recipe_selection,
	production_request,
} = GenerateSchemas.factory(production_data);

await writeFile(
	`${__dirname}/generated-schemas/production-request.json`,
	`${JSON.stringify(
		{
			...production_request,
		},
		null,
		'\t'
	)}\n`
);

await writeFile(
	`${__dirname}/generated-schemas/recipe-selection.json`,
	`${JSON.stringify(
		{
			...recipe_selection,
		},
		null,
		'\t'
	)}\n`
);
