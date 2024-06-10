import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	TokenScan,
} from '../../lib/TokenScan';
import {
	expand_fraction_string,
	expand_ignore_characters,
	from_string_data_set,
	random_ignore_string,
} from '../utilities/expand-string-parsing';
import {
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';
import {
	DeferredCalculation,
} from '../../lib/IntermediaryNumber';

const from_string_data_sets:from_string_data_set[] = [
	[
		'1',
		'IntermediaryNumber',
		'amount_string',
		'1',
	],
	[
		'1.2r',
		'IntermediaryNumber',
		'Fraction',
		'1.(2)',
	],
	...expand_fraction_string('1.1(23)'),
	...expand_ignore_characters([
		'1.1(23) + 1',
		'DeferredCalculation',
		'Fraction + amount_string',
		'2.1(23)',
	]),
	...expand_ignore_characters([
		'1.1(23) + 1 + 2',
		'DeferredCalculation',
		'IntermediaryCalculation + amount_string',
		'4.1(23)',
	]),
	...expand_ignore_characters([
		'1.1(23) + 1 * 2',
		'DeferredCalculation',
		'IntermediaryCalculation * amount_string',
		'4.2(46)',
	]),
	...expand_ignore_characters([
		'1.1(23) + (1 * 2)',
		'DeferredCalculation',
		'Fraction + IntermediaryCalculation',
		'3.1(23)',
	]),
	...expand_ignore_characters([
		'(1.1(23) + 1) * 2',
		'DeferredCalculation',
		'IntermediaryCalculation * amount_string',
		'4.2(46)',
	]),
	...expand_ignore_characters([
		'1 + 2 * 3 / 4 % 5 - 6 + 7 * 8 / 9',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'2.(8)',
	]),
	...expand_ignore_characters([
		'.1 - .2 + .3 * .4 / .5',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'0.16',
	]),
	...expand_ignore_characters([
		'3 x 5 % 9',
		'DeferredCalculation',
		'IntermediaryCalculation % amount_string',
		'6',
	]),
	...expand_ignore_characters([
		'1 + (2/3)',
		'DeferredCalculation',
		'amount_string + IntermediaryCalculation',
		'1.(6)',
	]),
	...expand_ignore_characters([
		'1 + 2',
		'DeferredCalculation',
		'amount_string + amount_string',
		'3',
	]),
	...expand_ignore_characters([
		'( ( 46.53r ) x ( 3 ) ) - ( 0 )',
		'DeferredCalculation',
		'IntermediaryCalculation - amount_string',
		'139.6',
	]),
	...expand_ignore_characters([
		'(((120 * .972322) * 3)+((120 * 1) * 1))/3',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'156.67864',
	]),
	...expand_ignore_characters([
		'(((120*.972322) * 3)+120)/3',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'156.67864',
	]),
	[
		'((((120 			   	*		 		  	   		 	 	 		  			   							 	 		  						.972322)	 		 		 		   	    	   	 	    		    		  	  			  	 					   	 	 	* 	  		  	   	  		 		 	 			 	   	3)+((120	  	  	 		  	 	 		  		 	 	 	 		  	  		  	 		 	 	   	 						   	 *				   	 			 	 	 		    1)			 	   	  			  	 				 	*					 			1))/3)',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'156.67864',
	],
	[
		'((((120  			  						  	      	  	 	  			 	 				  			  		*  	 			 			 		 				  	 	  	.972322)      		 				  	  			    		  	   	    		  	   	 	     	 		 			 	 		  			   		 		 	 	  		      	 	*	  			   	   	 	   			  	 	  	 	  		 	 	3)+((120				 							 	 			 	* 	  			     			  	    	   	 					   	  	 	1) 					 				    			 		  		 		  	 		 	  				 	   	  * 		 			  				 		 	     	     	  						 			   	  	 		      		  			 		 	  		 		   			 	          		 	1))/3)',
		'DeferredCalculation',
		'IntermediaryCalculation / amount_string',
		'156.67864',
	],
];

const from_string_data_sets_throwing:[
	string,
][] = [
	[''],
	['()'],
	['( )'],
	['(\t)'],
	['11 * ()'],
];

void describe('TokenScan', () => {
	void describe('parse', () => {
		for (const [
			input,
		] of from_string_data_sets_throwing) {
			void it(
				`(new TokenScan(${
					JSON.stringify(input)
				})).parse() throws`,
				() => {
					assert.throws(() => (new TokenScan(input)).parse());
				}
			)
		}

		for (const [
			raw_input_string,
			expected_result_type,
			expected_type_info,
			expected_result_string,
		] of from_string_data_sets) {
			for (const input_string of [
				raw_input_string,
				`${random_ignore_string()}${raw_input_string}`,
				`${raw_input_string}${random_ignore_string()}`,
				`${random_ignore_string()}${raw_input_string}${random_ignore_string()}`,
			]) {
				if (undefined === expected_result_type) {
					void it(
						`(new TokenScan(${
							JSON.stringify(input_string)
						})).parse() throws`,
						() => {
							assert.throws(
								() => (new TokenScan(input_string)).parse()
							);
						}
					)
				} else {
					not_undefined(expected_type_info);
					void it(
						`(new TokenScan(${
							JSON.stringify(input_string)
						})).parse() behaves`,
						() => {
							const result = (
								new TokenScan(input_string)
							).parse();
							assert.strictEqual(
								result.constructor.name,
								expected_result_type
							);

							assert.strictEqual(
								(result instanceof DeferredCalculation)
									? result.toIntermediaryCalculation().resolve_type
									: result.resolve_type,
								expected_type_info
							);

							assert.strictEqual(
								result.toString(),
								expected_result_string
							);
						}
					)
				}
			}
		}
	})
})
