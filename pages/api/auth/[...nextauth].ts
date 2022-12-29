import NextAuth, { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

export const authOptions: NextAuthOptions = {
    callbacks: {
        session(params) {
            return { ...params.session, user: { ...params.session.user, id: params.user.id, role:(params.user as any).role } }
        },
    },
    adapter: PrismaAdapter(prisma),
    session: {
        maxAge: 1 * 24 * 60 * 60, // 1 days
    },
    providers: [
        {
            ...DiscordProvider({
                clientId: process.env.CLIENT_ID as string,
                clientSecret: process.env.CLIENT_SECRET as string
            }),
            // profile(profile, tokens) {
            //     if (profile.avatar === null) {
            //         const defaultAvatarNumber = parseInt(profile.discriminator) % 5
            //         profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
            //     } else {
            //         const format = profile.avatar.startsWith("a_") ? "gif" : "png"
            //         profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
            //     }
            //     return {
            //         id: profile.id,
            //         name: profile.username,
            //         email: null,
            //         image: profile.image_url,
            //     }
            // },
        }
    ],
}
export default NextAuth(authOptions)