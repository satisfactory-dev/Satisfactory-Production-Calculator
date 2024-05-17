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
	amend_ItemClass_amount_deferred,
} from './amend-itemclass-amount';
import {
	Root,
} from './production-chain';
import {
	IntermediaryCalculation_operand_types,
	IntermediaryNumber,
} from './IntermediaryNumber';
import Fraction from 'fraction.js';

export type production_ingredients_request<
	T1 extends (
		| amount_string
		| IntermediaryCalculation_operand_types
	) = amount_string,
	T2 extends (
		| number_arg
		| IntermediaryCalculation_operand_types
	) = number_arg
> = {
	input?: recipe_ingredients_request_output<T1>[],
	recipe_selection?: recipe_selection,
	pool: {
		item: keyof typeof recipe_selection_schema['properties'],
		amount: T2,
	}[],
};

export type recipe_ingredients_request_ingredient<
	T extends (
		| amount_string
		| BigNumber
		| IntermediaryCalculation_operand_types
	) = amount_string
> = {
	item: keyof typeof items,
	amount: T,
};
export type recipe_ingredients_request_output<
	T extends (
		| amount_string
		| BigNumber
		| IntermediaryCalculation_operand_types
	) = amount_string
> = {
	item: production_item,
	amount: T,
};

export type production_ingredients_request_result_surplus<
	T extends (
		| amount_string
		| BigNumber
		| IntermediaryCalculation_operand_types
	) = amount_string
> = [
	recipe_ingredients_request_output<T>,
	...recipe_ingredients_request_output<T>[],
];

export type combined_production_entry<
	T extends (
		| amount_string
		| BigNumber
		| IntermediaryCalculation_operand_types
	) = amount_string
> = {
	item: production_item,
	output: T,
	surplus: T,
};

export type production_ingredients_request_result<
	T extends (
		| amount_string
		| BigNumber
		| IntermediaryCalculation_operand_types
	) = amount_string
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
	private input:production_set<
		| IntermediaryCalculation_operand_types
	> = {};

	constructor()
	{
		super(
			production_ingredients_request_validator as ValidateFunction<
				production_ingredients_request
			>
		);
	}

	protected calculate_precisely(
		data:production_ingredients_request<
			(
				| amount_string
				| IntermediaryCalculation_operand_types
			),
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			)
		>,
		surplus?:recipe_ingredients_request_output<
			| IntermediaryCalculation_operand_types
		>[]
	): production_ingredients_request_result<
		| IntermediaryCalculation_operand_types
	> {
		const ingredients:{
			[key in keyof typeof items]: (
				| IntermediaryCalculation_operand_types
			);
		} = {};
		const input:{
			[key: string]: (
				| IntermediaryCalculation_operand_types
			)
		} = {
			...this.input,
		};
		for (const entry of (surplus || data.input || [])) {
			if (!(entry.item in input)) {
				input[
					entry.item as keyof typeof input
				] = IntermediaryNumber.Zero;
			}

			input[entry.item] = input[entry.item].do_math_then_dispose(
				'plus',
				entry.amount
			);
		}
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: IntermediaryCalculation_operand_types;
		} = {};

		for (const entry of data.pool) {
			const {item: production, amount:output_amount} = entry;
			let amount = IntermediaryNumber.reuse_or_create(entry.amount);
			let amount_from_input:(
				| IntermediaryCalculation_operand_types
			) = IntermediaryNumber.Zero;

			if (production in input) {
				if (
					input[production].isLessThan(
						amount.toBigNumber()
					)
				) {
					amount_from_input = input[production];
					amount = amount.do_math_then_dispose(
						'minus',
						amount_from_input
					);
				} else {
					amount_from_input = IntermediaryNumber.reuse_or_create(
						output_amount
					);
					amount = IntermediaryNumber.Zero;
				}
			}

			output[production] = amount_from_input;

			if (amount.isLessThan(0.0000001)) {
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

						const multiplied = amount.times(faux_amount);

						if (!(faux_ingredient in ingredients)) {
							ingredients[
								faux_ingredient
							] = multiplied;
						} else {
						ingredients[
							faux_ingredient
							] = ingredients[faux_ingredient].do_math_then_dispose(
								'plus',
								multiplied
						);
						}
					}

					output[
						production as keyof typeof resources
					] = output[
						production as keyof typeof resources
					].do_math_then_dispose(
						'plus',
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
				] = output[
					production as keyof typeof resources
				].do_math_then_dispose(
					'plus',
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
				(e): [string, (
					| IntermediaryCalculation_operand_types
				)] => [
					UnrealEngineString_right_x_C_suffix(e.ItemClass),
					amend_ItemClass_amount_deferred(
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

			let divisor = Numbers.least_common_multiple_deferred(
				[
					...product_amounts,
				] as [
					(
						| IntermediaryCalculation_operand_types
					),
					(
						| IntermediaryCalculation_operand_types
					),
					...(
						| IntermediaryCalculation_operand_types
					)[],
				]
			);

			const divisor_pre_adjustment = divisor;

			divisor = (
				divisor_pre_adjustment.div(
					(new Fraction(1)).div(
						(
							mapped_product_amounts[production]
						).toFraction().div(divisor_pre_adjustment)
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

				const ammended_amount = amend_ItemClass_amount_deferred(
					ingredient
				).Amount;

				const multiplied = amount.times(
					0 === divisor.compare(1)
						? ammended_amount
						: ammended_amount.divide(divisor)
				);

				if (!(Desc_C in ingredients)) {
					ingredients[Desc_C] = multiplied;
				} else {
					ingredients[Desc_C] = ingredients[
						Desc_C
					].do_math_then_dispose(
						'plus',
						multiplied
					);
				}
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

				const ammended_amount = amend_ItemClass_amount_deferred(
					product
				).Amount;

				const multiplied = amount.times(
					0 === divisor.compare(1)
						? ammended_amount
						: ammended_amount.divide(divisor)
				);

				if (!(Desc_C in output)) {
					output[Desc_C] = multiplied;
				} else {
					output[Desc_C] = output[Desc_C].do_math_then_dispose(
						'plus',
						multiplied
					);
				}
			}
		}

		const surplus_entries = Object.entries(input).map(e => {
			return {
				item: e[0],
				amount: e[1]
					.minus(
						(e[0] in ingredients)
							? (
								ingredients[
									e[0]
								]
							)
							: 0
					)
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
						output: IntermediaryNumber.Zero,
						surplus: IntermediaryNumber.Zero,
					}
				}

				was[is.item].output = was[is.item].output.do_math_then_dispose(
					'plus',
					is.amount
				);

				return was;
			},
			surplus_entries.reduce(
				(was, is) => {
					if (!(is.item in was)) {
						was[is.item] = {
							item: is.item,
							output: IntermediaryNumber.Zero,
							surplus: IntermediaryNumber.Zero,
						}
					}

					was[is.item].surplus = was[
						is.item
					].surplus.do_math_then_dispose(
						'plus',
						is.amount
					);

					return was;
				},
				{} as {
					[key in production_item]: {
						item: production_item,
						output: IntermediaryCalculation_operand_types,
						surplus: IntermediaryCalculation_operand_types,
					}
				}
			)
		);

		const result:production_ingredients_request_result<
			| IntermediaryCalculation_operand_types
		> = {
			ingredients: Object.entries(ingredients).map(e => {
				const left_over = e[1].minus(input[e[0]] || 0);

				return {
					item: e[0],
					amount: (
						left_over.isLessThan(0)
							? IntermediaryNumber.Zero
							: left_over
					),
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
		const deferred = this.calculate_validated_deferred(data);

		const result:production_ingredients_request_result = {
			ingredients: deferred.ingredients.map(
				e => {
					return {
						item: e.item,
						amount: e.amount.toAmountString(),
					};
				}
			),
			output: deferred.output.map(
				e => {
					return {
						item: e.item,
						amount: e.amount.toAmountString(),
					};
				}
			),
			combined: deferred.combined.map(
				e => {
					return {
						item: e.item,
						output: e.output.toAmountString(),
						surplus: e.surplus.toAmountString(),
					};
				}
			),
		};

		if ('surplus' in deferred) {
			not_undefined(deferred.surplus);
			result.surplus = require_non_empty_array(deferred.surplus.map(
				e => {
					return {
						item: e.item,
						amount: e.amount.toAmountString(),
					};
				}
			))
		}

		return result;
	}

	protected calculate_validated_deferred(
		data:production_ingredients_request<
			(
				| amount_string
				| IntermediaryCalculation_operand_types
			),
			(
				| number_arg
				| IntermediaryCalculation_operand_types
			)
		>
	): production_ingredients_request_result<
		| IntermediaryCalculation_operand_types
	> {
		const initial_result = this.calculate_precisely(data);
		const results = [initial_result];
		let surplus:recipe_ingredients_request_output<
			| IntermediaryCalculation_operand_types
		>[] = initial_result.surplus || [];

		let checking_recursively = initial_result.ingredients.filter(
			maybe => !(maybe.item in resources)
		);
		const avoid_checking_further = new Set<string>();

		const production_items = Object.fromEntries(
			data.pool.map(e => [
				e.item,
				(
					IntermediaryNumber.reuse_or_create(e.amount)
				),
			])
		);

		while (checking_recursively.length > 0) {
			const when_done:recipe_ingredients_request_ingredient<
				(
					| IntermediaryCalculation_operand_types
				)
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
				let recursive_multiplier = new Fraction(1);

				if (check_deeper.item in production_items) {
					possibly_recursive = Root.is_recursive(
						check_deeper.item,
						data.recipe_selection || {}
					);

					if (possibly_recursive) {
						const lcm = production_items[
							check_deeper.item
						].toFraction().lcm(
							check_deeper.amount.toFraction()
						);
						const a = production_items[
							check_deeper.item
						].toFraction().div(lcm)
						const b = ((
							(
								check_deeper.amount
							)
						).toFraction().div(lcm));
						recursive_multiplier = Numbers.sum_series_fraction(
							a,
							b
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

				self_output.amount = self_output.amount.do_math_then_dispose(
					'minus',
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

		const ingredients:{[key: string]: (
			| IntermediaryCalculation_operand_types
		)} = {};
		const output:{[key: string]: (
			| IntermediaryCalculation_operand_types
		)} = {};
		const surplus_map = surplus.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = IntermediaryNumber.Zero;
				}

				was[is.item] = was[is.item].do_math_then_dispose(
					'plus',
					is.amount
				);

				return was;
			},
			{} as {[key: string]: (
				| IntermediaryCalculation_operand_types
			)}
		);

		for (const entry of results) {
			for (const ingredient of entry.ingredients) {
				if (!(ingredient.item in ingredients)) {
					ingredients[ingredient.item] = ingredient.amount;
				} else {
					ingredients[
						ingredient.item
					] = ingredients[ingredient.item].do_math_then_dispose(
						'plus',
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
					] = output[output_entry.item].do_math_then_dispose(
						'plus',
						output_entry.amount
					);
				}
			}
		}

		const production_map = data.pool.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = IntermediaryNumber.Zero;
				}

				was[is.item] = was[is.item].do_math_then_dispose(
					'plus',
					is.amount
				);

				return was;
			},
			{} as {[key: string]: (
				| IntermediaryCalculation_operand_types
			)}
		);

		for (const entry of Object.entries(production_map)) {
			assert.strictEqual(
				entry[0] in output,
				true,
				`${entry[0]} not on output map!`
			);

			if (
				output[entry[0]].isGreaterThan(
					entry[1].toBigNumber()
				)
			) {
				if (!(entry[0] in surplus_map)) {
					surplus_map[entry[0]] = IntermediaryNumber.Zero;
				}

				surplus_map[entry[0]] = surplus_map[
					entry[0]
				].do_math_then_dispose(
					'plus',
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
				ingredients[entry[0]] = IntermediaryNumber.Zero;
			}

			ingredients[entry[0]] = ingredients[entry[0]].do_math_then_dispose(
				'plus',
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
						output: IntermediaryNumber.Zero,
						surplus: IntermediaryNumber.Zero,
					}
				}

				was[is.item].output = was[is.item].output.do_math_then_dispose(
					'plus',
					is.amount
				);

				return was;
			},
			surplus_filtered.reduce(
				(was, is) => {
					if (!(is.item in was)) {
						was[is.item] = {
							item: is.item,
							output: IntermediaryNumber.Zero,
							surplus: IntermediaryNumber.Zero,
						}
					}

					was[is.item].surplus = was[
						is.item
					].surplus.do_math_then_dispose(
						'plus',
						is.amount
					);

					return was;
				},
				{} as {
					[key in production_item]: {
						item: production_item,
						output: (
							| IntermediaryCalculation_operand_types
						),
						surplus: (
							| IntermediaryCalculation_operand_types
						),
					}
				}
			)
		);

		const result:production_ingredients_request_result<
			| IntermediaryCalculation_operand_types
		> = {
			ingredients: Object.entries(ingredients).map(e => {
				return {
					item: e[0],
					amount: e[1],
				}
			}),
			output: output_entries_filtered.filter(
				maybe => !maybe.amount.isZero()
			),
			combined: Object.values(combined),
		};

		if (surplus_filtered.length > 0) {
			result.surplus = require_non_empty_array(
				surplus_filtered
			);
		}

		return result;
	}
}
