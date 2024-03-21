import { MiddlewareRoute } from "../../types/middlewares"
import { authenticate } from "../../utils/authenticate-middleware"

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/auth/session",
    middlewares: [authenticate(/.*/, "bearer")],
  },
  {
    method: ["POST"],
    matcher: "/auth/:scope/:authProvider/callback",
    middlewares: [],
  },
  {
    method: ["POST"],
    matcher: "/auth/:scope/:authProvider",
    middlewares: [],
  },
]
