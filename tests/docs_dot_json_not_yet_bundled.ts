import {
	existsSync,
} from 'node:fs';

export const skip_because_docs_dot_json_not_yet_bundled = {
	skip:
		existsSync(`${import.meta.dirname}/../data/Docs.json`)
			? false
			: 'Docs.json not yet bundled!',
};
