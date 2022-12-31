import { ImageSize, Nomination, Nominee } from '@prisma/client';
import { Image } from 'react-bootstrap';
import EdiText from 'react-editext';
import { RectShape } from 'react-placeholder/lib/placeholders';
import { useElementSize } from 'usehooks-ts';
import { NominationFull } from '../../types/extendedApiTypes';
import TheImage from '../image/TheImage';

interface Props {
    nomination: NominationFull | Nomination,
    onTextEdit?: (text: string) => void
    nominee?: Nominee
}
export default function NominationPreview(props: Props) {
    const { nomination, onTextEdit, nominee } = props
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 30
    return (
        <div className='w-100 mw-100 ' ref={squareRef}>
            <div className='py-2' style={{
                width, height: width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <TheImage  ar={nomination.aspectRatio} imageId={nominee?.imageId} position={nominee?.imagePosition} scale={nominee?.imageScale} size={ImageSize.MEDIUM}/>
            </div>
            {
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
                    <h1 className='impact text-center' style={{ fontSize: width / 8 }}>{(nomination?.name || 'Sample Text').toUpperCase()}</h1>
            }
        </div>

    )
}