import Ajv, {
	ValidateFunction,
} from 'ajv/dist/2020';
import standalone from 'ajv/dist/standalone';

import {
	esmify,
} from '@satisfactory-dev/ajv-utilities';

import {
	FGPowerShardDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGPowerShardDescriptor';
import {
	FGItemDescriptorPowerBoosterFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.0/classes/CoreUObject/FGItemDescriptorPowerBoosterFuel';
import {
	common_base__FGAmmoTypeProjectile__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	common_base__FGAmmoTypeInstantHit__base__pre_1_1__type,
	common_base__FGAmmoTypeProjectile__base__pre_1_1__type,
	common_base__FGAmmoTypeSpreadshot__pre_1_1__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/common/unassigned';
import {
	common_base__FGAmmoTypeInstantHit__chaos__type,
	common_base__FGAmmoTypeInstantHit__standard__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeInstantHit';
import {
	common_base__FGAmmoTypeSpreadshot__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGAmmoTypeSpreadshot';
import {
	FGAmmoTypeProjectile__base__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/1.1/classes/CoreUObject/FGAmmoTypeProjectile';
import {
	common_base__FGItemDescriptorBiomass__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorBiomass';
import {
	common_base__FGBuildingDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGBuildingDescriptor';
import {
	common_base__FGConsumableDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGConsumableDescriptor';
import {
	common_base__FGEquipmentDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGEquipmentDescriptor';
import {
	common_base__FGItemDescriptorNuclearFuel__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptorNuclearFuel';
import {
	common_base__FGItemDescriptor__FGResourceDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGItemDescriptor';
import {
	common_base__FGPoleDescriptor__type,
// eslint-disable-next-line max-len
} from '@satisfactory-dev/docs.json.ts/generated-types/common/classes/CoreUObject/FGPoleDescriptor';

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
		schemas:GenerateSchemas<
			(
				| FGPowerShardDescriptor__type
				| undefined
			),
			(
				| FGItemDescriptorPowerBoosterFuel__type
				| undefined
			),
			(
				| common_base__FGAmmoTypeProjectile__type
				| common_base__FGAmmoTypeProjectile__base__pre_1_1__type
			),
			(
				| common_base__FGAmmoTypeInstantHit__chaos__type
				| common_base__FGAmmoTypeInstantHit__standard__type
				| common_base__FGAmmoTypeInstantHit__base__pre_1_1__type
			),
			(
				| common_base__FGAmmoTypeSpreadshot__type
				| (
					& FGAmmoTypeProjectile__base__type
					& common_base__FGAmmoTypeSpreadshot__pre_1_1__type
				)
			),
			common_base__FGItemDescriptorBiomass__type,
			common_base__FGBuildingDescriptor__type,
			common_base__FGConsumableDescriptor__type,
			common_base__FGEquipmentDescriptor__type,
			(
				| common_base__FGItemDescriptorNuclearFuel__type
			),
			(
				| common_base__FGItemDescriptor__FGResourceDescriptor__type
			),
			(
				| common_base__FGPoleDescriptor__type
			)
		>,
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
		schemas:GenerateSchemas<
			(
				| FGPowerShardDescriptor__type
				| undefined
			),
			(
				| FGItemDescriptorPowerBoosterFuel__type
				| undefined
			),
			(
				| common_base__FGAmmoTypeProjectile__type
				| common_base__FGAmmoTypeProjectile__base__pre_1_1__type
			),
			(
				| common_base__FGAmmoTypeInstantHit__chaos__type
				| common_base__FGAmmoTypeInstantHit__standard__type
				| common_base__FGAmmoTypeInstantHit__base__pre_1_1__type
			),
			(
				| common_base__FGAmmoTypeSpreadshot__type
				| (
					& FGAmmoTypeProjectile__base__type
					& common_base__FGAmmoTypeSpreadshot__pre_1_1__type
				)
			),
			common_base__FGItemDescriptorBiomass__type,
			common_base__FGBuildingDescriptor__type,
			common_base__FGConsumableDescriptor__type,
			common_base__FGEquipmentDescriptor__type,
			(
				| common_base__FGItemDescriptorNuclearFuel__type
			),
			(
				| common_base__FGItemDescriptor__FGResourceDescriptor__type
			),
			(
				| common_base__FGPoleDescriptor__type
			)
		>,
		ajv: Ajv,
	): string {
		return esmify(standalone(
			ajv,
			this.#compile(schemas, ajv),
		));
	}
}
