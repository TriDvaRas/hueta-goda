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
    nomineesValidation?: boolean[]
    activeNomineeId?: string
}
export default function NomineesTopEditor(props: Props) {
    const { nominees, onChange, ar, onEditClick, nomineesValidation, activeNomineeId: activeNomineeId } = props
    const { data: session, status: sessionStatus } = useSession()
    const moveRow = (dragIndex: number, hoverIndex: number) => {
        const newRows = [...nominees];
        const [draggedRow] = newRows.splice(dragIndex, 1);
        newRows.splice(hoverIndex, 0, draggedRow);
        const minPos = Math.min(...newRows.map(x => x.position))
        onChange(newRows.map((x, i) => ({ ...x, position: i + minPos })));
    };
    const deleteRow = (index: number) => {
        const newRows = [...nominees];
        newRows.splice(index, 1)
        const minPos = Math.min(...nominees.map(x => x.position))
        onChange(newRows.map((x, i) => ({ ...x, position: i + minPos })));
    };
    return (
        <table className='table table-dark table-hover'>
            <tbody className='table-hover'>
                <DndProvider backend={HTML5Backend}>
                    {nominees.map((nominee, index) => (
                        <NomineeDraggableRow
                            onEditClick={activeNomineeId == nominee.id ? undefined : onEditClick}
                            onDeleteClick={nominees.length > 1 ? () => deleteRow(index) : undefined}
                            selected={activeNomineeId == nominee.id}
                            valid={!nomineesValidation || nomineesValidation[index]}
                            ar={ar} key={index} index={index} nominee={nominee}
                            moveRow={moveRow}
                        />
                    ))}
                </DndProvider>
            </tbody>
        </table>
    )
}