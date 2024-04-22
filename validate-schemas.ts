import Ajv, {
	AnySchema,
	SchemaObject,
} from "ajv/dist/2020";
import {
	glob,
} from 'glob';

import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';

const __dirname = __dirname_from_meta(import.meta);
const ajv = new Ajv({
	verbose: true,
	code: {
		source: true,
		es5: false,
		esm: true,
		optimize: true,
	},
});

const files = Object.fromEntries(
	(await glob(`${__dirname}/generated-schemas/**/*.json`)).map(
		e => [
			e.replace(/^.+\/generated-schemas\//, ''),
			e,
		]
	)
);

const schemas = {
	'production-ingredients-request.json': `${__dirname}/schema/production-ingredients-request.json`,
	'recipe-selection.json': `${__dirname}/schema/recipe-selection.json`,
};

for (const schema_file_path of Object.values(schemas)) {
	const schema = (
		await import(
			schema_file_path,
			{with: {type: 'json'}}
		) as {default: unknown}
	).default;
	ajv.addSchema(schema as SchemaObject);
}

for (const entry of Object.entries(files)) {
	const [expected_key, file_path] = entry;

	if (!(expected_key in schemas)) {
		throw new Error(`${expected_key} has no specified schema!`);
	}

	const json:unknown = (
		await import(file_path, {with: {type: 'json'}}) as {default:unknown}
	).default;
	const schema_file_path = schemas[
		expected_key as keyof typeof schemas
	];
	const schema = (
		await import(
			schema_file_path,
			{with: {type: 'json'}}
		) as {default: unknown}
	).default;

	if (!ajv.validateSchema(schema as AnySchema)) {
		throw new Error(`${schema_file_path} is not a valid schema!`);
	}

	const check = ajv.compile<AnySchema>(schema as AnySchema);

	if (!check(json)) {
		console.error(check.errors);
		throw new Error(`failed to validate ${file_path} against ${schemas[
			expected_key as keyof typeof schemas
		]}`);
	}

	console.log(`${file_path} is valid`);
}
