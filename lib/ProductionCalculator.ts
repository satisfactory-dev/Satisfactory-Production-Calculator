import assert from 'assert';
import {
	ValidateFunction,
} from 'ajv/dist/2020';
import production_request_validator from
	'../validator/production_request_schema.mjs';
import recipe_selection_schema from
	'../generated-schemas/recipe-selection.json' with {type: 'json'};
import {
	NoMatchError,
} from '@satisfactory-clips-archive/docs.json.ts/lib/Exceptions.js';
import {
	amount_string,
	number_arg,
	Numbers,
} from '@signpostmarv/intermediary-number';
import {
	UnrealEngineString_right_x_C_suffix,
} from './UnrealEngineString';
import {
	not_undefined,
} from '@satisfactory-clips-archive/custom-assert';
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
	IntermediaryNumber,
	operand_types,
} from '@signpostmarv/intermediary-number';
import Fraction from 'fraction.js';

import type {
	production_item,
	production_request,
	production_result,
	production_set,
	recipe_ingredients_request_output,
} from './types';
import {
	Request,
} from './Request';

export class ProductionCalculator {
	top_level_only:boolean = false;

	private input:production_set<
		| operand_types
	> = {};
	protected readonly check:ValidateFunction<production_request>;

	constructor()
	{
		this.check = production_request_validator as (
			ValidateFunction<production_request>
		);
	}

	calculate(data:unknown): production_result
	{
		return this.calculate_validated(this.validate(data));
	}

	validate(
		data: unknown
	) {
		if (data instanceof Request) {
			return data.toData();
		}

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

	protected calculate_precisely(
		data:production_request<
			(
				| amount_string
				| operand_types
			),
			(
				| number_arg
				| operand_types
			)
		>,
		surplus?:recipe_ingredients_request_output<
			| operand_types
		>[]
	): production_result<
		| operand_types
	> {
		const ingredients:{
			[key in keyof typeof items]: (
				| operand_types
			);
		} = {};
		const input:{
			[key: string]: (
				| operand_types
			)
		} = {
			...this.input,
		};

		const data_input = undefined === data.input
			? undefined
			: Object.entries(data.input).map(e => ({
				item: e[0],
				amount: e[1],
			}));

		for (const entry of (surplus || data_input || [])) {
			if (!(entry.item in input)) {
				input[
					entry.item as keyof typeof input
				] = IntermediaryNumber.reuse_or_create(entry.amount);
			} else {
				input[entry.item] = input[entry.item].do_math_then_dispose(
					'plus',
					entry.amount
				);
			}
		}
		const output:{
			[key in keyof (
				| typeof buildings
				| typeof resources
			)]: operand_types;
		} = {};

		for (const entry of data.pool) {
			const {item: production, amount:output_amount} = entry;
			let amount = IntermediaryNumber.reuse_or_create(entry.amount);
			let amount_from_input:(
				| operand_types
			);

			if (production in input) {
				if (
					input[production].isLessThan(
						amount
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
			} else {
				amount_from_input = IntermediaryNumber.Zero;
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
							] = ingredients[
								faux_ingredient
							].do_math_then_dispose(
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
					| operand_types
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
						| operand_types
					),
					(
						| operand_types
					),
					...(
						| operand_types
					)[],
				]
			);

			const divisor_pre_adjustment = divisor;

			divisor = Numbers.divide_if_not_one(
				divisor_pre_adjustment,
				Numbers.divide_if_not_one(
					new Fraction(1),
					Numbers.divide_if_not_one(
						(
							mapped_product_amounts[production]
						),
						divisor_pre_adjustment,
						true
					),
					true
				),
				true
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
					Numbers.divide_if_not_one(
						ammended_amount,
						divisor,
						false
					)
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
					Numbers.divide_if_not_one(
						ammended_amount,
						divisor,
						false
					)
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
						output: operand_types,
						surplus: operand_types,
					}
				}
			)
		);

		const result:production_result<
			| operand_types
		> = {
			ingredients: Object.fromEntries(
				Object.entries(ingredients).map(
					(e): [string, operand_types] => {
						const left_over = e[1].minus(input[e[0]] || 0);

						return [
							e[0],
							(
								left_over.isLessThan(0)
									? IntermediaryNumber.Zero
									: left_over
							),
						];
					}
				).filter(maybe => maybe[1].isGreaterThan(0))
			),
			output: output_entries,
			combined: Object.values(combined),
		};

		if (surplus_entries.length > 0) {
			result.surplus = require_non_empty_array(surplus_entries);
		}

		return result;
	}

	protected calculate_validated(
		data:production_request
	): production_result {
		const deferred = this.calculate_validated_deferred(data);

		const result:production_result = {
			ingredients: {...deferred.ingredients},
			output: deferred.output.map(
				e => {
					return {
						item: e.item,
						amount: e.amount,
					};
				}
			),
			combined: deferred.combined.map(
				e => {
					return {
						item: e.item,
						output: e.output,
						surplus: e.surplus,
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
						amount: e.amount,
					};
				}
			))
		}

		return result;
	}

	protected calculate_validated_deferred(
		data:production_request<
			(
				| amount_string
				| operand_types
			),
			(
				| number_arg
				| operand_types
			)
		>
	): production_result<
		| operand_types
	> {
		const initial_result = this.calculate_precisely(data);
		const results = [initial_result];
		let surplus:recipe_ingredients_request_output<
			| operand_types
		>[] = initial_result.surplus || [];

		let checking_recursively = this.top_level_only
			? []
			: Object.entries(initial_result.ingredients).filter(
				maybe => !(maybe[0] in resources)
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
			const when_done:production_set<
				(
					| operand_types
				)
			> = {};

			for (const [
				check_deeper_item,
				check_deeper_amount,
			] of checking_recursively) {
				assert.strictEqual(
					(
						check_deeper_item in recipe_selection_schema[
							'properties'
						]
						|| known_not_sourced_from_recipe.includes(
							check_deeper_item
						)
						|| known_byproduct.includes(
							check_deeper_item
						)
					),
					true,
					new NoMatchError(
						check_deeper_item,
						`Item (${check_deeper_item}) not found in recipe selection!`
					)
				);

				if (
					known_not_sourced_from_recipe.includes(
						check_deeper_item
					)
					|| known_byproduct.includes(
						check_deeper_item
					)
				) {
					continue;
				}

				let possibly_recursive = false;
				let recursive_multiplier = new Fraction(1);

				if (check_deeper_item in production_items) {
					possibly_recursive = Root.is_recursive(
						check_deeper_item,
						data.recipe_selection || {}
					);

					if (possibly_recursive) {
						const lcm = production_items[
							check_deeper_item
						].toFraction().lcm(
							check_deeper_amount.toFraction()
						);

						const a = production_items[
							check_deeper_item
						].toFraction()
						const b = (
							(
								check_deeper_amount
							)
						).toFraction();
						recursive_multiplier = Numbers.sum_series_fraction(
							Numbers.divide_if_not_one(a, lcm, true),
							Numbers.divide_if_not_one(b, lcm, true),
						);

						avoid_checking_further.add(check_deeper_item);
					}
				}

				const deeper_result = this.calculate_precisely(
					{
						...data,
						pool: [{
							item: (
								check_deeper_item as keyof (
									typeof recipe_selection_schema[
										'properties'
									]
								)
							),
							amount: check_deeper_amount.times(
								recursive_multiplier
							),
						}],
					},
					surplus
				);
				surplus = deeper_result.surplus || [];

				const self_output = deeper_result.output.find(
					maybe => maybe.item === check_deeper_item
				);

				not_undefined(self_output);

				self_output.amount = self_output.amount.do_math_then_dispose(
					'minus',
					check_deeper_amount
				);

				const maybe_check_further = Object.entries(
					deeper_result.ingredients
				).filter(
					maybe => (
						!(maybe[0] in resources)
						&& !avoid_checking_further.has(maybe[0])
					)
				);

				if (maybe_check_further.length) {
					for (
						const [
							further_item,
							further_amount,
						] of maybe_check_further
					) {
						if (further_item in when_done) {
							when_done[
								further_item
							] = when_done[
								further_item
							].do_math_then_dispose(
								'plus',
								further_amount
							);
						} else {
							when_done[further_item] = further_amount;
						}
					}
				}

				results.push(deeper_result);
			}

			checking_recursively = Object.entries(when_done);
		}

		const ingredients:{[key: string]: (
			| operand_types
		)} = {};
		const output:{[key: string]: (
			| operand_types
		)} = {};
		const surplus_map = surplus.reduce(
			(was, is) => {
				if (!(is.item in was)) {
					was[is.item] = is.amount;
				} else {
					was[is.item] = was[is.item].do_math_then_dispose(
						'plus',
						is.amount
					);
				}

				return was;
			},
			{} as {[key: string]: (
				| operand_types
			)}
		);

		for (const entry of results) {
			for (const [item, amount] of Object.entries(entry.ingredients)) {
				if (!(item in ingredients)) {
					ingredients[item] = amount;
				} else {
					ingredients[
						item
					] = ingredients[item].do_math_then_dispose(
						'plus',
						amount
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
					was[is.item] = IntermediaryNumber.reuse_or_create(
						is.amount
					);
				} else {
					was[is.item] = was[is.item].do_math_then_dispose(
						'plus',
						is.amount
					);
				}

				return was;
			},
			{} as {[key: string]: (
				| operand_types
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
					entry[1]
				)
			) {
				if (!(entry[0] in surplus_map)) {
					surplus_map[entry[0]] = output[entry[0]].minus(entry[1]);
				} else {
					surplus_map[entry[0]] = surplus_map[
						entry[0]
					].do_math_then_dispose(
						'plus',
						output[entry[0]].minus(entry[1])
					);
				}

				output[entry[0]] = entry[1];
			}
		}

		const output_entries = Object.entries(output);
		const negative_outputs = output_entries.filter(
			maybe => maybe[1].isLessThan(0)
		);

		for (const entry of negative_outputs) {
			if (!(entry[0] in ingredients)) {
				ingredients[entry[0]] = entry[1].abs();
			} else {
				ingredients[entry[0]] = ingredients[
					entry[0]
				].do_math_then_dispose(
					'plus',
					entry[1].abs()
				);
			}
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
							| operand_types
						),
						surplus: (
							| operand_types
						),
					}
				}
			)
		);

		const result:production_result<
			| operand_types
		> = {
			ingredients,
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
