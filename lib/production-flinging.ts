import BigNumber from 'bignumber.js';

import {
	buildings,
	items,
	resources,
} from './production-data';

export type production_item = keyof (
	| typeof buildings
	| typeof items
	| typeof resources
);

export type production_set = {[key in production_item]: BigNumber};

export interface HasProductionOutput
{
	production_output(): production_set
}

export interface CanRequestOutputToBeSentSomewhere
{
	request_output_to_be_sent(
		items:[production_item, ...production_item[]],
		somewhere:CanRequestToReceiveOutput<
			CanRequestOutputToBeSentSomewhere
		>
	): void;

	/**
	 * Should cause previous requests to no longer be honoured.
	 */
	cancel_output_requests(): void;
}

export interface CanRequestToReceiveOutput<T extends object>
{
	receive_output(
		production_set:production_set,
		from:T
	): void
}

export class AmountSplitter implements CanRequestToReceiveOutput<
	AmountSplitter
> {
	private amounts:[production_item, BigNumber][];
	private main:CanRequestToReceiveOutput<AmountSplitter>;
	private surplus:CanRequestToReceiveOutput<AmountSplitter>;

	constructor(
		amounts:production_set,
		main:CanRequestToReceiveOutput<AmountSplitter>,
		surplus:CanRequestToReceiveOutput<AmountSplitter>
	) {
		this.amounts = Object.entries(amounts);
		this.main = main;
		this.surplus = surplus;
	}

	receive_output(production_set:production_set): void {
		const [to_main, to_surplus] = this.amounts.reduce(
			(was, is) => {
				const [item, main_amount] = is;

				const amount = item in production_set
					? production_set[item]
					: BigNumber(0)

				const to_main = (
					amount.isLessThan(main_amount)
						? amount
						: main_amount
				).plus(0);
				const to_surplus = BigNumber.max(0, amount.minus(main_amount));

				was[0][item] = to_main;
				was[1][item] = to_surplus;

				return was;
			},
			[
				{},
				{},
			] as [production_set, production_set]
		);

		this.main.receive_output(to_main, this);
		this.surplus.receive_output(to_surplus, this);
	}
}

export class ProductionDestination implements
	CanRequestToReceiveOutput<object>,
	HasProductionOutput
{
	private readonly amounts:Map<
		object,
		production_set
	> = new Map();
	private readonly items:[production_item, ...production_item[]];

	constructor(
		items:[production_item, ...production_item[]]
	) {
		this.items = items;
	}

	clear()
	{
		this.amounts.clear();
	}

	production_output(): production_set {
		return [...this.amounts.values()].reduce(
			(was, is) => {
				for (const item of this.items) {
					if (item in is) {
						was[item] = was[item].plus(
							BigNumber.max(0, is[item])
						);
					}
				}

				return was;
			},
			Object.fromEntries(this.items.map((item): [
				production_item,
				BigNumber,
			] => [
				item,
				BigNumber(0),
			]))
		);
	}

	receive_output(production_set: production_set, from: object): void {
		this.amounts.set(from, production_set);
	}
}

export class ProductionMerger extends ProductionDestination
{
	private readonly output:CanRequestToReceiveOutput<ProductionMerger>;

	constructor(
		items:[production_item, ...production_item[]],
		output:CanRequestToReceiveOutput<ProductionMerger>
	) {
		super(items);
		this.output = output;
	}

	receive_output(production_set: production_set, from: object): void {
		super.receive_output(production_set, from);
		this.output.receive_output(
			this.production_output(),
			this
		);
	}
}
