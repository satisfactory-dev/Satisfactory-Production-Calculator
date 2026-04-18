import type {
	SupportedLang,
} from '@satisfactory-dev/docs.json.ts/src/Utf16leJsonHandler.ts';

import type {
	by_version,
	supported_versions,
} from '../../lib/supported.ts';
import {
	docs_filename,
} from '../../lib/supported.ts';

import type {
	ProductionData,
} from '../../lib/production-data.ts';

export default async <
	Version extends supported_versions,
>(
	version: Version,
	lang: SupportedLang,
): Promise<by_version[Version]['ProductionData']> => {
	const data: by_version[Version]['docs'] = (
		await import(
			`${import.meta.dirname}/../../generated-types/${version}/${
				docs_filename(version, lang)
					.replace('Docs.', '')
					.replace(/utf8\.json$/, 'data.ts')
			}`,
		) as {
			default: by_version[Version]['docs'],
		}
	).default;

	const factory: (
		docs: by_version[Version]['docs'],
	) => ProductionData<Version> = (
		await import(
			`${import.meta.dirname}/../../lib/version-specific/${
				version
			}/factory.ts`,
		) as {
			default: (
				docs: by_version[Version]['docs'],
			) => ProductionData<Version>,
		}
	).default;

	return factory(data) as by_version[Version]['ProductionData'];
};
