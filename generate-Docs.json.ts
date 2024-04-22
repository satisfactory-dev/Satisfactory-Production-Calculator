import {
	TypeDefinitionWriter,
} from '@satisfactory-clips-archive/docs.json.ts/lib/TypeDefinitionWriter';
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions';
import {
	writeFile,
} from 'node:fs/promises';
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';
import {
	setup_PerformanceObserver,
} from '@satisfactory-clips-archive/docs.json.ts/setup_PerformanceObserver';
import Ajv from 'ajv/dist/2020';
import {
	configure_ajv,
} from '@satisfactory-clips-archive/docs.json.ts/lib/DocsValidation';
import {
	DocsTsGenerator,
} from '@satisfactory-clips-archive/docs.json.ts/lib/DocsTsGenerator';

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
configure_ajv(ajv);

export const docs = new DocsTsGenerator({
	ajv,
	docs_path: `${__dirname}/data/Docs.json`,
	cache_path: `${__dirname}/data/`,
});

const perf = setup_PerformanceObserver();

try {
	performance.mark('start');
	const bar = new TypeDefinitionWriter(docs);
	performance.measure('bootstrap', 'start');
	performance.mark('bootstrap done');
	await bar.write(`${__dirname}/generated-types/update8/`);
	performance.measure('types generated', 'bootstrap done');
	const discovery = await bar.discovery;
	const result = await discovery.discover_type_$defs();

	process.stdout.write(
		`${JSON.stringify(result.missing_classes, null, '\t')}\n`
	);
	console.table({
		'Found Types': Object.keys(result.found_types).length,
		'Missing Types': result.missing_types.length,
		'Found Classes': result.found_classes.length,
		'Missing Classes': result.missing_classes.length,
	});
	await writeFile(
		`${__dirname}/discover-types.perf.json`,
		`${JSON.stringify(perf(), null, '\t')}`
	);
} catch (err) {
	await writeFile(
		`${__dirname}/discover-types.perf.json`,
		`${JSON.stringify(perf(), null, '\t')}`
	);
	if (err instanceof NoMatchError) {
		console.error('ran into an issue');
		await writeFile(
			'./discovery-types.failure.json',
			JSON.stringify(
				{
					property: err.property as unknown,
					message: err.message,
					stack: err.stack?.split('\n'),
				},
				null,
				'\t'
			)
		);

		console.error(err.message, err.stack);
	} else {
		throw err;
	}
}
