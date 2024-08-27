export function random_ignore_string()
{
	const length = Math.max(
		1,
		Math.min(
			100,
			Math.round(
				Math.random() * 100,
			),
		),
	);

	let result = '';

	for (let index = 0; index < length; ++index) {
		result += Math.random() > .5 ? '\t': ' ';
	}

	return result;
}

export type from_string_data_set = [
	string,
	(
		| 'IntermediaryNumber'
		| 'IntermediaryCalculation'
		| undefined
	),
	string|undefined,
	string|undefined,
]|[
	string,
	(
		| 'IntermediaryNumber'
		| 'IntermediaryCalculation'
	),
	string,
	string,
	string,
];

function expand_nesting(
	input:from_string_data_set,
): [from_string_data_set, ...from_string_data_set[]] {
	const result:[from_string_data_set, ...from_string_data_set[]] = [input];

	const additional_nesting = Math.ceil(Math.random() * 10);

	const [initial, ...remaining] = input;

	result.push([
		`${
			'('.repeat(additional_nesting)
		}${
			initial
		}${
			')'.repeat(additional_nesting)
		}`,
		...remaining,
	]);

	return result;
}

function maybe_expand_whitspace(
	input:from_string_data_set,
): from_string_data_set[] {
	const result:from_string_data_set[] = [];

	const regex = /([\t ]+)/g;

	const [initial, ...remaining] = input;

	if (regex.test(initial)) {
		result.push(...expand_nesting([
			initial.replace(regex, random_ignore_string),
			...remaining,
		]));
	} else {
		result.push(...expand_nesting([
			` ${initial}`.replace(regex, random_ignore_string),
			...remaining,
		]));
		result.push(...expand_nesting([
			`${initial} `.replace(regex, random_ignore_string),
			...remaining,
		]));
	}

	return result;
}

export const regex_has_recursives = (
	/(\d+\.(?:\d*(?:\(\d+\)|\[\d+\])r?)|\d*\.\d+r)/
);

export function expand_ignore_characters(
	input:from_string_data_set,
): [from_string_data_set, ...from_string_data_set[]] {
	const result:[from_string_data_set, ...from_string_data_set[]] = [
		...expand_nesting(input),
		...maybe_expand_whitspace(input),
	];

	const [initial, ...remaining] = input;

	if (regex_has_recursives.test(initial)) {
		result.push(
			...maybe_expand_whitspace([
				initial.replace(regex_has_recursives, ' $1'),
				...remaining,
			]),
			...maybe_expand_whitspace([
				initial.replace(regex_has_recursives, ' $1 '),
				...remaining,
			]),
			...maybe_expand_whitspace([
				initial.replace(regex_has_recursives, '$1 '),
				...remaining,
			]),
		);
	}

	if (/[\t ]/.test(initial)) {
		result.push([
			initial.replace(/[\t ]+/g, ''),
			...remaining,
		]);
	}

	return result;
}

export function expand_fraction_string(
	fraction_string:`${number}.${number}(${number})`,
): [from_string_data_set, ...from_string_data_set[]] {
	return [
		...expand_ignore_characters([
			fraction_string,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			`${fraction_string}r`,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			fraction_string.replace('(', '[').replace(')', ']'),
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
		...expand_ignore_characters([
			`${fraction_string.replace('(', '[').replace(')', ']')}r`,
			'IntermediaryNumber',
			'Fraction',
			fraction_string,
		]),
	];
}
