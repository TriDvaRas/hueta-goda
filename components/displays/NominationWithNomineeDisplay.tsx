import { ImageSize, Nomination, Nominee } from '@prisma/client';
import { useRef, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import EdiText from 'react-editext';
import { RectShape } from 'react-placeholder/lib/placeholders';
import { useElementSize } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import TheImage from '../image/TheImage';

interface Props {
    nomination: Nomination,
    nominee?: Nominee,
    textSource?: 'nomination' | 'nominee' | 'none'
    imageSize?: ImageSize
    className?: string
    compactWidth?: boolean
}
export default function NominationWithNomineeDisplay(props: Props) {
    const { nomination, textSource, nominee, imageSize, className, compactWidth } = props
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
        <div className={`${className || ''} w-100 mw-100 `} ref={squareRef}>
            <div className={` `} style={{
                width: width,
                // height: compactWidth ? width + 32 : width,
                height: width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {nominee?.imageId ?
                    <TheImage crownSize={40} crown={nominee.position} size={imageSize || 'ORIGINAL'} imageId={nominee?.imageId} ar={nomination.aspectRatio} position={nominee?.imagePosition} scale={nominee?.imageScale} /> :
                    <TheImage ar={nomination.aspectRatio} />
                }
            </div>
            {textSource !== 'none' && <div ref={containerRef} className='w-100' style={{ height: width / 4 }}>
                <h1 ref={textRef} className='impact text-center' >{(text || 'Sample Text').toUpperCase()}</h1>
            </div>}
        </div>

    )
}