export function colorToHex(color: string) {
    switch (color.toUpperCase()) {
        case 'RED':
            return '#FF0000';
        case 'GREEN':
            return '#00FF00';
        case 'BLUE':
            return '#0000FF';
        case 'YELLOW':
            return '#FFFF00';
        case 'PURPLE':
            return '#800080';
        default:
            return '#000000';
    }
}