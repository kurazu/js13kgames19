export type TextFormatter = (text: string) => [string, string];

export function normal(text: string): [string, string] {
    return [text, 'white'];
}

export function emphasis(text: string): [string, string] {
    return [text, 'red'];
}

export function standout(text: string): [string, string] {
    return [text, 'orange'];
}

export function inactive(text: string): [string, string] {
    return [text, 'gray'];
}

export function transparent(text: string): [string, string] {
    return [text, 'transparent'];
}


export function formatTime(totalSeconds: number, formatter: TextFormatter): [string, string][] {
    const seconds = ~~(totalSeconds % 60);
    const minutes = ~~(totalSeconds / 60);
    return [
        formatter(String(minutes).padStart(2, '0')),
        normal('m:'),
        formatter(String(seconds).padStart(2, '0')),
        normal('s')
    ];
}
