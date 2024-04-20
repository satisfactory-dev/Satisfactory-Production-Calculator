import assert from 'node:assert/strict';
import {
	is_string,
} from './Docs.json.ts/lib/StringStartsWith';
import {
	FGBuildingDescriptor,
} from './generated-types/update8/data/CoreUObject/FGBuildingDescriptor';
import {
	FGItemDescriptor,
} from './generated-types/update8/data/CoreUObject/FGItemDescriptor';
import {
	FGResourceDescriptor,
} from './generated-types/update8/data/CoreUObject/FGResourceDescriptor';
import {
	existsSync,
} from 'node:fs';
import {
	dirname,
} from 'node:path';
import {
	mkdir,
	readFile,
	writeFile,
} from 'node:fs/promises';
import {
	__dirname_from_meta,
} from './Docs.json.ts/lib/__dirname';
import sharp from 'sharp';
import hash_cache from './data/grabbed-textures.json' with {type: 'json'};
import {
	createHash,
} from 'node:crypto';

const __dirname = __dirname_from_meta(import.meta);

const images:string[] = [];

for (const entry of [
	...FGBuildingDescriptor.Classes,
	...FGItemDescriptor.Classes,
	...FGResourceDescriptor.Classes,
]) {
	if ('None' === entry.mPersistentBigIcon) {
		continue;
	}

	assert.equal(
		(
			is_string(entry.mPersistentBigIcon)
			&& entry.mPersistentBigIcon.startsWith('Texture2D /Game/')
			&& /\/([^.]+)\.\1$/.test(entry.mPersistentBigIcon)
		),
		true
	);

	const png = `/textures/${
		(
			entry.mPersistentBigIcon as string
		).substring(16).replace(/\/([^.]+)\.\1$/, '/$1')
	}.png`;

	assert.equal(existsSync(png), true, `${png} does not exist`);

	images.push(png);
}

let progress = 0;

process.stdout.write(`${progress} of ${images.length}`);

for (const png of images) {
	process.stdout.write(`\r${progress} of ${images.length}`);
	const destination = `${
		__dirname
	}/textures/${
		png.substring(10).replace(/\.png$/, '.avif')
	}`;
	const directory = dirname(destination);

	if (!existsSync(directory)) {
		await mkdir(directory, {recursive: true});
	}

	if (existsSync(destination) && png in hash_cache) {
		const cached_hash = (hash_cache as {[key in typeof png]: string})[png];

		const hash = createHash('sha512');
		hash.update(await readFile(png));
		hash.update(await readFile(destination));

		const current_hash = hash.digest('hex');

		if (current_hash === cached_hash) {
			++progress;
			continue;
		}
	}

	await writeFile(destination, await sharp(png).avif({
		quality: 100,
		lossless: true,
		effort: 9,
	}).toBuffer());

	const hash = createHash('sha512');
	hash.update(await readFile(png));
	hash.update(await readFile(destination));

	const current_hash = hash.digest('hex');

	(hash_cache as {[key: string]: string})[png] = current_hash;

	++progress;
}

process.stdout.write(`\r${progress} of ${images.length}\n`);

await writeFile(
	`${__dirname}/data/grabbed-textures.json`,
	`${JSON.stringify(hash_cache, null, '\t')}\n`
);
