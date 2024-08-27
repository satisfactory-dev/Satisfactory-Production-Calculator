import Ajv, {
	ValidateFunction,
} from 'ajv/dist/2020';
import standalone from 'ajv/dist/standalone';

import {
	esmify,
} from '@satisfactory-dev/ajv-utilities';

import type {
	GenerateSchemas,
} from './generate-schemas';

import type {
	production_request,
} from './types';

export class GenerateValidators
{
	readonly validation_function:ValidateFunction<
		production_request
	>;

	static #ajv_instances: WeakMap<
		GenerateSchemas,
		WeakMap<
			Ajv,
			GenerateValidators
		>
	> = new WeakMap();

	private constructor(
		validation_function:ValidateFunction<
			production_request
		>,
	) {
		this.validation_function = validation_function;
	}

	static #compile(
		schemas:GenerateSchemas,
		ajv: Ajv,
	) {
		const {
			production_request,
			recipe_selection,
		} = schemas;

		ajv.addSchema(recipe_selection);

		return ajv.compile(production_request);
	}

	static fromCompile(
		schemas:GenerateSchemas,
		ajv: Ajv,
	): GenerateValidators {
		let existing_outter = this.#ajv_instances.get(schemas);

		if (!existing_outter) {
			existing_outter = new WeakMap();
			this.#ajv_instances.set(schemas, existing_outter);
		}

		let existing = existing_outter.get(ajv);

		if (!existing) {
			existing = new this(this.#compile(schemas, ajv));
			existing_outter.set(ajv, existing);
		}

		return existing;
	}

	static async fromStandalone(module:Promise<{
		default: ValidateFunction<production_request>
	}>) {
		return new this((await module).default);
	}

	static toStandalone(
		schemas:GenerateSchemas,
		ajv: Ajv,
	): string {
		return esmify(standalone(
			ajv,
			this.#compile(schemas, ajv),
		));
	}
}
