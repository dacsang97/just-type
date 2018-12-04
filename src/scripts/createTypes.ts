import { generateNamespace } from '@gql2ts/from-schema'
import { genSchema } from '../utils/genSchema'
import { writeFile } from 'fs-extra'
import { join } from 'path'

const schema = genSchema()

const myNamespace = generateNamespace('GQL', schema)

writeFile(join(__dirname, '../types/schema.d.ts'), myNamespace)
