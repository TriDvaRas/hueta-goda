
import { Nomination, Nominee } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../../lib/prismadb';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import withApiSession from '../../../../middleware/requireApiSession';
import requireApiSession from '../../../../middleware/requireApiSession';
import { NominationFull } from '../../../../types/extendedApiTypes';
import { HGApiError, HGApiItemPutBody, HGApiItemResponse } from '../../../../types/hg-api';

import _ from 'lodash'



const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .use(withApiSession)
    .get(async (req: NextApiRequest, res: NextApiResponse<HGApiItemResponse<Nominee[]> | HGApiError>) => {
        try {
            const nominees = await prisma.nominee.findMany({
                where: {
                    nominationId: req.query.itemId as string,
                    authorUserId: req.session.user.id,
                },
            })
            res.send(nominees);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .use(requireApiSession)
    .put(async (req: NextApiRequest & { body: HGApiItemPutBody<Nominee>[] }, res: NextApiResponse<HGApiItemResponse<Nominee[]>>) => {
        try {
            const newNominees = req.body as HGApiItemPutBody<Nominee>[]
            //TODO validation
            const nomination = await prisma.nomination.findUnique({
                where: {
                    id: req.query.itemId as string
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
            }) as NominationFull
            if (!nomination) {
                res.status(404).json({ error: 'Not found', status: 404 })
            }
            else if (!nomination.Nominee) {
                const nominees = await Promise.all(newNominees.map((data: any) => prisma.nominee.create({ data })))
                res.send(_.sortBy(nominees,'position'));
            } else {
                const nominees = _.compact([
                    ...await Promise.all(nomination.Nominee.map(oldNominee => {
                        const newNominee = newNominees.find(x => x.id == oldNominee.id)
                        if (newNominee) {
                            return prisma.nominee.update({
                                where: {
                                    id: oldNominee.id
                                },
                                data: newNominee as any
                            })
                        }
                        else {
                            return prisma.nominee.delete({
                                where: {
                                    id: oldNominee.id
                                },
                            })
                        }
                    })),
                    ...await Promise.all(newNominees.map(newNominee => {
                        const oldNominee = nomination.Nominee?.find(x => x.id == newNominee.id)
                        if (!oldNominee) {
                            return prisma.nominee.create({
                                data: {
                                    imageId: newNominee.imageId as string,
                                    name: newNominee.name as string,
                                    authorUserId: req.session.user.id,
                                    nominationId: req.query.itemId as string,
                                    comment: newNominee.comment,
                                    extras: newNominee.extras as {},
                                    position: newNominee.position as number,
                                    imagePosition: newNominee.imagePosition,
                                    imageScale: newNominee.imageScale,
                                }
                            })
                        }
                    })),
                ])
                res.send(_.sortBy(nominees,'position'))
            }
        } catch (error: any) {
            console.log(error);

            res.status(500).json({ error: error.message, status: 500 })
        }
    })
