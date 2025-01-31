import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: MedusaRequest<HttpTypes.StoreGetCurrencyListParams>,
  res: MedusaResponse<HttpTypes.StoreCurrencyListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "currency",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: currencies, metadata } = await remoteQuery(queryObject)

  res.json({
    currencies,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
