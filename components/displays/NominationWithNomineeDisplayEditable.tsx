import { ImageSize, Nomination, Nominee } from '@prisma/client';
import { useEffect, useRef } from 'react';
import EdiText from 'react-editext';
import { RectShape } from 'react-placeholder/lib/placeholders';
import { useElementSize } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import { ImageMeta } from '../../util/selectPartials';
import TheImage from '../image/TheImage';
import TheImageUpload from '../image/TheImageUpload';

interface Props {
    nomination: Nomination,
    nominee?: Nominee,
    textSource?: 'nomination' | 'nominee' | 'none'
    imageSize?: ImageSize
    onImageChange: (image: ImageMeta) => void
    onImageMove: (position: string) => void
    onImageZoom: (scale: number) => void
}
export default function NominationWithNomineeDisplayEditable(props: Props) {
    const { nomination, textSource, nominee, imageSize, onImageChange, onImageMove, onImageZoom } = props
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 30
    const text = textSource == 'nomination' ? nomination.name : nominee?.name

    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && textRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            let fontSize = width / 8;
            textRef.current.style.fontSize = `${fontSize}px`;
            while (textRef.current.offsetWidth > containerWidth || textRef.current.offsetHeight > containerHeight) {
                fontSize -= 1;
                textRef.current.style.fontSize = `${fontSize}px`;
            }
        }
    }, [width, text]);

    return (
        <div className='w-100 mw-100 image-upload-container-big' ref={squareRef}>
            <div className='py-2' style={{
                width, height: width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {nominee?.imageId ?
                    <TheImageUpload position={nominee.imagePosition} scale={nominee.imageScale} onImageMove={onImageMove} onUploaded={onImageChange} onImageZoom={onImageZoom} onError={() => { }} size={imageSize || 'ORIGINAL'} imageId={nominee.imageId} ar={nomination.aspectRatio} /> :
                    <TheImageUpload size={'LARGE'} onUploaded={onImageChange} onError={() => { }} ar={nomination.aspectRatio} />
                }
            </div>
            {textSource !== 'none' && <div ref={containerRef} className='w-100' style={{ height: width / 4 }}>
                <h1 ref={textRef} className='impact text-center' >{(text || 'Sample Text').toUpperCase()}</h1>
            </div>}
        </div>

    )
}