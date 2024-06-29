import {
	tap,
} from 'node:test/reporters';
import {
	run,
} from 'node:test';
import {
	glob,
} from 'glob';

const __dirname = import.meta.dirname;

const ac = new AbortController();

const [,, from_args] = process.argv;

const all_tests = await glob(`${__dirname}/tests/**/*.spec.ts`);

const files = (from_args || '').split(' ').filter(
	maybe => maybe.startsWith('tests/') && maybe.endsWith('.spec.ts')
).map(e => `${__dirname}/${e}`).filter(
	maybe => all_tests.includes(maybe)
);

let already_stopped = false;

run({
	files,
	concurrency: true,
	signal: ac.signal,
})
	.on('test:fail', (e) => {
		ac.abort();
		if (!already_stopped) {
			console.error(e);
		}
		already_stopped = true;
		process.exitCode = 1;
	})
	.compose(tap)
	.pipe(process.stdout);
