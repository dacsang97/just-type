import { ResolverMap } from '../../types/graphql-util'

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'Goodbye my code',
  },
  Mutation: {
    login: async _ => {
      return null
    },
  },
}
