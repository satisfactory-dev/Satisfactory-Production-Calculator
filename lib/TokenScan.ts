import {
	DeferredCalculation,
	IntermediaryNumber,
	operation_types,
} from './IntermediaryNumber';

type TokenSpan_types =
	| 'ignore'
	| 'nesting_open'
	| 'nesting_close'
	| 'numeric'
	| 'operation'

type TokenSpan_types_part_baked = Exclude<
	TokenSpan_types,
	| 'ignore'
>;

class TokenSpan<T = TokenSpan_types>
{
	readonly from:number;
	readonly to:number;
	readonly type:T;

	constructor(from:number, to:number, type:T)
	{
		this.from = from;
		this.to = to;
		this.type = type;
	}
}

export class TokenScanError extends Error
{
}

export class TokenScanParseError extends Error
{
	readonly current?: TokenSpan<TokenSpan_types>;
	readonly scan: TokenScan;
	readonly state?: TokenScan_tokenizer;

	constructor(
		message:string,
		scan:TokenScan,
		state: TokenScan_tokenizer,
		current?: TokenSpan<TokenSpan_types>
	) {
		super(message);

		this.scan = scan;
		this.state = state;
		this.current = current;
	}
}

const regex_numeric = (
	/(?:\d*\.\d*\(\d+\)r?|\d*\.\d*\[\d+\]r?|\d+(?:\.\d+r)?|\.\d+r?)/g
);

export class TokenScan
{
	readonly parsed:Set<number> = new Set();

	readonly tokens:TokenSpan<TokenSpan_types_part_baked>[] = [];

	readonly value:string;

	constructor(value:string)
	{
		this.value = value;

		let tokens:TokenSpan<TokenSpan_types>[] = [];

		for (const entry of value.matchAll(/([\s]+)/g)) {
			tokens.push(new TokenSpan(
				entry.index,
				entry.index + entry[0].length,
				'ignore'
			));
		}

		for (const entry of value.matchAll(regex_numeric)) {
			tokens.push(new TokenSpan(
				entry.index,
				entry.index + entry[0].length,
				'numeric'
			));
		}

		for (const entry of value.matchAll(/([+/*x%-])/g)) {
			tokens.push(new TokenSpan(
				entry.index,
				entry.index + entry[0].length,
				'operation'
			));
		}

		for (const entry of value.matchAll(/(\()/g)) {
			tokens.push(new TokenSpan(
				entry.index,
				entry.index + entry[0].length,
				'nesting_open'
			));
		}

		for (const entry of value.matchAll(/(\))/g)) {
			tokens.push(new TokenSpan(
				entry.index,
				entry.index + entry[0].length,
				'nesting_close'
			));
		}

		tokens = tokens.sort((a, b) => {
			return a.from - b.from;
		})

		const recursive_numerics = tokens.filter(
			maybe => (
				'numeric' === maybe.type
				&& /[()]/.test(value.substring(maybe.from, maybe.to))
			)
		);

		tokens = tokens.filter(
			(maybe) => {
				if (
					'nesting_open' === maybe.type
					|| 'nesting_close' === maybe.type
				) {
					return !recursive_numerics.find(
						maybe_numeric => (
							maybe.from >= maybe_numeric.from
							&& maybe.to <= maybe_numeric.to
						)
					)
				}

				return true;
			}
		);

		if (tokens.length < 1) {
			throw new TokenScanError('No tokens found!')
		} else if (0 !== tokens[0].from) {
			throw new TokenScanError('First token not at index 0!')
		} else if (value.length !== tokens[tokens.length - 1].to) {
			throw new TokenScanError(
				'Last token does not end at end of string!'
			)
		}

		let nesting_balance = 0;

		for (let index=0; index<tokens.length; ++index) {
			const token = tokens[index];
			if ('nesting_open' === token.type) {
				nesting_balance += (token.to - token.from);
			} else if ('nesting_close' === token.type) {
				nesting_balance -= (token.to - token.from);
			}

			if (
				index > 0
				&& tokens[index - 1].to !== token.from
			) {
				console.error(tokens, index);
				throw new TokenScanError(
					`Token expected to be found at index ${index}`
				)
			}
		}

		if (0 !== nesting_balance) {
			throw new TokenScanError(
				'Imbalanced nesting in string!'
			);
		}

		this.tokens = tokens.filter(
			(maybe): maybe is TokenSpan<
				TokenSpan_types_part_baked
			> => 'ignore' !== maybe.type
		);

		const convert_to_negative:number[] = [];

		if (
			this.tokens.length >= 2
			&& 'operation' === this.tokens[0].type
			&& '-' === this.value[this.tokens[0].from]
			&& 'numeric' === this.tokens[1].type
		) {
			convert_to_negative.push(0);
		}

		for (
			let token_index=0; token_index < this.tokens.length; ++token_index
		) {
			const token = this.tokens[token_index];
			const next = this.tokens[token_index + 1];
			const after = this.tokens[token_index + 2];

			if (
				(
					'nesting_open' === token.type
					|| 'operation' === token.type
				)
				&& next
				&& after
				&& 'operation' === next.type
				&& '-' === this.value[next.from]
				&& 'numeric' === after.type
			) {
				convert_to_negative.push(token_index + 1);
				token_index += 2;
				continue;
			}
		}

		for (const index of convert_to_negative.reverse()) {
			this.tokens.splice(
				index,
				2,
				new TokenSpan(
					this.tokens[index].from,
					this.tokens[index + 1].to,
					'numeric'
				)
			);
		}
	}

	parse(): IntermediaryNumber|DeferredCalculation
	{
		const reduced = this.tokens.reduce(
			(
				was:TokenScan_tokenizer,
				is:TokenSpan<TokenSpan_types_part_baked>,
				index:number,
			) => TokenScan.reduce(
				this,
				was,
				is,
				index,
			),
			default_tokenizer_state()
		);

		if (
			undefined !== reduced.left_operand
			&& '' === reduced.operation
			&& undefined === reduced.right_operand
			&& 0 === reduced.outter_stack.length
		) {
			return reduced.left_operand;
		}

		throw new TokenScanParseError(
			'Parse in unsupported state!',
			this,
			reduced
		);
	}

	private static reduce(
		scan: TokenScan,
		was:TokenScan_tokenizer,
		is:TokenSpan<TokenSpan_types_part_baked>,
		index:number,
	): TokenScan_tokenizer {
		if (is_nesting_open(is)) {
			if ('right' === was.operand_mode) {
				if (undefined === was.left_operand) {
					if (
						! (
							was.outter_stack.length > 0
							&& ! (
								was.outter_stack[
									was.outter_stack.length - 1
								] instanceof TokenSpan
							)
						)
					) {
						throw new TokenScanParseError(
							// eslint-disable-next-line max-len
							'Nesting opened without left operand to push into stack!',
							scan,
							was
						);
					}

					return was;
				} else if ('' === was.operation) {
					throw new TokenScanParseError(
						'Nesting opened without operation to push into stack!',
						scan,
						was,
						is
					);
				}

				was.outter_stack.push({
					left_operand: was.left_operand,
					operation: was.operation,
				});
				was.left_operand = undefined;
				was.operation = '';
				was.operand_mode = 'left';
			} else {
				was.outter_stack.push(is);
			}
		} else if (is_nesting_close(is)) {
			const popped = was.outter_stack.pop();

			if (popped instanceof TokenSpan) {
				if (
					'nesting_open' === popped.type
					&& '' === was.operation
					&& undefined !== was.left_operand
					&& undefined === was.right_operand
				) {
					// no-op, deliberately do nothing
				} else {
					throw new TokenScanParseError(
						// eslint-disable-next-line max-len
						'token span popping in this context not yet implemented',
						scan,
						was,
						is
					);
				}
			} else if (undefined === popped) {
				if (
					index !== (scan.tokens.length - 1)
					&& (
						'' !== was.operation
						|| undefined !== was.right_operand
					)
				) {
					throw new TokenScanParseError(
						'Token scan finished with incomplete parse!',
						scan,
						was,
						is
					);
				}
			} else {
				if (
					'' === was.operation
					&& undefined !== was.left_operand
					&& undefined === was.right_operand
				) {
					was.left_operand = new DeferredCalculation(
						popped.left_operand,
						popped.operation,
						was.left_operand
					);
					was.operation ='';
					was.operand_mode = 'right';
				} else {
					throw new TokenScanParseError(
						// eslint-disable-next-line max-len
						'token span popping in this context not yet implemented',
						scan,
						was,
						is
					);
				}
			}
		} else if (is_numeric(is)) {
			if ('left' === was.operand_mode) {
				was.left_operand = IntermediaryNumber.create(
					scan.value.substring(
						is.from,
						is.to
					)
				);
				was.operand_mode = 'right';
			} else {
				if ('' === was.operation) {
					throw new TokenScanParseError(
						'Right operand detected without operation!',
						scan,
						was,
						is
					);
				} else if (undefined === was.left_operand) {
					throw new TokenScanParseError(
						'Right operand detected without left operand!',
						scan,
						was,
						is
					);
				}

				let resolved = new DeferredCalculation(
					was.left_operand,
					was.operation,
					IntermediaryNumber.create(scan.value.substring(
						is.from,
						is.to
					)),
				);

				if (
					was.outter_stack.length > 0
					&& ! (
						was.outter_stack[
							was.outter_stack.length - 1
						] instanceof TokenSpan
					)
				) {
					const previous = (
						was.outter_stack.pop()
					) as incomplete_operation;

					resolved = new DeferredCalculation(
						previous.left_operand,
						previous.operation,
						resolved
					);
				}

				was.left_operand = resolved;
				was.operation = '';
				was.right_operand = undefined;
			}
		} else if ('operation' === is.type) {
			if (undefined === was.left_operand) {
				throw new TokenScanParseError(
					'Operation detected without left operand!',
					scan,
					was,
					is
				);
			} else if ('' !== was.operation) {
				throw new TokenScanParseError(
					`Cannot set operation when operation already set to "${
						was.operation
					}"`,
					scan,
					was,
					is
				)
			}
			const maybe = scan.value.substring(is.from, is.to);
			is_operation_value(maybe);

			was.operation = maybe;
		} else {
			throw new TokenScanParseError(
				'not implemented',
				scan,
				was,
				is
			);
		}

		return was;
	}
}

type TokenScan_tokenizer_operand_buffer =
	| IntermediaryNumber
	| DeferredCalculation
	| undefined;

type incomplete_operation = {
	left_operand: Exclude<
		TokenScan_tokenizer_operand_buffer,
		undefined
	>,
	operation: operation_types,
}

type TokenScan_tokenizer = {
	outter_stack: (
		| incomplete_operation
		| TokenSpan<'nesting_open'>
	)[],
	left_operand: TokenScan_tokenizer_operand_buffer,
	right_operand: TokenScan_tokenizer_operand_buffer,
	operation: ''|operation_types,
	operand_mode: 'left'|'right',
}

function default_tokenizer_state(): TokenScan_tokenizer {
	return {
		outter_stack: [],
		left_operand: undefined,
		operation: '',
		right_operand: undefined,
		operand_mode: 'left',
	}
}

function is_nesting_open(
	maybe: TokenSpan<TokenSpan_types>
): maybe is TokenSpan<'nesting_open'> {
	return 'nesting_open' === maybe.type;
}

function is_nesting_close(
	maybe: TokenSpan<TokenSpan_types>
): maybe is TokenSpan<'nesting_close'> {
	return 'nesting_close' === maybe.type;
}

function is_numeric(
	maybe: TokenSpan<TokenSpan_types>
): maybe is TokenSpan<'numeric'> {
	return 'numeric' === maybe.type;
}

function is_operation_value(
	maybe: string
): asserts maybe is operation_types {
	if (
		! (
			maybe.length === 1
			&& '+-/x*%'.includes(maybe)
		)
	) {
		throw new TokenScanError(
			`Expected operation value, found "${maybe}"`
		)
	}
}
