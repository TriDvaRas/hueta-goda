import { NextApiResponse, NextApiRequest } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { authOptions } from '../pages/api/auth/[...nextauth]';
export default async function requireApiSession(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session) {
        req.session = session
        await next(); 
    }
    else {
        res.status(403).json({ error: 'Иди нахуй', status: 403 })
    }
}