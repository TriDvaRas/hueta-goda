import React from 'react'
import { TextBlock, MediaBlock, TextRow, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import ReactPlaceholder from 'react-placeholder/lib/ReactPlaceholder';
import { useElementSize } from 'usehooks-ts';

interface Props {

}
export default function NominationPlaceholder(props: Props) {
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 300
    return (
        <ReactPlaceholder showLoadingAnimation ready={false}
            customPlaceholder={<div className='w-100 mw-100' ref={squareRef}>
                <RectShape color='#3f574c' className='my-2' style={{ height: width, width: width * 2 / 3, marginLeft: width / 6, marginRight: width / 6, borderRadius: 15 }} />
                <RectShape color='#3f574c' style={{ height: width / 3, width: width, borderRadius: width / 12 }} />
            </div>}
        >

        </ReactPlaceholder>

    )
}