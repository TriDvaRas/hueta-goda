import { NextApiResponse, NextApiRequest } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { authOptions } from '../pages/api/auth/[...nextauth]';
export default async function adminOnly(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    if (req.session.user) {
        await next()
    }
    else {
        res.status(403).json({ error: 'Иди нахуй', status: 403 })
    }
}