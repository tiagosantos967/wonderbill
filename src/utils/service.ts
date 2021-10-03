
interface Context<T> {
  data: T
}

export type Hook<T> = (context: Context<T>) => Promise<Context<T>>

interface ServiceConstructor<T> {
  name: string;
  create: Array<Hook<T>>
}

export interface Service<T> {
  name: string;
  create: (data: T) => Promise<T>
}

export const composePromises = <T>(promises: Array<Hook<T>>, context: Context<T>) => (
  promises.reduce(
    async (previous, next) => next(await previous),
    Promise.resolve(context)
  )
)

export const service = <T>({
  name,
  create
}: ServiceConstructor<T>) => (): Service<T> => ({
  name,
  create: async (data: T) => await (await composePromises(create, { data })).data
})