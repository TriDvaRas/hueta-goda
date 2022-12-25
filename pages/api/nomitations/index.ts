
import { Nominee } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import prisma from '../../../lib/prismadb';
import adminOnly from '../../../middleware/adminOnly';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../middleware/requireApiSession';
import { HGApiError, PaginationQuery, HGApiPaginationResponse, HGApiItemPostBody, HGApiItemResponse } from '../../../types/hg-api';
import { getPrismaPaginationArgs } from '../../../util/pagination';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(requireApiSession)
    .use(adminOnly)
    .get(async (req: NextApiRequest & { query: PaginationQuery<Nominee> }, res: NextApiResponse<HGApiPaginationResponse<Nominee[]>>) => {
        try {
            const { orderBy, skip, pageSize, page, prismaParams } = getPrismaPaginationArgs(req.query, 'position');
            const nominations = prisma.nominee.findMany(prismaParams)
            const totalItems = prisma.nominee.count();

            await Promise.all([nominations, totalItems])
                .then(([items, totalItems]) => {
                    const totalPages = Math.ceil(totalItems / pageSize);
                    res.send({
                        items,
                        page,
                        totalPages,
                        totalItems,
                    });
                })
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .post(async (req: NextApiRequest & { body: HGApiItemPostBody<Nominee> }, res: NextApiResponse<HGApiItemResponse<Nominee>>) => {
        try {
            const body = req.body
            //TODO validation
            const nominee = await prisma.nominee.create({
                data: body
            })
            res.send(nominee);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })

