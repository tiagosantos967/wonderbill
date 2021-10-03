
interface Context<T> {
  serviceName: string;
  data: T;
}

export type Hook<T> = (context: Context<T>) => Promise<Context<T>>

interface ServiceConstructor<T> {
  name: string;
  create: Array<Hook<T>>;
  created?: Array<Hook<T>>;
}

export interface Service<T> {
  name: string;
  create: (data: T) => Promise<T>;
  created: (data: T) => Promise<T>;
}

export const composePromises = <T>(promises: Array<Hook<T>>, context: Context<T>) => (
  promises.reduce(
    async (previous, next) => next(await previous),
    Promise.resolve(context)
  )
)

export const service = <T>({
  name,
  create,
  created,
}: ServiceConstructor<T>) => (): Service<T> => ({
  name,
  create: async (data: T) => await (await composePromises(create, { data, serviceName: name })).data,
  created: async (data: T) => await (await composePromises(created, { data, serviceName: name })).data,
})

type ValidatorFunction = (value) => Promise<Boolean>;

export const validateDataFieldHook = <T>(fieldName: keyof T, validatorFunction: ValidatorFunction, errorMessage: string): Hook<T> => async (context) => {
  const field = context.data[fieldName];
  try {
    await validatorFunction(field);
    return context;
  } catch(error) {
    throw errorMessage;
  }
}

export const existsValidator: ValidatorFunction = async (value) => !!value ? Promise.resolve(true) : Promise.reject(false);

export const oneOfValidator= (options: Array<string>): ValidatorFunction => async (value) => 
  value && options.includes(value) ? Promise.resolve(true) : Promise.reject(false);
