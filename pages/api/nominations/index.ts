
import { Nomination } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../lib/prismadb';
import adminOnly from '../../../middleware/adminOnly';
import commonErrorHandlers from '../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../middleware/requireApiSession';
import { NominationFull } from '../../../types/extendedApiTypes';
import { HGApiError, HGApiItemPostBody, HGApiItemResponse, HGApiPaginationResponse, PaginationQuery } from '../../../types/hg-api';
import { getPrismaPaginationArgs } from '../../../util/pagination';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(requireApiSession)
    .get(async (req: NextApiRequest & { query: PaginationQuery<Nomination> }, res: NextApiResponse<HGApiPaginationResponse<NominationFull[]> | HGApiError>) => {
        try {
            const { orderBy, skip, pageSize, page, prismaParams } = getPrismaPaginationArgs(req.query, 'priority');
            const extraParams = {}
            const nominations = prisma.nomination.findMany({
                ...prismaParams,
                where: {
                    authorUserId: req.query.ownerId
                },
                include: {
                    author: true,
                    Nominee: {
                        where: {
                            authorUserId: req.session.user.id
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                }
            })
            const totalItems = prisma.nomination.count();

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
    .use(adminOnly)
    .post(async (req: NextApiRequest & { body: HGApiItemPostBody<Nomination> }, res: NextApiResponse<HGApiItemResponse<NominationFull>>) => {
        try {
            const body = req.body
            //TODO validation
            const nomination = await prisma.nomination.create({
                data: {
                    ...body,
                    authorUserId: req.session.user.id
                },
                include: {
                    author: true,
                    Nominee: {
                        where: {
                            authorUserId: req.session.user.id
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                }
            })
            res.send(nomination);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })

