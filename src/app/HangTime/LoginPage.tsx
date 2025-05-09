import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

export function LoginPage() {
  const responseMessage = (response: CredentialResponse) => {
    console.log(response)
  }
  const errorMessage = () => {
    console.log("error")
  }
  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  )
}
