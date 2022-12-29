import { Nominee, AspectRatio } from '@prisma/client';
import { useSession } from 'next-auth/react'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { globalConfig } from '../../util/globalConfig'
import NomineeDraggableRow from './NomineeDraggableRow'

interface Props {
    nominees: Nominee[]
    onChange: (nominees: Nominee[]) => void
    ar?: AspectRatio
    onEditClick?: (nominee: Nominee) => void
}
export default function NomineesTopEditor(props: Props) {
    const { nominees, onChange, ar, onEditClick } = props
    const { data: session, status: sessionStatus } = useSession()
    const moveRow = (dragIndex: number, hoverIndex: number) => {
        const newRows = [...nominees];
        const [draggedRow] = newRows.splice(dragIndex, 1);
        newRows.splice(hoverIndex, 0, draggedRow);
        const minPos = Math.min(...newRows.map(x => x.position))
        onChange(newRows.map((x, i) => ({ ...x, position: i + minPos })));
    };
    const addRow = () => {
        if (session)
            onChange([...nominees, {
                ...globalConfig.dummyNominee,
                position: Math.max(...nominees.map(x => x.position)) + 1,
                authorUserId: session.user.id,
                imageId: `${Math.random()}`
            }])
    }
    return (
        <table>
            <DndProvider backend={HTML5Backend}>
                <tbody>
                    {nominees.map((nominee, index) => (
                        <NomineeDraggableRow ar={ar} key={index} index={index} nominee={nominee} moveRow={moveRow} onEditClick={onEditClick} />
                    ))}
                    <tr className='text-center fs-3 bg-secondary-hover' onClick={addRow}>+</tr>
                </tbody>
            </DndProvider>
        </table>
    )
}