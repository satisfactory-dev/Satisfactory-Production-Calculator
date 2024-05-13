import assert from 'assert';
import {
	ValidateFunction,
} from 'ajv/dist/2020';
import production_ingredients_request_validator from
	'../validator/production_ingredients_request_schema.mjs';
import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions.js';
import {
	amount_string,
	number_arg,
	Numbers,
} from './Numbers';
import {
	PlannerRequest,
	UnrealEngineString_right_x_C_suffix,
} from './planner-request';
import BigNumber from 'bignumber.js';
import Fraction from 'fraction.js';
import {
	not_undefined,
} from '@satisfactory-clips-archive/docs.json.ts/assert/CustomAssert';
import {
	require_non_empty_array,
} from '@satisfactory-clips-archive/docs.json.ts/lib/ArrayUtilities';
import {
	ammo,
	biomass,
	buildings,
	consumable,
	equipment,
	fuel_nuclear,
	items,
	known_byproduct,
	known_not_sourced_from_recipe,
	poles,
	production_item,
	production_set,
	recipe_selection,
	recipes,
	resources,
	vehicles,
} from './production-data';
import {
	faux_recipe,
} from './faux-recipe';
import {
	amend_ItemClass_amount,
} from './amend-itemclass-amount';
import {
	Root,
} from './production-chain';

export type production_ingredients_request = {
	input?: recipe_ingredients_request_output<amount_string>[],
	recipe_selection?: recipe_selection,
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: number_arg,
	}[],
};

export type recipe_ingredients_request_ingredient<
T extends amount_string|BigNumber = amount_string
> = {
	item: keyof typeof items,
	amount: T,
};
export type recipe_ingredients_request_output<
	T extends amount_string|BigNumber = amount_string
> = {
	item: production_item,
	amount: T,
};

export type production_ingredients_request_result_surplus<
	T extends amount_string|BigNumber = amount_string
> = [
	recipe_ingredients_request_output<T>,
	...recipe_ingredients_request_output<T>[],
];

export type combined_production_entry<
	T extends amount_string|BigNumber = amount_string
> = {
	item: production_item,
	output: T,
	surplus: T,
};

export type production_ingredients_request_result<
	T extends amount_string|BigNumber = amount_string
> = {
	ingredients: recipe_ingredients_request_ingredient<T>[],
	output: recipe_ingredients_request_output<T>[],
	combined: combined_production_entry<T>[],
	surplus?: production_ingredients_request_result_surplus<T>,
};

export class ProductionIngredientsRequest extends PlannerRequest<
	production_ingredients_request,
	production_ingredients_request_result
> {
	private input:production_set = {};

	constructor()
	{
		super(
			production_ingredients_request_validator as ValidateFunction<
				production_ingredients_request
			>
		);
	}

	protected calculate_precisely(
		data:production_ingredients_request,
		surplus?:recipe_ingredients_request_output<BigNumber>[]
	): production_ingredients_request_result<BigNumber> {
		const ingredients:{
			[key in keyof typeof items]: BigNumber;
		} = {};
		const input:{[key: string]: BigNumber} = {
			...this.input,
		};
		for (const entry of (surplus || data.input || [])) {
			if (!(entry.item in input)) {
				input[entry.item as keyof typeof input] = BigNumber(0);
			}

			input[entry.item] = input[entry.item].plus(entry.amount);
		}
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: BigNumber;
		} = {};

		for (const entry of data.pool) {
			const {item: production, amount:output_amount} = entry;
			let {amount} = entry;
			let amount_from_input = BigNumber(0);

			if (production in input) {
				if (input[production].isLessThan(amount)) {
					amount_from_input = input[production].minus(0);
					amount = BigNumber(amount).minus(amount_from_input);
				} else {
					amount_from_input = BigNumber(output_amount);
					amount = BigNumber(0);
				}
			}

			output[production] = amount_from_input;

			if (BigNumber(amount).isLessThan(0.0000001)) {
				continue;
			}

			const recipe = (
				data.recipe_selection && production in data.recipe_selection
					? data.recipe_selection[production]
					: recipe_selection_schema.properties[production].default
			);

			if (undefined === recipes[recipe]) {
				if (
					/^Recipe_--faux--Build_.+_C--Desc_.+_C--\d+(?:\.\d+)?--_C$/
						.test(recipe)
				) {
					const faux_result = faux_recipe(recipe);

					assert.strictEqual(
						(
							production in items
							|| production in resources
						),
						true,
						new NoMatchError(
							{
								recipe,
								expected: production,
							},
							`Supported ingredient found but missing production item (${production})!`
						)
					);

					for (const entry of Object.entries(faux_result)) {
						const [faux_ingredient, faux_amount] = entry;

						if (!(faux_ingredient in ingredients)) {
							ingredients[faux_ingredient] = BigNumber(0);
						}

						ingredients[faux_ingredient] = Numbers.append_multiply(
							ingredients[faux_ingredient],
							faux_amount,
							amount
						);
					}

					output[
						production as keyof typeof resources
					] = Numbers.append_multiply(
						output[production as keyof typeof resources],
						1,
						amount
					);

					continue;
				}

				assert.strictEqual(
					recipe.startsWith('Build_'),
					true,
					new NoMatchError(
						{
							production,
							amount,
							recipe,
						},
						'Expecting to find a building recipe!'
					)
				);

				assert.strictEqual(
					production in resources,
					true,
					new NoMatchError(
						{
							recipe,
							expected: production,
						},
						`Supported ingredient found but missing item!`
					)
				);

				output[
					production as keyof typeof resources
				] = Numbers.append_multiply(
					output[production as keyof typeof resources],
					1,
					amount
				);

				continue;
			}

			const {
				mIngredients,
				mProduct,
			} = recipes[recipe];

			const ingredient_amounts = mIngredients.map(
				e => amend_ItemClass_amount(
					e
				).Amount
			);

			const mapped_product_amounts = Object.fromEntries(mProduct.map(
				(e): [string, number_arg] => [
					UnrealEngineString_right_x_C_suffix(e.ItemClass),
					amend_ItemClass_amount(
						e
					).Amount,
				]
			));

			assert.strictEqual(
				production in mapped_product_amounts,
				true,
				new NoMatchError(
					{
						production,
						mapped_product_amounts,
					},
					'Production item not found in mapped product amounts!'
				)
			);

			const product_amounts = Object.values(mapped_product_amounts);

			const amounts = [
				...ingredient_amounts,
				...product_amounts,
			];

			assert.strictEqual(
				amounts.length >= 2,
				true,
				new NoMatchError(
					{
						amounts,
					},
					'Expected at least two numbers!'
				)
			);

			let divisor = Numbers.least_common_multiple(
				[
					...product_amounts,
				] as [number_arg, number_arg, ...number_arg[]]
			);

			const divisor_pre_adjustment = divisor;

			divisor = Numbers.fraction_to_BigNumber(
				(new Fraction(divisor_pre_adjustment.toString())).div(
					(new Fraction(1)).div(
						(
							new Fraction(
								mapped_product_amounts[production].toString()
							)
						).div(divisor_pre_adjustment.toString())
					)
				)
			);

			for (const ingredient of mIngredients) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					ingredient.ItemClass
				);

				assert.strictEqual(
					(
						Desc_C in ammo
						|| Desc_C in biomass
						|| Desc_C in consumable
						|| Desc_C in equipment
						|| Desc_C in items
						|| Desc_C in resources
					),
					true,
					new NoMatchError(
						{
							recipe,
							ingredient: ingredient.ItemClass.right,
							expected: Desc_C,
						},
						`Supported ingredient found (${Desc_C}) but missing item!`
					)
				);

				if (!(Desc_C in ingredients)) {
					ingredients[Desc_C] = BigNumber(0);
				}

				ingredients[Desc_C] = Numbers.append_multiply(
					ingredients[Desc_C],
					BigNumber(
						amend_ItemClass_amount(
							ingredient
						).Amount
					).dividedBy(
						divisor
					),
					amount
				);
			}

			for (const product of mProduct) {
				const Desc_C = UnrealEngineString_right_x_C_suffix(
					product.ItemClass
				);

				assert.strictEqual(
					(
						Desc_C in ammo
						|| Desc_C in biomass
						|| Desc_C in buildings
						|| Desc_C in consumable
						|| Desc_C in equipment
						|| Desc_C in fuel_nuclear
						|| Desc_C in items
						|| Desc_C in poles
						|| Desc_C in resources
						|| Desc_C in vehicles
					),
					true,
					new NoMatchError(
						{
							recipe,
							product: product.ItemClass.right,
							expected: Desc_C,
						},
						`Supported product found (${Desc_C}) but missing item!`
					)
				);

				if (!(Desc_C in output)) {
					output[Desc_C] = BigNumber(0);
				}

				output[Desc_C] = Numbers.append_multiply(
					output[Desc_C],
					BigNumber(
						amend_ItemClass_amount(
							product
						).Amount
					).dividedBy(
						divisor
					),
					amount
				);
			}
		}

		const surplus_entries = Object.entries(input).map(e => {
			return {
				item: e[0],
				amount: e[1]
					.minus(ingredients[e[0]] || 0)
					.minus(output[e[0]] || 0),
			};
		}).filter(maybe => maybe.amount.isGreaterThan(0));

		const output_entries = Object.entries(output).map(e => {
			return {
				item: e[0],
				amount: e[1],
			};
		});

		const combined = output_entries.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = {
						item: is.item,
						output: BigNumber(0),
						surplus: BigNumber(0),
					}
				}

				was[is.item].output = was[is.item].output.plus(
					is.amount
				);

				return was;
			},
			surplus_entries.reduce(
				(was, is) => {
					if (!(is.item in was)) {
						was[is.item] = {
							item: is.item,
							output: BigNumber(0),
							surplus: BigNumber(0),
						}
					}

					was[is.item].surplus = was[is.item].surplus.plus(
						is.amount
					);

					return was;
				},
				{} as {
					[key in production_item]: {
						item: production_item,
						output: BigNumber,
						surplus: BigNumber,
					}
				}
			)
		);

		const result:production_ingredients_request_result<BigNumber> = {
			ingredients: Object.entries(ingredients).map(e => {
				return {
					item: e[0],
					amount: BigNumber.max(0, e[1].minus(input[e[0]] || 0)),
				};
			}).filter(maybe => maybe.amount.isGreaterThan(0)),
			output: output_entries,
			combined: Object.values(combined),
		};

		if (surplus_entries.length > 0) {
			result.surplus = require_non_empty_array(surplus_entries);
		}

		return result;
	}

	protected calculate_validated(
		data:production_ingredients_request
	): production_ingredients_request_result {
		const initial_result = this.calculate_precisely(data);
		const results = [initial_result];
		let surplus:recipe_ingredients_request_output<
			BigNumber
		>[] = initial_result.surplus || [];

		let checking_recursively = initial_result.ingredients.filter(
			maybe => !(maybe.item in resources)
		);
		const avoid_checking_further = new Set<string>();

		const production_items = Object.fromEntries(
			data.pool.map(e => [e.item, e.amount])
		);

		while (checking_recursively.length > 0) {
			const when_done:recipe_ingredients_request_ingredient<
				BigNumber
			>[] = [];

			for (const check_deeper of checking_recursively) {
				assert.strictEqual(
					(
						check_deeper.item in recipe_selection_schema[
							'properties'
						]
						|| known_not_sourced_from_recipe.includes(
							check_deeper.item
						)
						|| known_byproduct.includes(
							check_deeper.item
						)
					),
					true,
					new NoMatchError(
						check_deeper.item,
						`Item (${check_deeper.item}) not found in recipe selection!`
					)
				);

				if (
					known_not_sourced_from_recipe.includes(
						check_deeper.item
					)
					|| known_byproduct.includes(
						check_deeper.item
					)
				) {
					continue;
				}

				let possibly_recursive = false;
				let recursive_multiplier = BigNumber(1);

				if (check_deeper.item in production_items) {
					possibly_recursive = Root.is_recursive(
						check_deeper.item,
						data.recipe_selection || {}
					);

					if (possibly_recursive) {
						const lcm = Numbers.least_common_multiple([
							production_items[check_deeper.item],
							check_deeper.amount,
						]).toString();
						const a = Numbers.fraction_to_BigNumber((
							new Fraction(
								production_items[check_deeper.item].toString()
							)
						).div(lcm))
						const b = Numbers.fraction_to_BigNumber((
							new Fraction(
								check_deeper.amount.toString()
							)
						).div(lcm));
						recursive_multiplier = Numbers.sum_series(
							BigNumber(a),
							BigNumber(b)
						);

						avoid_checking_further.add(check_deeper.item);
					}
				}

				const deeper_result = this.calculate_precisely(
					{
						...data,
						pool: [{
							item: (
								check_deeper.item as keyof (
									typeof recipe_selection_schema[
										'properties'
									]
								)
							),
							amount: check_deeper.amount.times(
								recursive_multiplier
							),
						}],
					},
					surplus
				);
				surplus = deeper_result.surplus || [];

				const self_output = deeper_result.output.find(
					maybe => maybe.item === check_deeper.item
				);

				not_undefined(self_output);

				self_output.amount = self_output.amount.minus(
					check_deeper.amount
				);

				const maybe_check_further = deeper_result.ingredients.filter(
					maybe => (
						!(maybe.item in resources)
						&& !avoid_checking_further.has(maybe.item)
					)
				);

				if (maybe_check_further.length) {
					when_done.push(...maybe_check_further);
				}

				results.push(deeper_result);
			}

			checking_recursively = when_done;
		}

		const ingredients:{[key: string]: BigNumber} = {};
		const output:{[key: string]: BigNumber} = {};
		const surplus_map = surplus.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = BigNumber(0);
				}

				was[is.item] = was[is.item].plus(is.amount);

				return was;
			},
			{} as {[key: string]: BigNumber}
		);

		for (const entry of results) {
			for (const ingredient of entry.ingredients) {
				if (!(ingredient.item in ingredients)) {
					ingredients[ingredient.item] = ingredient.amount;
				} else {
					ingredients[
						ingredient.item
					] = ingredients[ingredient.item].plus(
						ingredient.amount
					);
				}
			}

			for (const output_entry of entry.output) {
				if (!(output_entry.item in output)) {
					output[output_entry.item] = output_entry.amount;
				} else {
					output[
						output_entry.item
					] = output[output_entry.item].plus(
						output_entry.amount
					);
				}
			}
		}

		const production_map = data.pool.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = BigNumber(0);
				}

				was[is.item] = was[is.item].plus(is.amount);

				return was;
			},
			{} as {[key: string]: BigNumber}
		);

		for (const entry of Object.entries(production_map)) {
			assert.strictEqual(
				entry[0] in output,
				true,
				`${entry[0]} not on output map!`
			);

			if (output[entry[0]].isGreaterThan(entry[1])) {
				if (!(entry[0] in surplus_map)) {
					surplus_map[entry[0]] = BigNumber(0);
				}

				surplus_map[entry[0]] = surplus_map[entry[0]].plus(
					output[entry[0]].minus(entry[1])
				);

				output[entry[0]] = entry[1];
			}
		}

		const output_entries = Object.entries(output);
		const negative_outputs = output_entries.filter(
			maybe => maybe[1].isLessThan(0)
		);

		for (const entry of negative_outputs) {
			if (!(entry[0] in ingredients)) {
				ingredients[entry[0]] = BigNumber(0);
			}

			ingredients[entry[0]] = ingredients[entry[0]].plus(
				entry[1].abs()
			);
		}

		const output_entries_filtered = output_entries.filter(
			maybe => maybe[1].isGreaterThan(0)
		).map(e => {
			return {
				item: e[0],
				amount: e[1],
			};
		});

		const surplus_filtered = Object.entries(surplus_map).filter(
			maybe => maybe[1].isGreaterThan(0)
		).map(e => {
			return {
				item: e[0],
				amount: e[1],
			};
		});

		const combined = output_entries_filtered.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = {
						item: is.item,
						output: BigNumber(0),
						surplus: BigNumber(0),
					}
				}

				was[is.item].output = was[is.item].output.plus(
					is.amount
				);

				return was;
			},
			surplus_filtered.reduce(
				(was, is) => {
					if (!(is.item in was)) {
						was[is.item] = {
							item: is.item,
							output: BigNumber(0),
							surplus: BigNumber(0),
						}
					}

					was[is.item].surplus = was[is.item].surplus.plus(
						is.amount
					);

					return was;
				},
				{} as {
					[key in production_item]: {
						item: production_item,
						output: BigNumber,
						surplus: BigNumber,
					}
				}
			)
		);

		const result:production_ingredients_request_result = {
			ingredients: Object.entries(ingredients).map(e => {
				return {
					item: e[0],
					amount: Numbers.round_off(e[1]),
				}
			}),
			output: output_entries_filtered.map(e => {
				return {
					item: e.item,
					amount: Numbers.round_off(e.amount),
				}
			}).filter(maybe => '0' !== maybe.amount),
			combined: Object.values(combined).map(e => {
				return {
					item: e.item,
					output: Numbers.round_off(e.output),
					surplus: Numbers.round_off(e.surplus),
				}
			}),
		};

		if (surplus_filtered.length > 0) {
			result.surplus = require_non_empty_array(
				surplus_filtered.map(e => {
					return {
						item: e.item,
						amount: Numbers.round_off(e.amount),
					};
				})
			);
		}

		return result;
	}
}
