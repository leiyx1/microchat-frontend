import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"
import "next-auth/jwt"

export const {
  handlers: {GET, POST},
  signIn,
  signOut,
  auth
} = NextAuth({
  debug: true,
  providers: [Keycloak],
  // session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile}){
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          preferred_username: profile!.preferred_username!,
          access_token: account.access_token!,
          expires_at: account.expires_at!,
          refresh_token: account.refresh_token!,
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token")
 
        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch("https://auth.leiyx.com/realms/microchat/protocol/openid-connect/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.AUTH_KEYCLOAK_ID!,
              client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token!,
            }),
          })
 
          const tokensOrError = await response.json()
 
          if (!response.ok) throw tokensOrError
 
          const newTokens = tokensOrError as {
            access_token: string
            expires_in: number
            refresh_token?: string
          }
 
          return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refresh_token: newTokens.refresh_token
              ? newTokens.refresh_token
              : token.refresh_token,
          }
        } catch (error) {
          console.error("Error refreshing access_token", error)
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError"
          return token
        }
      }
    },
    async session({ session, token }) {
      session.error = token.error
      session.accessToken = token.access_token
      session.user.preferred_username = token.preferred_username
      return session
    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})

declare module "next-auth" {
  interface User {
    preferred_username: string
  }

  interface Session {
    error?: "RefreshTokenError"
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshTokenError"
    preferred_username: string
  }
}

