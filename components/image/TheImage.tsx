import { AspectRatio, ImageSize } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Form, Image as ReactImage, ProgressBar, Button } from 'react-bootstrap';

import { useLocalStorage } from 'usehooks-ts';
import Crown from '../Crown';

interface Props {
    imageId?: string
    size?: ImageSize
    ar?: AspectRatio
    position?: string
    scale?: number
    crown?: number
    crownSize?: number
    hasSpoilers?: boolean
    hasNSFW?: boolean
    onExpandClick?: () => void
}
export default function TheImage(props: Props) {
    const { imageId, size: _size, ar, scale, position, crown, crownSize, hasNSFW, hasSpoilers } = props
    const size = _size || ImageSize.ORIGINAL
    const [src, setSrc] = useState(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`);

    const [showSpoilerGlobal, setShowSpoilerGlobal] = useLocalStorage('showSpoilerGlobal', false)
    const [showNSFWGlobal, setShowNSFWGlobal] = useLocalStorage('showNSFWGlobal', false)
    const [showSpoiler, setShowSpoiler] = useState(showSpoilerGlobal)
    const [showNSFW, setShowNFSW] = useState(showNSFWGlobal)
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
                        borderRadius: '10px',
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
                maxWidth: '100%',
                maxHeight: '100%',
                position: 'relative',
                height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
            }}
        >
            <div style={{
                zIndex: 200,
                position: 'absolute',
                right: 0,
                top: 0,
                overflow: 'visible',
                translate: '50% -50%',
                opacity: isBlured ? 0 : 1
                // paddingRight: 10,
                // paddingTop: 5,
            }}>
                <Crown size={crownSize || 80} cornered position={crown || -1} />
            </div>
            {hasSpoilers && !showSpoiler && <div key={1} className='image-spoiler-overlay d-flex align-items-center flex-column justify-content-center' style={{ zIndex: 99 }}>
                <div className='text-center mb-2' style={{}}>Изображение содержит спойлеры</div>
                <Button variant='outline-danger text-light' onClick={() => setShowSpoiler(true)}>Показать</Button>
            </div>}
            {hasNSFW && !showNSFW && <div key={1} className='image-spoiler-overlay d-flex align-items-center flex-column justify-content-center' style={{ zIndex: 99 }}>
                <div className='text-center mb-2' style={{ opacity: 1 }}>Изображение содержит NSFW контент</div>
                <Button variant='outline-danger text-light' style={{ opacity: 1 }} onClick={() => setShowNFSW(true)}>Показать</Button>
            </div>}
            <div className={`${ar ? `ar-${ar}` : ''} `}
                style={{
                    overflow: 'hidden',
                    borderRadius: '10px',
                    height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                    width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    objectPosition: position || '50% 50%',
                    transformOrigin: '0% 0%',
                    transform: `scale(${scale || 1})`,
                    // opacity: 0.5,
                    // overflow: 'visible',
                }}
            >
                <ReactImage
                    className={`${ar ? `ar-${ar}` : ''} `}
                    src={src}
                    alt='fuck'
                    style={{
                        borderRadius: '10px',
                        height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                        width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'block',
                        objectPosition: position || '50% 50%',
                        transformOrigin: '0% 0%',
                        transform: `scale(${scale || 1})`,
                        // opacity: 0.5,
                        // overflow: 'visible',
                        filter: isBlured || (hasSpoilers && !showSpoiler) || (hasNSFW && !showNSFW) ? 'blur(20px)' : 'none'
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
        </div>
    )
}