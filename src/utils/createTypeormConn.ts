import { getConnectionOptions, createConnection } from 'typeorm'

export const createTypeormConn = async () => {
  const option = await getConnectionOptions(process.env.NODE_ENV)
  return await createConnection({ ...option, name: 'default' })
}
