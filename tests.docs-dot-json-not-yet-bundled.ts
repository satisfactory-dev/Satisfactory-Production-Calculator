import {
	tap,
} from 'node:test/reporters';
import {
	run,
} from 'node:test';
import {
	glob,
} from 'glob';
import {
	__dirname_from_meta,
} from '@satisfactory-clips-archive/docs.json.ts/lib/__dirname';

const __dirname = __dirname_from_meta(import.meta);

const ac = new AbortController();

let already_stopped = false;

run({
	files: (await glob(`${__dirname}/tests/**/*.spec.ts`)).filter(
		maybe => (
			!maybe.includes('production-ingredients-request.spec.ts')
			&& !maybe.includes('production-chain.spec.ts')
			&& !maybe.includes('planner-request.spec.ts')
			&& !maybe.includes('Numbers.spec.ts')
		)
	),
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
