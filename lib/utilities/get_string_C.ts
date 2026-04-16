
const regex_already_string_C = /^[A-Z][A-Za-z0-9_]+_C$/;
const regex_get_string_C = /\/([^./]+).(\1_C)/i;

export function get_string_C(maybe: string): `${string}_C` {
	if ('/Script/FactoryGame.FGBuildableAutomatedWorkBench' === maybe) {
		return 'Build_WorkBench_C';
	} else if ('/Script/FactoryGame.FGBuildGun' === maybe) {
		return 'BP_BuildGun_C';
	}

	if (regex_already_string_C.test(maybe)) {
		return maybe as `${string}_C`;
	}

	const match = regex_get_string_C.exec(maybe) as unknown as (
		| null
		| [string, string, `${string}_C`]
	);

	if (null === match) {
		throw new Error(`Could not get result from string! (${
			maybe
		})`);
	}

	return match[2];
}

export function has_string_C(maybe: string) {
	if (regex_already_string_C.test(maybe)) {
		return true;
	}

	const match = regex_get_string_C.exec(maybe) as unknown as (
		| null
		| [string, string, `${string}_C`]
	);

	if (null === match) {
		return false;
	}

	return true;
}
