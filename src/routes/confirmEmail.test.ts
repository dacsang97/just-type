import * as fetch from 'node-fetch'

it('send invalid back if bad id sent', async () => {
  const response = await fetch(`${process.env.TEST_HOST}/confirm/ahihi`)
  const text = await response.text()
  expect(text).toEqual('invalid')
})
