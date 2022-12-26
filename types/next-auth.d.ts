import NextAuth from "next-auth"
import { IncomingMessage, ServerResponse } from "http";
import { Session } from 'next-auth';
import { NextApiResponse } from 'next';
import { User } from "@prisma/client";
declare module "next-auth" {
  interface Session {
    user: User
  }
}
declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    session: Session
    params: any
    file?: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      buffer: Buffer,
      size: number
    }
  }
}