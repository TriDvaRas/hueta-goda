
import { Nomination } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../../lib/prismadb';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import withApiSession from '../../../../middleware/requireApiSession';
import requireApiSession from '../../../../middleware/requireApiSession';
import { NominationFull } from '../../../../types/extendedApiTypes';
import { HGApiItemPutBody, HGApiItemResponse } from '../../../../types/hg-api';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(withApiSession)
    .get(async (req: NextApiRequest, res: NextApiResponse<HGApiItemResponse<Nomination | NominationFull>>) => {
        try {
            const nomination = await prisma.nomination.findUnique({
                where: {
                    id: req.query.itemId as string
                },
                include: req.query.full == 'true' && req.session ? {
                    author: true,
                    Nominee: {
                        where: {
                            authorUserId: req.session.user.id
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                } : undefined
            })
            res.send(nomination);

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .put(async (req: NextApiRequest & { body: HGApiItemPutBody<Nomination | NominationFull> }, res: NextApiResponse<HGApiItemResponse<Nomination | NominationFull>>) => {
        try {
            const body = req.body
            //TODO validation
            const nomination = await prisma.nomination.update({
                where: { id: req.query.itemId as string },
                data: body,
                include: req.query.full == 'true' ? {
                    author: true,
                    Nominee: {
                        where: {
                            authorUserId: req.session.user.id
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                } : undefined
            })
            res.send(nomination);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
