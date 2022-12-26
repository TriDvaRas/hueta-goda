import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import nc from 'next-connect';
import adminOnly from '../../middleware/adminOnly';
import commonErrorHandlers from '../../middleware/commonErrorHandlers';
import requireApiSession from '../../middleware/requireApiSession';
import { HGApiError, HGApiPaginationResponse } from '../../types/hg-api';




const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .get(async (req, res: NextApiResponse<HGApiPaginationResponse<unknown> | HGApiError>) => {
        
    })