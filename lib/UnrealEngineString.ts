import {
	is_string,
} from '@satisfactory-dev/predicates.ts';
import {
	NoMatchError,
} from '@satisfactory-dev/docs.json.ts/lib/index';
import {
	UnrealEngineString,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/update8/utils/validators';
import assert from 'assert';

export type UnrealEngineString_right_x_C_suffix =
	`${'Desc'|'BP'|'Foundation'|'Recipe'|'SC'|'Build'}_${string}_C`;

const UnrealEngineString_right_x_C_suffix_regex_prefixes =
	'(?:Desc|BP|Foundation|Recipe|SC|Build)'

const UnrealEngineString_right_x_C_suffix_regex = new RegExp(
	`^${UnrealEngineString_right_x_C_suffix_regex_prefixes}_[^.]+_C$`,
);

export function filter_UnrealEngineString_right_x_C_suffix(
	maybe:unknown,
): maybe is UnrealEngineString_right_x_C_suffix {
	return (
		is_string(maybe)
		&& UnrealEngineString_right_x_C_suffix_regex.test(maybe)
	);
}

const UnrealEngineString_right_x_C_suffix_extraction_regex = new RegExp(
	`^(?:\\/[^\\/]+)+\\/(${
		UnrealEngineString_right_x_C_suffix_regex_prefixes
	}_[^.]+)\\.((${
		UnrealEngineString_right_x_C_suffix_regex_prefixes
	}_[^.]+)_C)$`);

export function is_UnrealEngineString_right(
	maybe: unknown,
): maybe is UnrealEngineString['right'] {
	return (
		is_string(maybe)
		&& UnrealEngineString_right_x_C_suffix_extraction_regex.test(
			maybe,
		)
	);
}

export function UnrealEngineString_right_x_C_suffix(
	value:UnrealEngineString,
) : UnrealEngineString_right_x_C_suffix {
	const maybe_match =
		UnrealEngineString_right_x_C_suffix_extraction_regex.exec(
			value.right,
		);

	assert.notStrictEqual(maybe_match, null, new NoMatchError(
		value,
		'UnrealEngineString contains unsupported value!',
	));

	const match = maybe_match as RegExpExecArray;

	assert.strictEqual(
		match[1].toLowerCase(),
		match[3].toLowerCase(),
		new NoMatchError(
			{
				value,
				first: match[1],
				second: match[3],
			},
			'UnrealEngineString mismatched suffix!',
		),
	);

	return match[2] as UnrealEngineString_right_x_C_suffix;
}
