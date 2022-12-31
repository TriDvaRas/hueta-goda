import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import nc from 'next-connect';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers';
import { HGApiError, HGApiPaginationResponse } from '../../../../../types/hg-api';
import { NominationFull, UserWithStats, UserWithNominationsFull } from '../../../../../types/extendedApiTypes';
import prisma from '../../../../../lib/prismadb';
import _ from 'lodash';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .get(async (req, res: NextApiResponse<UserWithNominationsFull | HGApiError>) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.query.userId as string
                },
                include: {
                    Nominee: {
                        select: {
                            nominationId: true
                        }
                    }
                }
            })
            if (!user)
                return res.status(404).json({ error: `User does not exist`, status: 404 })
            const nominations = await prisma.nomination.findMany({
                where: {
                    id: {
                        in: _.uniq(user.Nominee.map(x => x.nominationId))
                    }
                },
                include: {
                    author: true,
                    Nominee: {
                        orderBy: {
                            position: 'asc'
                        }
                    },
                    NominationLike: true
                }
            })
            res.json({ ...user, Nominee: undefined, nominations } as UserWithNominationsFull)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })