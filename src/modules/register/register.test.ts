import { request } from "graphql-request";
import { AddressInfo } from "net";
import { startServer } from "../../startServer";
import { User } from "../../entity/User";

let getHost = "";

beforeAll(async () => {
  const app = await startServer();
  const { port } = app.address() as AddressInfo;
  getHost = `http://127.0.0.1:${port}`;
});

const email = "dacsang971@gmail.com";
const password = "123456";
const mutation = `
mutation {
  register(email: "${email}", password: "${password}") {
    path
    message
  }
}
`;

interface IRegisterResponse {
  register: any[];
}

test("Register user", async () => {
  const response = await request(getHost, mutation);
  expect(response).toEqual({ register: null });
  const users = await User.find({ where: { email } });
  expect(users.length).toEqual(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  const response2 = await request<IRegisterResponse>(getHost, mutation);
  expect(response2.register.length).toEqual(1);
  expect(response2.register[0].path).toEqual("email");
});
