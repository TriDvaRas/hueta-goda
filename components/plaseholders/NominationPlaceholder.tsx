import React from 'react'
import { TextBlock, MediaBlock, TextRow, RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import ReactPlaceholder from 'react-placeholder/lib/ReactPlaceholder';
import { useElementSize } from 'usehooks-ts';

interface Props {
    noText?: boolean
}
export default function NominationPlaceholder(props: Props) {
    let [squareRef, { width }] = useElementSize()
    if (!width) width = 30
    return (
        <ReactPlaceholder showLoadingAnimation ready={false}
            customPlaceholder={<div className='w-100 mw-100' ref={squareRef}>
                <RectShape color='#3f574c' className='my-2' style={{ height: width, width: width * 2 / 3, marginLeft: width / 6, marginRight: width / 6, borderRadius: 15 }} />
                {props.noText || <RectShape color='#3f574c' style={{ height: width / 6, width: width, borderRadius: width / 18 }} />}
            </div>}
        >

        </ReactPlaceholder>

    )
}