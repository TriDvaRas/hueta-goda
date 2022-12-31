import { AspectRatio, ImageSize } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { BarLoader } from 'react-spinners';
import { HGApiError } from '../../types/hg-api';
import { parseApiError } from '../../util/error';
import { ImageMeta } from '../../util/selectPartials';
import Crown from '../Crown';

interface Props {
    imageId?: string
    size: ImageSize
    ar?: AspectRatio
    onUploaded: (img: ImageMeta) => void
    onError: (err: HGApiError) => void
    position?: string
    scale?: number
    onImageMove?: (pos: string) => void
    onImageZoom?: (scale: number) => void
    crown?: number
    crownSize?: number
}
export default function TheImageUpload(props: Props) {
    const { imageId, size, ar, onUploaded, onError, onImageMove, scale, position, onImageZoom, crown, crownSize } = props
    const [src, setSrc] = useState(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`);
    useEffect(() => {
        setSrc(`/api/images/${imageId}?size=${ImageSize.PREVIEW}`)
        setIsBlured(true)
    }, [imageId])
    const [isBlured, setIsBlured] = useState(true)
    const [newImagePreview, setNewImagePreview] = useState<string | undefined>(undefined)
    const [isDraging, setIsDraging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const draggableImageRef = useRef<HTMLImageElement>(null)
    const handleImageZoom = (event: WheelEvent) => {
        // event.preventDefault();
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        onImageZoom && onImageZoom(Math.max(1, (scale || 1) + delta));
        console.log(Math.max(1, (scale || 1) + delta));
    };
    const handleDraggableImageMouseDown = (event: MouseEvent) => {
        const target = event.target as HTMLImageElement
        event.preventDefault();
        const initialObjectPosition = target.style.objectPosition
        const initialX = event.clientX;
        const initialY = event.clientY;
        console.log('---------------------------');

        console.log(initialObjectPosition);

        const match = initialObjectPosition.match(/(-?[\d.]+)% (-?[\d.]+)%/)
        const [initialXP, initialYP] = match ? [+match[1], +match[2]] : [50, 50]
        console.log(initialObjectPosition.match(/(-?[\d.]+)% (-?[\d.]+)%/));

        console.log([event.clientX, event.clientY]);
        console.log({
            clientWidth: target.clientWidth,
            clientHeight: target.clientHeight,
            clientX: target.clientTop,
            clientY: target.clientLeft,
        });
        console.log(event);
        const a = (event as any).nativeEvent
        const _scale = scale || 1

        const [cw, ch, nw, nh] = [target.clientWidth, target.clientHeight, target.naturalWidth, target.naturalHeight]
        const m = cw * (_scale - 1)
        const percentPerPix = 1 / (cw * _scale) * 100
        const mm = m * percentPerPix
        // const dpp = 0
        const dpp = mm * 2
        console.log({
            m, dpp,
            // scale,
            mm, percentPerPix,
            // pos: `${Math.min(Math.max(minP, xp), maxP)}% ${Math.min(Math.max(minP, yp), maxP)}%`,
            // nw, ncw,
            // ncws, nm,
            naturalWidth: target.naturalWidth,
            naturalHeight: target.naturalHeight,
            clientWidth: target.clientWidth,
            clientHeight: target.clientHeight,
            // clientX: currTarget.clientTop,
            // clientY: currTarget.clientLeft,
            // x: currTarget.x,
            // y: currTarget.y,
            // actualScale,
        });
        const handleMouseMove = (event: MouseEvent) => {
            event.preventDefault();

            const dx = event.clientX - initialX
            const dy = event.clientY - initialY
            // const currTarget = event.target as HTMLImageElement
            // const b = (event as any).nativeEvent
            const targetAR = arToCoef(ar || AspectRatio.SQUARE)
            const ppp = dx
            const naturalAR = nw / nh
            const isNaturalWider = naturalAR > targetAR
            const actualScale = isNaturalWider ? ch / nh : cw / nw
            const acw = isNaturalWider ? (nw * actualScale) : cw
            const ach = isNaturalWider ? ch : (nh * actualScale)
            const dxp = dx / (acw - cw) * 100
            const dyp = dy / (ach - ch) * 100
            const xp = initialXP - dxp
            const yp = initialYP - dyp
            console.log((nw * actualScale));

            function arToCoef(ar: AspectRatio) {
                switch (ar) {
                    case 'ULTRAWIDE':
                        return 16 / 9
                    case 'WIDE':
                        return 3 / 2
                    case 'SQUARE':
                        return 1
                    case 'TALL':
                        return 2 / 3
                    case 'ULTRATALL':
                        return 9 / 16
                }
            }


            const maxP = 100 + dpp
            const minP = 0


            // console.log(_.reduce(a, function (result: any, value, key: any) {
            //     if (b && !_.isEqual(value, (b as any)[key]))
            //         result[key] = (b as any)[key]
            //     return result
            // }, {}));

            onImageMove && onImageMove(`${Math.min(Math.max(minP, xp), maxP)}% ${Math.min(Math.max(minP, yp), maxP)}%`)

        };
        const handleMouseUp = (event: MouseEvent) => {
            event.preventDefault();
            if (document) {
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('mousemove', handleMouseMove);
            }
        };
        if (document) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };


    function handleDrop(files: any) {
        if (isUploading) {
            return
        }
        const preview = URL.createObjectURL(files[0])
        setNewImagePreview(preview)
        // if (onDrop)
        //     onDrop(preview)
        setIsUploading(true)
        // if (onUploadStarted)
        //     onUploadStarted()
        const form = new FormData()
        form.append("image", files[0], files[0].name)
        axios.post<ImageMeta>(`/api/images/upload`, form, {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: data => {
                setUploadProgress(Math.round((100 * data.loaded) / (data.total || 1)))
            },
        })
            .then((res) => {
                setIsUploading(false)
                onUploaded(res.data)
            })
            .catch((err: AxiosError<HGApiError>) => {
                setIsUploading(false)
                onError(parseApiError(err))
            })
    }
    if (!imageId || isUploading) {
        return (
            < Dropzone
                disabled={isUploading}
                onDropAccepted={handleDrop}
                accept={{
                    'image/*': [
                        '.png', '.jpg', '.jpeg', '.gif'
                    ]
                }}
                onDropRejected={(e) => {
                    onError({
                        status: 400,
                        error: e[0].errors.map(x => x.message).join(`. `)
                    })
                }}
                maxFiles={1}
                maxSize={10 * 1024 * 1024}
                multiple={false}
                onDrop={() => setIsDraging(false)}
                onDragEnter={() => setIsDraging(true)}
                onDragLeave={() => setIsDraging(false)}
            >
                {({ getRootProps, getInputProps }) => <div
                    {...getRootProps()}
                    className={`image-upload-container ${ar ? `ar-${ar}` : ''} `}
                    style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                        width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        margin: '0 auto',
                    }}
                >
                    {isUploading ?
                        <div className='w-100 h-100 px-5 d-flex align-items-center justify-content-center' style={{
                            backgroundColor: '#0008',
                            zIndex: 199,
                            position: 'absolute',
                        }}>
                            <BarLoader color={'var(--bs-primary)'}
                                width={'50%'}
                                height={5}
                                style={{
                                }} />
                        </div> :
                        <div key={1} className='image-upload-overlay d-flex align-items-center justify-content-center' style={{ zIndex: 99 }}><i key={2} className="bi bi-upload " style={{ fontSize: '1.75rem', }}></i></div>
                    }
                    <ReactImage
                        className={` ${ar ? `ar-${ar}` : ''} `}
                        src={`/errorAvatar.jpg`}
                        alt='fuck'
                        style={{
                            borderRadius: '10px',
                            opacity: .7,
                            height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                            width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            display: 'block',
                        }}
                        onError={(e: any) => { e.target.onerror = null; e.target.src = "/errorAvatar.jpg" }}
                    />

                </div>}
            </Dropzone>

        )

    }
    return (
        < Dropzone
            disabled={isUploading}
            onDropAccepted={handleDrop}
            accept={{
                'image/*': [
                    '.png', '.jpg', '.jpeg', '.gif'
                ]
            }}
            onDropRejected={(e) => {
                onError({
                    status: 400,
                    error: e[0].errors.map(x => x.message).join(`. `)
                })
            }}
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
            multiple={false}
            onDrop={() => setIsDraging(false)}
            onDragEnter={() => setIsDraging(true)}
            onDragLeave={() => setIsDraging(false)}
        >
            {({ getRootProps, getInputProps }) => {
                const { onClick, ...rootProps } = getRootProps();
                return <div
                    {...{
                        ...rootProps,
                        onClick: e => e.stopPropagation()
                    }}
                    className={`image-upload-container  ${ar ? `ar-${ar}` : ''} `}
                    style={{
                        borderRadius: '10px',
                        // maxWidth: '100%',
                        // maxHeight: '100%',
                        // margin: '0 auto',
                        position: 'relative',
                        height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL || ar == AspectRatio.SQUARE ? '100%' : 'auto',
                        width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE || ar == AspectRatio.SQUARE ? '100%' : 'auto',

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
                    <Button variant='secondary' onClick={onClick} key={1} className='d-flex align-items-center justify-content-center m-2' style={{
                        zIndex: 201,
                        position: 'absolute',
                        right: 0,
                        opacity: .7,
                        // paddingRight: 10,
                        // paddingTop: 5,
                    }}><i key={2} className="bi bi-upload " style={{ fontSize: '1.50rem', }}></i></Button>
                    <ReactImage
                        ref={draggableImageRef}
                        onMouseDown={handleDraggableImageMouseDown as any}
                        className={`${ar ? `ar-${ar}` : ''} `}
                        src={src}
                        alt='fuck'
                        style={{
                            borderRadius: '10px',
                            height: ar == AspectRatio.TALL || ar == AspectRatio.ULTRATALL ? '100%' : 'auto',
                            width: ar == AspectRatio.WIDE || ar == AspectRatio.ULTRAWIDE ? '100%' : 'auto',
                            // maxWidth: '100%',
                            // maxHeight: '100%',
                            display: 'block',
                            objectPosition: position || '50% 50%',
                            transformOrigin: '0% 0%',
                            transform: `scale(${scale || 1})`,
                            overflow: 'hidden',

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
                    // onWheel={handleImageZoom as any}
                    />
                </div>
            }}
        </Dropzone >

    )
}