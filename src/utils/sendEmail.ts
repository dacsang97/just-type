import * as SparkPost from 'sparkpost'

export const sendEmail = async (recipient: string, url: string) => {
  const client = new SparkPost(process.env.SPARK_APIKEY)
  const response = await client.transmissions.send({
    options: {
      sandbox: true,
    },
    content: {
      from: 'justype@sparkpostbox.com',
      subject: 'Confirm Email',
      html: `<html>
        <body>
        <p>Testing SparkPost - the world's most awesomest email service!</p>
        <a href="${url}">confirm email</a>
        </body>
        </html>`,
    },
    recipients: [{ address: recipient }],
  })
  console.log(response)
}
