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
}
export default function TheImage(props: Props) {
    const { imageId, size, ar } = props
    const [src, setSrc] = useState(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`);
    useEffect(() => {
        setSrc(`/api/images/${imageId}?size=${size}`)
    }, [imageId, size])

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
                    margin: '0 auto',
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
                margin: '0 auto',
            }}
        >
            <ReactImage
                className={`${ar ? `ar-${ar}` : ''} `}
                src={src}
                onLoad={() => setSrc(`/api/images/${imageId}?size=${size}`)}
                alt='fuck'
                style={{
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