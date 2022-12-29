import { ImageSize, Nomination, Nominee, AspectRatio } from '@prisma/client';
import React, { useRef } from 'react'
import { useDrop, useDrag } from 'react-dnd';
import Crown from '../Crown';
import TheImage from '../image/TheImage';

interface Props {
    index: number;
    nominee: Nominee
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    ar?: AspectRatio
    onEditClick?: (nominee: Nominee) => void
    valid?: boolean
    selected?: boolean
}
export default function NomineeDraggableRow(props: Props) {
    const { index, moveRow, nominee, ar, onEditClick, valid, selected } = props
    const ref = useRef<any>(null);

    const [, drop] = useDrop<any, any>({
        accept: 'row',
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset() as any;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveRow(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ }, drag] = useDrag<any, any, any>({
        type: 'row',
        item: { type: 'row', index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <tr ref={ref} className='d-flex w-100 align-items-center   ' style={{ fontSize: '125%' }}>
            <td className='d-flex w-100 align-items-center py-1 border-bottom border-secondary ' >
                <div style={{ width: 45, height: 45 }}><Crown position={nominee.position} size={45} /></div>
                <div className='me-2' style={{ height: 55 }}><TheImage position={nominee?.imagePosition} scale={nominee?.imageScale} size={ImageSize.PREVIEW} ar={ar || AspectRatio.SQUARE} imageId={nominee.imageId} /></div>
                <div className='me-2'>{nominee.name}</div>
                {valid == false&&<i className="text-warning bi bi-exclamation-triangle-fill"></i>}
                {onEditClick && <div className='ms-auto me-3' onClick={() => onEditClick(nominee)}><i className="bi bi-pencil"></i></div>}
            </td>
        </tr>
    );
}