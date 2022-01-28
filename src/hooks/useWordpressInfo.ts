import { useEffect, useState } from 'react'
import isNumber from 'is-number'
import { isArray } from 'util'

type Data = null | {
  wpAdmin?: string
  wpNetworkIds?: number[]
}

export default function useWordpressInfo(): Data {
  const [data, setData] = useState<Data>(null)

  const updateWithNewValue = (key: string, value: any) =>
    setData((prevState) => (prevState ? { ...prevState, [key]: value } : { [key]: value }))

  useEffect(() => {
    if (window.SO_Definance) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { SO_Definance } = window

      if (SO_Definance?.masterAddress) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        updateWithNewValue('wpAdmin', SO_Definance.masterAddress)
      }
      if (isArray(SO_Definance?.chainIds) && SO_Definance?.chainIds.length) {
        type ExternalId = string | number
        // eslint-disable-next-line @typescript-eslint/camelcase
        const validatedIds = SO_Definance.chainIds.filter((id: ExternalId) => isNumber(id))

        if (validatedIds.length) {
          updateWithNewValue(
            'wpNetworkIds',
            validatedIds.map((id: ExternalId) => Number(id))
          )
        }
      }
    }
  }, [])

  return data
}
