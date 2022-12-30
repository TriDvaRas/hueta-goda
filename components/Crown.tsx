import Image from 'next/image';
import rscrown from '../assets/svg/rscrown.svg'
import crown from '../assets/svg/crown.svg'
interface Props {
    position: number
    size: number
    cornered?: boolean
}
export default function Crown({ position, size, cornered }: Props) {
    switch (position) {
        case 0:
            return <Image width={size} style={{ overflow: 'visible', transform: 'scale(0.65)' }} src={rscrown} alt={'P0'}></Image>
        case 1:
            return <Image width={size} style={{ overflow: 'visible', transform: cornered ? 'rotate(45deg)' : '', filter: 'invert(84%) sepia(91%) saturate(3815%) hue-rotate(329deg) brightness(108%) contrast(90%)' }} src={crown} alt={'P1'}></Image>
        case 2:
            return <Image width={size} style={{ overflow: 'visible', transform: cornered ? 'rotate(45deg)' : '', filter: 'invert(83%) sepia(10%) saturate(6%) hue-rotate(314deg) brightness(95%) contrast(88%)' }} src={crown} alt={'P2'}></Image>
        case 3:
            return <Image width={size} style={{ overflow: 'visible', transform: cornered ? 'rotate(45deg)' : '', filter: 'invert(77%) sepia(22%) saturate(6112%) hue-rotate(336deg) brightness(85%) contrast(88%)' }} src={crown} alt={'P3'}></Image>

        default:
            return null
    }
}