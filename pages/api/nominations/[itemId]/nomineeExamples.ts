
import { Nominee } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import prisma from '../../../../lib/prismadb';
import adminOnly from '../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../middleware/requireApiSession';
import { NomineeWithAuthor } from '../../../../types/extendedApiTypes';
import { HGApiError, PaginationQuery, HGApiPaginationResponse, HGApiItemPostBody, HGApiItemResponse } from '../../../../types/hg-api';
import { getPrismaPaginationArgs } from '../../../../util/pagination';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(requireApiSession)
    .get(async (req: NextApiRequest, res: NextApiResponse<NomineeWithAuthor[] | HGApiError>) => {
        try {
            const nominees = await prisma.nominee.findMany({
                where: {
                    NOT: {
                        authorUserId: req.session.user.id,
                    },
                    nominationId: req.query.itemId as string
                },
                include: {
                    author: true,
                }
            })
            res.send(nominees);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })


