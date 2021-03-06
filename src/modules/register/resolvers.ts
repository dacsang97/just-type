import * as bcrypt from 'bcryptjs'
import * as yup from 'yup'
import { ResolverMap } from '../../types/graphql-util'
import { User } from '../../entity/User'
import { formatYupError } from '../../utils/formatYupError'
import {
  emailNotLongEnough,
  emailInvalid,
  passwordNotLongEnough,
  duplicateEmail,
} from './errorMessage'
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink'
import { sendEmail } from '../../utils/sendEmail'

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(emailInvalid),
  password: yup
    .string()
    .min(3, passwordNotLongEnough)
    .max(255),
})

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'Goodbye my code',
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url },
    ) => {
      try {
        await schema.validate(args, { abortEarly: false })
      } catch (err) {
        return formatYupError(err)
      }
      const { email, password } = args

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      })

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail,
          },
        ]
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = User.create({
        email,
        password: hashedPassword,
      })
      await user.save()
      await sendEmail(email, await createConfirmEmailLink(url, user.id, redis))
      return null
    },
  },
}
