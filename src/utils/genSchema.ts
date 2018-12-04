import { GraphQLSchema } from 'graphql'
import fs from 'fs-extra'
import path from 'path'
import { importSchema } from 'graphql-import'
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools'

export const genSchema = () => {
  let schemas: GraphQLSchema[] = []
  const folders = fs.readdirSync(path.join(__dirname, '../modules'))
  folders.forEach(folder => {
    const { resolvers } = require(`../modules/${folder}/resolvers`)
    const typeDefs = importSchema(
      path.join(__dirname, `../modules/${folder}/schema.graphql`),
    )
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })

  return mergeSchemas({ schemas })
}
