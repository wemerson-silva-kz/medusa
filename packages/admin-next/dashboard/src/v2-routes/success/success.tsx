import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { decodeToken } from "react-jwt"
import { useCreateUserAndSetSession } from "../../lib/api-v2"
import { medusa } from "../../lib/medusa"

export const Success = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { mutateAsync: createUserAndSession } = useCreateUserAndSetSession()

  const authToken = searchParams.get("auth_token")
  const newUser: any = authToken ? decodeToken(authToken) : null

  useEffect(() => {
    createUserAndSession(
      {
        email: newUser?.user_metadata.email,
        first_name: newUser?.user_metadata.given_name,
        last_name: newUser?.user_metadata.family_name,
        token: authToken!,
      },
      {
        onSuccess: async ({ token }) => {
          // Convert the JWT to a session cookie
          //  TODO: Consider if the JWT is a good choice for session token
          await medusa.client.request(
            "POST",
            "/auth/session",
            {},
            {},
            {
              Authorization: `Bearer ${token}`,
            }
          )

          navigate("/settings", { replace: true })
        },
      }
    )
  }, [authToken])

  return (
    <div className="min-h-dvh w-dvw bg-ui-bg-base relative flex items-center justify-center p-4">
      <div className="flex w-full max-w-[300px] flex-col items-center">
        {/* <div className="max-h-[557px] w-full will-change-contents"> */}
        {/* {isValidInvite ? null : <InvalidView />} */}
        {/* </div> */}
      </div>
    </div>
  )
}
