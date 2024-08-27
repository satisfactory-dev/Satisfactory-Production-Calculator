import {
	eslint_generated_types,
} from "@satisfactory-dev/docs.json.ts/lib/DocsTsGenerator";

const __dirname = import.meta.dirname;

await eslint_generated_types(`${__dirname}/generated-types/update8/`);
