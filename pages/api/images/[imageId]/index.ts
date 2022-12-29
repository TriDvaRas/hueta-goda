import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import prisma from '../../../../lib/prismadb';
import commonErrorHandlers from '../../../../middleware/commonErrorHandlers';
import { ImageSize } from '@prisma/client';




const router = nc<NextApiRequest, NextApiResponse>({ ...commonErrorHandlers });

export default router
    .get(async (req: NextApiRequest & { query: { size?: ImageSize } }, res: NextApiResponse) => {
        const image = await prisma.image.findUnique({
            where: {
                id_size: {
                    id: req.query.imageId as any,
                    size: req.query.size || ImageSize.ORIGINAL
                }
            }
        })
        if (!image) {
            return res.status(404).send('Not found')
        }
        const imageBuffer = Buffer.from(image.imageData, 'base64');
        // Set the content-type and attachment headers
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="image.jpg"');
        // Send the image as the response
        res.send(imageBuffer);
    })