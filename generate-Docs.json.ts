import type {
	by_version,
	supported_versions,
} from './lib/supported.ts';

const [,, ...remaining] = process.argv;

const maybe_semver = process.env.DOCSDOTJSON_SEMVER;

const supported_semver: supported_versions[] = [
	'0.8.3.3',
	'1.0.1.4',
	'1.1.2.2',
	'1.2.1.0',
];

function is_supported_semver(
	maybe: unknown,
): asserts maybe is supported_versions {
	if (!(supported_semver as unknown[]).includes(maybe)) {
		throw new Error(`Unsupported semver specified!`);
	}
}

is_supported_semver(maybe_semver);

const is_supported_from: {
	[key in supported_versions]: (
		| supported_versions
		| '0.3.7.7'
		| '1.2.0.0'
	);
} = {
	'0.8.3.3': '0.3.7.7',
	'1.0.1.4': '1.0.1.4',
	'1.1.2.2': '1.1.2.2',
	'1.2.1.0': '1.2.0.0',
};

function docs_filename<
	Version extends supported_versions,
	Lang extends string,
>(
	version: Version,
	lang: Lang,
) {
	const docs_filename: {
		[key in supported_versions]: (
			| 'Docs.utf8.json'
			| `${typeof lang}.utf8.json`
		)
	} = {
		'0.8.3.3': 'Docs.utf8.json',
		'1.0.1.4': `${lang}.utf8.json`,
		'1.1.2.2': `${lang}.utf8.json`,
		'1.2.1.0': `${lang}.utf8.json`,
	};

	return docs_filename[version];
}

async function handle<
	Version extends supported_versions,
>(
	version: Version,
) {
	const lang = remaining.filter((maybe) => !maybe.startsWith('--'))[0];

	const is_supported: by_version[Version]['is_supported_lang'] = (
		await import(

			// oxlint-disable-next-line @stylistic/max-len
			`@satisfactory-dev/docs.json.ts/src/version-specific/${
				is_supported_from[version]
			}/supported_lang.js`,
		) as {
			is_supported: by_version[Version]['is_supported_lang'],
		}
	).is_supported;

	function assert_lang(
		maybe: unknown,
	): asserts maybe is Parameters<
		by_version[Version]['generation_factory']
	>[1] {
		if ('string' !== typeof maybe || !is_supported(maybe)) {
			throw new Error('Unsupported language');
		}
	}

	assert_lang(lang);

	const {
		default: release_data,
	} = await import(
		`${import.meta.dirname}/data/${
			version
		}/Docs/${
			docs_filename(version, lang)
		}`,
		{
			with: {
				type: 'json',
			},
		},
	) as {
		default: unknown,
	};

	const generation_factory: by_version[
		Version
	]['generation_factory'] = (
		await import(

			// oxlint-disable-next-line @stylistic/max-len
			`@satisfactory-dev/docs.json.ts/src/version-specific/${
				version
			}/generation_factory.js`,
		) as {
			generation_factory: by_version[
				Version
			]['generation_factory'],
		}
	).generation_factory;

	await generation_factory(
		release_data,
		lang as 'en-US', // typescript being weird
		{
			types: false,
			data: true,
		},
		{
			alternate_source: (
				`@satisfactory-dev/docs.json.ts/generated-types/${
					version
				}/`
			),
			root_directory: `${import.meta.dirname}/`,
		},
	);
}

await handle(maybe_semver);
