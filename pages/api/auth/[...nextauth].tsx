import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
});

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider === "google") {
        return (
          profile.email_verified &&
          (profile.email === "dirkthomasmulder@gmail.com" ||
            profile.email === "bernardomnicasa@gmail.com" ||
            profile.email === "dirkomnicasa@gmail.com")
        );
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },
};
export default NextAuth(authOptions as any);
