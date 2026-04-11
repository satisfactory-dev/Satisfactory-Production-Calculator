import type {
	hasClassName,
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/Base.ts';

import type {
	update8_docs,
} from '@satisfactory-dev/docs.json.ts/generated-types/0.8.3.3/types';

import type {
	NativeClass__type,
} from '../../production-data/types';

export function find<
	T0 extends hasClassName,
	T1 extends `FG${string}`,
>(
	NativeClassName: T1,
	from: update8_docs,
): NativeClass__type<
	typeof NativeClassName,
	T0
> {
	const maybe = (
		from as NativeClass__type<`FG${string}`, hasClassName>[]
	).find((
		maybe,
	): maybe is NativeClass__type<
		T1,
		T0
	> => (
		maybe.NativeClass === `/Script/CoreUObject.Class'/Script/FactoryGame.${
			NativeClassName
		}'`
	));

	if (!maybe) {
		throw new Error(`Could not find ${NativeClassName}`);
	}

	return maybe;
}
