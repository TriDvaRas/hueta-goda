import React from 'react'
import { Spinner } from 'react-bootstrap'

interface Props {
    variant?: string;
    count?: number;
    size?: 'sm';
    className?: string;
    compact?: boolean
}
export default function LoadingDots(props: Props) {
    const spinners = []
    for (let i = 0; i < (props.count || 3); i++)
        spinners.push(<Spinner key={i} className={`mx-2 ${props.compact ? `my-0` : `my-3`} `} animation="grow" size={props.size} variant={props.variant || "primary"} />)
    return (
        <div className={`${props.compact ? `my-0` : `my-3`} text-center  ${props.className || ``} `}>
            {spinners}
        </div>
    )
}