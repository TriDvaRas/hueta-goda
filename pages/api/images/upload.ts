import { ImageSize } from '@prisma/client'
import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect"
import path from 'path'
import sharp from 'sharp'
import prisma from '../../../lib/prismadb'
import commonErrorHandlers from '../../../middleware/commonErrorHandlers'
import requireApiSession from '../../../middleware/requireApiSession'
import { HGApiError } from '../../../types/hg-api'
import { ImageMetaSelectPartial, ImageMeta } from '../../../util/selectPartials';

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    }
}
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })
const router = nc<NextApiRequest, NextApiResponse>(commonErrorHandlers);
export default router
    .use(requireApiSession)
    .use(upload.single('image') as any)
    .post(async (req, res: NextApiResponse<ImageMeta | HGApiError>) => {
        if (req.file) {
            const rawImage = sharp(req.file.buffer)
            const meta = await rawImage.metadata()
            const ext = path.extname(req.file.originalname)
            const original: ImageMeta = await prisma.image.create({
                data: {
                    addedByUserId: req.session.user.id,
                    imageData: (await rawImage.toBuffer()).toString('base64'),
                    mime: req.file.mimetype,
                    size: 'ORIGINAL'
                },
                select: ImageMetaSelectPartial
            })
            //TODO gif support
            const images = await prisma.image.createMany({
                data: await Promise.all(Object.values(ImageSize).filter(s => s !== 'ORIGINAL').map(async s => {
                    if (!req.file)
                        throw new Error('No File')
                    const maxSize = getImageSizePx(s)
                    const buffer = await ((maxSize < (meta.height || 10000) && maxSize < (meta.width || 10000) ?
                        rawImage.resize(maxSize, maxSize, { fit: 'outside' }) : rawImage)
                        .toBuffer())
                    return {
                        id: original.id,
                        addedByUserId: req.session.user.id,
                        imageData: buffer.toString('base64'),
                        mime: req.file.mimetype,
                        size: s
                    }
                })),
            })
            res.json(original)
        }
        else
            res.status(400).json({ error: 'No file', status: 400 })

    })


function getImageSizePx(size: ImageSize) {
    switch (size) {
        case 'PREVIEW':
            return 100
        case 'SMALL':
            return 224
        case 'MEDIUM':
            return 560
        case 'LARGE':
            return 1100
        case 'ORIGINAL':
            return 0
        default:
            return 1100
    }
}
