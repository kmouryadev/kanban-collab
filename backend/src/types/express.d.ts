import type { UserPayload } from "./userPayload";

declare global {
  namespace Express {
    export interface Request {
      user: UserPayload;
    }
  }
}
