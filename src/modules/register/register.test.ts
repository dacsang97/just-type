import { request } from 'graphql-request'
import { User } from '../../entity/User'
import {
  duplicateEmail,
  emailInvalid,
  emailNotLongEnough,
  passwordNotLongEnough,
} from './errorMessage'
import { createTypeormConn } from '../../utils/createTypeormConn'

beforeAll(async () => {
  await createTypeormConn()
})

const email = 'dacsang97@gmail.com'
const password = '123456'
const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`

describe('Register user', async () => {
  it('check for duplicate email', async () => {
    // make sure we can register a user
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password),
    )
    expect(response).toEqual({ register: null })
    const users = await User.find({ where: { email } })
    expect(users.length).toEqual(1)
    const user = users[0]
    expect(user.email).toEqual(email)
    expect(user.password).not.toEqual(password)

    // Test for duplicate emails
    const response2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password),
    )
    expect(response2.register.length).toEqual(1)
    expect(response2.register).toEqual([
      {
        path: 'email',
        message: duplicateEmail,
      },
    ])
  })

  it('catch bad email', async () => {
    // catch bad email
    const response3: any = await request(
      process.env.TEST_HOST as string,
      mutation('b', password),
    )
    expect(response3.register.length).toEqual(2)
    expect(response3.register).toEqual([
      {
        path: 'email',
        message: emailNotLongEnough,
      },
      {
        path: 'email',
        message: emailInvalid,
      },
    ])
  })

  it('catch bad password', async () => {
    // catch bad password
    const response4: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, '12'),
    )
    expect(response4.register.length).toEqual(1)
    expect(response4.register).toEqual([
      {
        path: 'password',
        message: passwordNotLongEnough,
      },
    ])
  })

  it('catch bad email and bad password', async () => {
    // catch bad email and bad password
    const response5: any = await request(
      process.env.TEST_HOST as string,
      mutation('ds', '12'),
    )
    expect(response5.register.length).toEqual(3)
    expect(response5.register).toEqual([
      {
        path: 'email',
        message: emailNotLongEnough,
      },
      {
        path: 'email',
        message: emailInvalid,
      },
      {
        path: 'password',
        message: passwordNotLongEnough,
      },
    ])
  })
})
