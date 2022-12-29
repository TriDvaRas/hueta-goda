import { ImageSize, Nomination, Nominee } from '@prisma/client';
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
            {textSource !== 'none' && <h1 className='impact text-center' style={{ fontSize: width / 8 }}>{(text || 'Sample Text').toUpperCase()}</h1>}
        </div>

    )
}