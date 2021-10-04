
export interface ServiceError {
  code: number;
  status: 400 | 500;
  description: string;
}

export const serverError = (): ServiceError => ({
  code: 500,
  status: 500,
  description: 'Internal Server Error'
})

export const badRequestError = (errorMessage?: string): ServiceError => ({
  code: 400,
  status: 400,
  description: errorMessage || 'Bad Request Error'
})

export const throwError = (error: ServiceError) => {
  throw error
}

export interface ExpressError {
  code?: number;
  status: number;
  description: string;
}

const isKnownError = (error: any): error is ServiceError => {
  return error.code && error.status && error.description
}

export const toExpressError = (thrownError: unknown): ExpressError => (
  isKnownError(thrownError)
  ? thrownError
  : ({
    status: serverError().status,
    description: serverError().description
  })
)