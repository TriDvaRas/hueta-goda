import { ImageSize, Nomination } from '@prisma/client';
import { useRef, useEffect } from 'react';
import { Image } from 'react-bootstrap';
import EdiText from 'react-editext';
import { RectShape, text } from 'react-placeholder/lib/placeholders';
import { useElementSize } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import TheImage from '../image/TheImage';

interface Props {
    nomination: NominationFull,
    name?: 'nomination' | 'nominee' | 'none'
    nomineePosition?: number
    onTextEdit?: (text: string) => void
}
export default function NominationFullPreview(props: Props) {
    const { nomination, name, nomineePosition, onTextEdit } = props
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 30
    const nominee = (nomineePosition ? (nomination.Nominee || []).find(x => x.position == nomineePosition) : (nomination.Nominee || [])[0])
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const text = nomination.name
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
        <div className='w-100 mw-100 ' ref={squareRef}>
            <div className='py-2' style={{
                width, height: width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {nominee?.imageId ?
                    <TheImage imageId={nominee?.imageId} ar={nomination.aspectRatio} position={nominee?.imagePosition} scale={nominee?.imageScale} /> :
                    <TheImage ar='TALL' />
                }
            </div>
            {!name || name == 'nomination' ? (
                onTextEdit ?
                    <EdiText
                        type="text"
                        value={nomination?.name || 'Sample Text'}
                        renderValue={() => (nomination?.name || 'Sample Text').toUpperCase()}
                        viewProps={{
                            className: 'impact text-center',
                            style: { fontSize: width / 8 }
                        }}
                        containerProps={{
                            className: 'd-flex justify-content-center'
                        }}

                        editButtonProps={{ style: { visibility: 'hidden', display: 'none' } }}
                        validation={(t) => t.length > 0}
                        validationMessage='Подлиньше нужно. Спасибо.'
                        editOnViewClick
                        onSave={onTextEdit}
                    /> :
                    <div ref={containerRef} className='w-100' style={{ height: width / 4 }}>
                        <h1 ref={textRef} className='impact text-center' >{(text || 'Sample Text').toUpperCase()}</h1>
                    </div>
            ) : name == 'nominee' ? (

                onTextEdit ?
                    <EdiText
                        type="text"
                        value={nominee?.name || 'Sample Text'}
                        viewProps={{
                            className: 'impact text-center',
                            style: { fontSize: width / 8 }
                        }}
                        containerProps={{
                            className: 'd-flex justify-content-center'
                        }}
                        editButtonProps={{ style: { visibility: 'hidden', display: 'none' } }}
                        validation={(t) => t.length > 0}
                        validationMessage='Подлиньше нужно. Спасибо.'
                        editOnViewClick
                        onSave={onTextEdit}
                    /> :
                    <h1 className='impact text-center' style={{ fontSize: width / 8 }}>{(nominee?.name || 'Sample Text').toUpperCase()}</h1>
            ) : null}
        </div>

    )
}