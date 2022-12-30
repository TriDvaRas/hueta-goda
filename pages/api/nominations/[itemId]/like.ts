
import { Nomination, NominationLike } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { send } from 'process';
import prisma from '../../../../lib/prismadb';
import adminOnly from '../../../../middleware/adminOnly';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import withApiSession from '../../../../middleware/requireApiSession';
import requireApiSession from '../../../../middleware/requireApiSession';
import { NominationFull } from '../../../../types/extendedApiTypes';
import { HGApiItemPutBody, HGApiItemResponse } from '../../../../types/hg-api';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(requireApiSession)
    .post(async (req: NextApiRequest, res: NextApiResponse<HGApiItemResponse<NominationLike[]>>) => {
        try {
            let nominationLikes = await prisma.nominationLike.findMany({
                where: {
                    nominationId: req.query.itemId as string
                }
            })
            const oldLike = nominationLikes.findIndex(x => x.userId === req.session.user.id)

            if (req.query.value !== `${oldLike > -1}`) {
                if (oldLike == -1) {
                    const newLike = await prisma.nominationLike.create({
                        data: {
                            nominationId: req.query.itemId as string,
                            userId: req.session.user.id
                        }
                    })
                    nominationLikes.push(newLike)
                    res.send(nominationLikes)
                }
                else {
                    await prisma.nominationLike.delete({
                        where: {
                            id: nominationLikes[oldLike].id
                        }
                    })
                    nominationLikes.splice(oldLike, 1)
                    res.send(nominationLikes)
                }
            }
            else
                res.status(204).send(nominationLikes);

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
