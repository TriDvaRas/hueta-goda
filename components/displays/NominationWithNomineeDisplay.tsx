import { ImageSize, Nomination, Nominee } from '@prisma/client';
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
}
export default function NominationWithNomineeDisplay(props: Props) {
    const { nomination, textSource, nominee, imageSize, className } = props
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 30
    const text = textSource == 'nomination' ? nomination.name : nominee?.name
    return (
        <div className={`${className || ''} w-100 mw-100 `} ref={squareRef}>
            <div className='py-2' style={{
                width, height: width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {nominee?.imageId ?
                    <TheImage size={imageSize || 'ORIGINAL'} imageId={nominee?.imageId} ar={nomination.aspectRatio} /> :
                    <TheImage ar={nomination.aspectRatio} />
                }
            </div>
            {textSource !== 'none' && <h1 className='impact text-center' style={{ fontSize: width / 8 }}>{(text || 'Sample Text').toUpperCase()}</h1>}
        </div>

    )
}