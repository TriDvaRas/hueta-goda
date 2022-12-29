import { AspectRatio, ImageSize } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';

interface Props {
    imageId?: string
    size?: ImageSize
    ar?: AspectRatio
    position?: string
    scale?: number
}
export default function TheImage(props: Props) {
    const { imageId, size: _size, ar, scale, position } = props
    const size = _size || ImageSize.ORIGINAL
    const [src, setSrc] = useState(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`);
    useEffect(() => {
        setSrc(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`)
        setIsBlured(true)
    }, [imageId])
    const [isBlured, setIsBlured] = useState(true)
    if (!imageId) {
        return (
            <div
                className={`${ar ? `ar-${ar}` : ''} `}
                style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                    width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
                }}
            >
                <ReactImage
                    className={` ${ar ? `ar-${ar}` : ''} `}
                    src={`/errorAvatar.jpg`}
                    alt='fuck'
                    style={{
                        opacity: .7,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                        width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
                        display: 'block',
                    }}
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                />
            </div>
        )
    }
    return (
        <div
            className={`${ar ? `ar-${ar}` : ''} `}
            style={{
                borderRadius: '10px',
                overflow: 'hidden',
                maxWidth: '100%',
                maxHeight: '100%',

                height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
            }}
        >
            <ReactImage
                className={`${ar ? `ar-${ar}` : ''} `}
                src={src}
                alt='fuck'
                style={{
                    height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                    width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    objectPosition: position || '50% 50%',
                    transformOrigin: '0% 0%',
                    transform: `scale(${scale || 1})`,
                    // opacity: 0.5,
                    // overflow: 'visible',
                    filter: isBlured ? 'blur(20px)' : 'none'
                }}
                onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                onLoad={() => {
                    if (src.endsWith(size))
                        setIsBlured(false)
                    else {
                        setIsBlured(true)
                        setSrc(`/api/images/${imageId}?size=${size}`)
                    }
                }}
            />
        </div>
    )
}