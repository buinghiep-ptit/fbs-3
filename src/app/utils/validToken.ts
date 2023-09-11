import jwtDecode from 'jwt-decode'

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false
  }
  const decodedToken = jwtDecode(accessToken)
  const currentTime = Date.now() / 1000

  return (decodedToken as any)?.exp > currentTime + 5 * 60
}
