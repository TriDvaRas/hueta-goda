import seedrandom from "seedrandom";
import convert from 'color-convert'

export function randomSeededColor(seed: string, s?: number, l?: number) {
    const result= `#${convert.hsl.hex([(seedrandom(seed).quick() * 720 + 0) % 360, s || 30, l || 45])}`
    return result
}