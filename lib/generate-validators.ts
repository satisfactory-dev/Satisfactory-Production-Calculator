import type {
	Ajv2020,
} from 'ajv/dist/2020.js';

import standalone from 'ajv/dist/standalone/index.js';

import type {
	Is,
} from '@satisfactory-dev/ajv-utilities';
import {
	esmify,
} from '@satisfactory-dev/ajv-utilities';

import type {
	production_request,
} from './types.ts';

import type {
	GenerateSchemas,
} from './generate-schemas.ts';

import type {
	supported_versions,
} from './supported.ts';

export class GenerateValidators {
	readonly validation_function: Is<
		production_request
	>;

	static #ajv_instances: WeakMap<
		GenerateSchemas<supported_versions>,
		WeakMap<
			Ajv2020,
			GenerateValidators
		>
	> = new WeakMap();

	private constructor(
		validation_function: Is<
			production_request
		>,
	) {
		this.validation_function = validation_function;
	}

	static #compile(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
	) {
		const {
			production_request,
			recipe_selection,
		} = schemas;

		ajv.addSchema(recipe_selection);

		return ajv.compile(production_request);
	}

	static fromCompile(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
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

	static async fromStandalone(module: Promise<{
		default: Is<production_request>,
	}>) {
		return new this((await module).default);
	}

	static toStandalone(
		schemas: GenerateSchemas<supported_versions>,
		ajv: Ajv2020,
	): string {
		return esmify(standalone(
			ajv,
			this.#compile(schemas, ajv),
		));
	}
}
