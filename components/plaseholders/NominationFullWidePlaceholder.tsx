import React from 'react'
import { TextBlock, MediaBlock, TextRow, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import ReactPlaceholder from 'react-placeholder/lib/ReactPlaceholder';
import { useElementSize } from 'usehooks-ts';

interface Props {
    noText?: boolean
}
export default function NominationFullWidePlaceholder(props: Props) {
    // let [squareRef, { width }] = useElementSize()

    return (
        <ReactPlaceholder showLoadingAnimation ready={false}
            customPlaceholder={<div className='w-100 mw-100' >
                <RectShape color='#3f574c' className='my-2' style={{ height: 250, width: '100%', borderRadius: 15 }} />
            </div>}
        >

        </ReactPlaceholder>

    )
}