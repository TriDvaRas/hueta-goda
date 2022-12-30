import { ImageSize, Nomination, Nominee, AspectRatio } from '@prisma/client';
import Link from 'next/link';
import React, { useRef, useState } from 'react'
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { useDrop, useDrag } from 'react-dnd';
import Crown from '../Crown';
import TheImage from '../image/TheImage';

interface Props {
    index: number;
    nominee: Nominee
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    ar?: AspectRatio
    onEditClick?: (nominee: Nominee) => void
    onDeleteClick?: (nominee: Nominee) => void
    valid?: boolean
    selected?: boolean
}
export default function NomineeDraggableRow(props: Props) {
    const { index, moveRow, nominee, ar, onEditClick, valid, selected, onDeleteClick } = props
    const ref = useRef<any>(null);
    const [showDeletePopover, setShowDeletePopover] = useState(false)

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

    const [{ isDragging }, drag] = useDrag<any, any, any>({
        type: 'row',
        item: { type: 'row', index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <tr ref={ref} className='d-flex w-100 align-items-center' style={{ fontSize: '125%', cursor: isDragging ? 'grabbing' : 'grab' }}>
            <td className='d-flex w-100 align-items-center py-1 border-bottom border-secondary ' style={selected ? { backgroundColor: '#24372E' } : {}} >
                <div style={{ width: 45, height: 45 }}><Crown position={nominee.position} size={45} /></div>
                <div className='me-2' style={{ height: 55 }}><TheImage position={nominee?.imagePosition} scale={nominee?.imageScale} size={ImageSize.PREVIEW} ar={ar || AspectRatio.SQUARE} imageId={nominee.imageId} /></div>
                <div className='me-auto'>{nominee.name}</div>
                {valid == false && <i className="text-warning bi bi-exclamation-triangle-fill"></i>}
                {onEditClick && <div className='ms-2 me-2 h-100 highlight-icon-on-hover' style={{ fontSize: '110%', cursor: 'pointer' }} onClick={() => onEditClick(nominee)}><i className="bi bi-pencil"></i></div>}

                {onDeleteClick && <OverlayTrigger show={showDeletePopover} rootClose trigger="click" placement="bottom" overlay={<Popover className='bg-dark' id="popover-basic">
                    <Popover.Body>
                        <div className='mx-2 mb-2 text-light'>Удалить {nominee.name || '``'}?</div>
                        <div className='w-100 d-flex'>
                            <Button className='mx-auto' variant='danger' onClick={() => { onDeleteClick(nominee); setShowDeletePopover(false) }}>
                                Удалить
                            </Button>
                        </div>

                    </Popover.Body>
                </Popover>}>
                    <div className=' me-3 h-100 highlight-icon-on-hover' style={{ fontSize: '110%', cursor: 'pointer' }} onClick={() => setShowDeletePopover(true)}><i className="bi bi-trash"></i></div>
                </OverlayTrigger>}
                <i className=" bi bi-grip-vertical me-n2" style={{ fontSize: '140%', opacity: .7 }}></i>
            </td>
        </tr>
    );
}