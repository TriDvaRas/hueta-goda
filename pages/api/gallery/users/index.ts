import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import nc from 'next-connect';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { HGApiError, HGApiPaginationResponse } from '../../../../types/hg-api';
import { NominationFull, UserWithStats } from '../../../../types/extendedApiTypes';
import prisma from '../../../../lib/prismadb';
import _ from 'lodash';





const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .get(async (req, res: NextApiResponse<UserWithStats[] | HGApiError>) => {
        try {
            const users = await prisma.user.findMany({
                include: {
                    Nominee: {
                        select: {
                            nominationId: true
                        }
                    }
                }
            })
            res.json(users.map(x => ({ ...x, Nominee: undefined, nominationsFilled: _.uniqBy(x.Nominee, 'nominationId').length, nomineesAdded: x.Nominee.length } as UserWithStats)))
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })