import {
	existsSync,
} from 'node:fs';
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';

const __dirname = __dirname_from_meta(import.meta);

export const skip_because_docs_dot_json_not_yet_bundled = {
	skip:
		existsSync(`${__dirname}/../data/Docs.json`)
			? false
			: 'Docs.json not yet bundled!',
};
