import { Image } from "@prisma/client"

export const ImageMetaSelectPartial = {
    id: true,
    size: true,
    mime: true,
    createdAt: false,
    updatedAt: false,
    imageData: false,
    addedByUserId: false,
}
export type ImageMeta = Omit<Image, 'imageData' | 'addedByUserId' | 'createdAt' | 'updatedAt'>