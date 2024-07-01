import {
	writeFile,
} from 'fs/promises';
import {
	instance as production_data,
} from './tests/utilities/production-data';
import {
	generate_schemas,
} from './lib/generate-schemas';

const __dirname = import.meta.dirname;

const {
	recipe_selection,
	production_request,
} = generate_schemas(production_data);

await writeFile(
	`${__dirname}/generated-schemas/production-request.json`,
	`${JSON.stringify(
		{
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'production-request',
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
			$schema: 'https://json-schema.org/draft/2020-12/schema',
			$id: 'recipe-selection',
			...recipe_selection,
		},
		null,
		'\t'
	)}\n`
);
