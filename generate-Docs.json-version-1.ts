import {
	writeFile,
} from 'node:fs/promises';
import Ajv from 'ajv/dist/2020';
import {
	configure_ajv,
} from '@satisfactory-dev/docs.json.ts/lib/generator';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib/index';
import {
	setup_PerformanceObserver,
} from '@satisfactory-dev/docs.json.ts/setup_PerformanceObserver';
import {
	DocsTsGenerator,
	DocsTsGeneratorVersion,
	TypeDefinitionWriter,
} from '@satisfactory-dev/docs.json.ts/lib/generator';

const __dirname = import.meta.dirname;
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
	docs_versions: {
		common: new DocsTsGeneratorVersion({
			docs_path: `${__dirname}/node_modules/@satisfactory-dev/docs.json.ts/data/common/faux.json`,
			cache_path: `${__dirname}/data/common/`,
			types_from_module: (
				'@satisfactory-dev/docs.json.ts/generated-types/common'
			),
			UnrealEngineString_quote_mode: 'original',
		}),
		version_1_0_0_0: new DocsTsGeneratorVersion({
			docs_path: `${__dirname}/data/1.0/en-US.json`,
			cache_path: `${__dirname}/data/1.0/`,
			types_from_module: (
				'@satisfactory-dev/docs.json.ts/generated-types/1.0'
			),
			UnrealEngineString_quote_mode: 'double',
		}),
	},
});

const perf = setup_PerformanceObserver();

try {
	performance.mark('start');
	const bar = new TypeDefinitionWriter(docs, 'version_1_0_0_0');
	performance.measure('bootstrap', 'start');
	performance.mark('bootstrap done');
	await bar.write(`${__dirname}/generated-types/1.0/`);
	performance.measure('types generated', 'bootstrap done');
	const discovery = await bar.discovery;
	const result = await discovery.discover_type_$defs();

	process.stdout.write(
		`${JSON.stringify(result.missing_classes, null, '\t')}\n`,
	);
	console.table({
		'Found Types': Object.keys(result.found_types).length,
		'Missing Types': result.missing_types.length,
		'Found Classes': result.found_classes.length,
		'Missing Classes': result.missing_classes.length,
	});
	await writeFile(
		`${__dirname}/discover-types.perf.json`,
		`${JSON.stringify(perf(), null, '\t')}`,
	);
} catch (err) {
	await writeFile(
		`${__dirname}/discover-types.perf.json`,
		`${JSON.stringify(perf(), null, '\t')}`,
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
				'\t',
			),
		);

		console.error(err.message, err.stack);
	} else {
		throw err;
	}
}
