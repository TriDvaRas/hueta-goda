
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import {
    Card, Form, Image as ReactImage, ProgressBar,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { HGApiError } from '../../types/hg-api';
import { parseApiError } from '../../util/error';
import { ImageMeta } from '../../util/selectPartials';


interface Props {
    onDrop?: (fileURL: string) => void;
    onUploadStarted?: () => void;
    onUploaded: (image: ImageMeta) => void;
    placeholderUrl?: string;
    onError: (err: HGApiError) => void
    allowGif?: boolean
    compact?: boolean
    disabled?: boolean
}
export default function ImageUpload(props: Props) {
    const { onDrop, onUploaded, placeholderUrl, onError, allowGif, onUploadStarted, compact, disabled } = props

    const [imagePreview, setImagePreview] = useState<string | undefined>(placeholderUrl)
    const [isDraging, setIsDraging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    function handleDrop(files: any) {
        const preview = URL.createObjectURL(files[0])
        setImagePreview(preview)
        if (onDrop)
            onDrop(preview)
        setIsUploading(true)
        if (onUploadStarted)
            onUploadStarted()
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
    const height = compact ? 36 : 40
    return (
        < Dropzone
            disabled={disabled || isUploading}
            onDropAccepted={handleDrop}
            accept={{
                'image/*': [
                    '.png', '.jpg', '.jpeg', ...(allowGif ? ['.gif'] : [])
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
            {({ getRootProps, getInputProps }) =>
                <Form.Group  {...getRootProps()}>
                    {//@ts-ignore
                        <Form.Control id={`file-input`} as={'input'} {...getInputProps()} />
                    }
                    <Card
                        className={`bg-dark-${disabled ? '200' : '900'} image-upload-container ${isDraging ? 'bg-dark-700' : ''}`}
                        style={{ cursor: disabled ? 'default' : 'pointer', minHeight: height + 2, maxHeight: height + 2, borderColor: '#332b3f' }}
                    >
                        {disabled ? null
                            : imagePreview ? [
                                <ReactImage key={1} alt={'img'} src={imagePreview} className='image-upload-image' />,
                                isUploading ? <div key={3} className='image-upload-overlay-loading  '>
                                    <ProgressBar now={100 * uploadProgress} style={{ height: height }} />
                                </div> :
                                    <div key={2} className='image-upload-overlay'><i className="bi bi-upload" style={{ fontSize: compact ? '1.50rem' : '1.75rem' }}></i></div>
                            ] : [
                                <div key={1} className='image-upload-overlay'></div>,
                                <i key={2} className="bi bi-upload" style={{ fontSize: compact ? '1.50rem' : '1.75rem' }}></i>
                            ]}
                    </Card>
                </Form.Group>
            }
        </Dropzone >
    )
}