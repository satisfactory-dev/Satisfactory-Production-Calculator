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
	writeFile,
} from 'node:fs/promises';
import {
	__dirname_from_meta,
} from './Docs.json.ts/lib/__dirname';
import sharp from 'sharp';

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

	await writeFile(destination, await sharp(png).avif({
		quality: 100,
		lossless: true,
		effort: 9,
	}).toBuffer());
	++progress;
}

process.stdout.write('\n');
