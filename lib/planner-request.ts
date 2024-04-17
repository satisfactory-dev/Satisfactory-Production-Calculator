import Ajv, {
	SchemaObject,
	ValidateFunction,
} from 'ajv/dist/2020';
import {
	NoMatchError,
} from '../Docs.json.ts/lib/Exceptions';

export abstract class PlannerRequest<
	Data = unknown,
	Result = unknown
> {
	protected readonly check:ValidateFunction<Data>;

	constructor(ajv:Ajv, schema:SchemaObject)
	{
		this.check = ajv.compile<Data>(schema);
	}

	calculate(data:unknown): Result
	{
		return this.calculate_validated(this.validate(data));
	}

	validate(data:unknown): Data
	{
		if (!this.check(data)) {
			throw new NoMatchError(
				{
					data,
				},
				'Data not a supported request!'
			);
		}

		return data;
	}

	protected abstract calculate_validated(data:Data): Result;
}
