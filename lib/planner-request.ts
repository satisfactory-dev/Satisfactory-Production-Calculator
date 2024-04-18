import Ajv, {
	SchemaObject,
	ValidateFunction,
} from 'ajv/dist/2020';
import {
	NoMatchError,
} from '../Docs.json.ts/lib/Exceptions';
import {
	UnrealEngineString,
} from '../generated-types/update8/utils/validators';
import assert from 'node:assert/strict';
import {
	is_string,
} from '../Docs.json.ts/lib/StringStartsWith';

export type UnrealEngineString_right_x_C_suffix =
	`${'Desc'|'BP'|'Foundation'}_${string}_C`;

const UnrealEngineString_right_x_C_suffix_regex_prefixes =
	'(?:Desc|BP|Foundation)'

const UnrealEngineString_right_x_C_suffix_regex = new RegExp(
	`^${UnrealEngineString_right_x_C_suffix_regex_prefixes}_[^.]+_C$`
);

export function filter_UnrealEngineString_right_x_C_suffix(
	maybe:unknown
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

export function UnrealEngineString_right_x_C_suffix(
	value:UnrealEngineString
) : UnrealEngineString_right_x_C_suffix {
	const maybe_match =
		UnrealEngineString_right_x_C_suffix_extraction_regex.exec(
			value.right
		);

	assert.notEqual(maybe_match, null, new NoMatchError(
		value,
		'UnrealEngineString contains unsupported value!'
	));

	const match = maybe_match as RegExpExecArray;

	assert.equal(
		match[1].toLowerCase(),
		match[3].toLowerCase(),
		new NoMatchError(
			{
				value,
				first: match[1],
				second: match[3],
			},
			'UnrealEngineString mismatched suffix!'
		)
	);

	return match[2] as UnrealEngineString_right_x_C_suffix;
}

export abstract class PlannerRequest<
	Data = unknown,
	Result = unknown
> {
	protected readonly check:ValidateFunction<Data>;

	constructor(ajv:Ajv, schema:SchemaObject)
	{
		this.check = ajv.compile<Data>(schema);
	}

	calculate(data:unknown): Result
	{
		return this.calculate_validated(this.validate(data));
	}

	validate(data:unknown): Data
	{
		if (!this.check(data)) {
			throw new NoMatchError(
				{
					data,
					errors: this.check.errors,
				},
				'Data not a supported request!'
			);
		}

		return data;
	}

	protected abstract calculate_validated(data:Data): Result;
}
