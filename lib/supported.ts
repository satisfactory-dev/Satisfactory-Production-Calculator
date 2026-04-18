import type {
	is_supported as is_supported_lang__update3,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/0.3.7.7/supported_lang.js';

import type {
	update8_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/0.8.3.3/types.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__update8,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--0.8.3.3.js';

import type {
	generation_factory as factory__update8,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/0.8.3.3/generation_factory.js';

import type {
	release_1_0_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0.1.4/types.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__v1p0,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--1.0.1.4.js';

import type {
	generation_factory as factory__v1p0,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.0.1.4/generation_factory.js';

import type {
	is_supported as is_supported_lang__v1p0,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.0.1.4/supported_lang.js';

import type {
	release_1_1_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1.2.2/types.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__v1p1,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--1.1.2.2.js';

import type {
	generation_factory as factory__v1p1,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.1.2.2/generation_factory.js';

import type {
	is_supported as is_supported_lang__v1p1,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.1.2.2/supported_lang.js';

import type {
	release_1_2_1_0_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/1.2.1.0/types.js';

import type {
	ItemClass_Amount_list_item as ItemClass_Amount_list_item__v1p2,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/0.3.7.7/types/overridable--1.2.0.0.js';

import type {
	generation_factory as factory__v1p2,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.2.1.0/generation_factory.js';

import type {
	is_supported as is_supported_lang__v1p2,

// oxlint-disable-next-line @stylistic/max-len
} from '@satisfactory-dev/docs.json.ts/src/version-specific/1.2.0.0/supported_lang.js';

import type {
	ProductionData,
} from './production-data.ts';

import type {
	update8_data,
	update8_imports,
	version_1p0_data,
	version_1p0_imports,
	version_1p1_data,
	version_1p1_imports,
	version_1p2_data,
	version_1p2_imports,
} from './production-data/types.ts';

type by_version = {
	'0.8.3.3': {
		imports: update8_imports,
		data: update8_data,
		ProductionData: ProductionData<'0.8.3.3'>,
		ItemClass_Amount_list_item: ItemClass_Amount_list_item__update8,
		docs: update8_docs,
		is_supported_lang: typeof is_supported_lang__update3,
		generation_factory: typeof factory__update8,
	},
	'1.0.1.4': {
		imports: version_1p0_imports,
		data: version_1p0_data,
		ProductionData: ProductionData<'1.0.1.4'>,
		ItemClass_Amount_list_item: ItemClass_Amount_list_item__v1p0,
		docs: release_1_0_docs,
		is_supported_lang: typeof is_supported_lang__v1p0,
		generation_factory: typeof factory__v1p0,
	},
	'1.1.2.2': {
		imports: version_1p1_imports,
		data: version_1p1_data,
		ProductionData: ProductionData<'1.1.2.2'>,
		ItemClass_Amount_list_item: ItemClass_Amount_list_item__v1p1,
		docs: release_1_1_docs,
		is_supported_lang: typeof is_supported_lang__v1p1,
		generation_factory: typeof factory__v1p1,
	},
	'1.2.1.0': {
		imports: version_1p2_imports,
		data: version_1p2_data,
		ProductionData: ProductionData<'1.2.1.0'>,
		ItemClass_Amount_list_item: ItemClass_Amount_list_item__v1p2,
		docs: release_1_2_1_0_docs,
		is_supported_lang: typeof is_supported_lang__v1p2,
		generation_factory: typeof factory__v1p2,
	},
};

type supported_versions = keyof by_version;

const supported_semver: supported_versions[] = [
	'0.8.3.3',
	'1.0.1.4',
	'1.1.2.2',
	'1.2.1.0',
];

const is_supported_from: {
	[key in supported_versions]: (
		| supported_versions
		| '0.3.7.7'
		| '1.2.0.0'
	);
} = Object.freeze({
	'0.8.3.3': '0.3.7.7',
	'1.0.1.4': '1.0.1.4',
	'1.1.2.2': '1.1.2.2',
	'1.2.1.0': '1.2.0.0',
});

function is_supported_semver(
	maybe: unknown,
): asserts maybe is supported_versions {
	if (!(supported_semver as unknown[]).includes(maybe)) {
		throw new Error(`Unsupported semver specified!`);
	}
}

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

export type {
	by_version,
	supported_versions,
};

export {
	is_supported_from,
	is_supported_semver,
	docs_filename,
};
