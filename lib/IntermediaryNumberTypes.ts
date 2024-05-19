import BigNumber from "bignumber.js";
import Fraction from "fraction.js";

import {
	numeric_string,
} from './NumberStrings';

export type IntermediaryNumber_input_types =
	| BigNumber
	| Fraction
	| number
	| string;

export type IntermediaryNumber_value_types =
	| BigNumber
	| Fraction
	| numeric_string;

export type IntermediaryNumber_type_types =
	| 'BigNumber'
	| 'Fraction'
	| 'amount_string'
	| 'numeric_string';
