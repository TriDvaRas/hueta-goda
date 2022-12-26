
import { Nomination } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../../lib/prismadb';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../middleware/requireApiSession';
import { HGApiItemPutBody, HGApiItemResponse } from '../../../../types/hg-api';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .get(async (req: NextApiRequest, res: NextApiResponse<HGApiItemResponse<Nomination>>) => {
        try {
            const nomination = await prisma.nomination.findUnique({
                where: {
                    id: req.query.itemId as string
                }
            })
            res.send(nomination);

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .put(async (req: NextApiRequest & { body: HGApiItemPutBody<Nomination> }, res: NextApiResponse<HGApiItemResponse<Nomination>>) => {
        try {
            const body = req.body
            //TODO validation
            const nomination = await prisma.nomination.update({
                where: { id: req.query.itemId as string },
                data: body
            })
            res.send(nomination);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
