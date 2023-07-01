import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw Error("Expected 'val' to be defined, but received " + val);
  }
}
