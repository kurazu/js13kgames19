export type Entry = [string, string];
export type Line = Entry[];
export type Page = Line[];

export type TextFormatter = (text: string) => Entry;

export function normal(text: string): Entry {
    return [text, 'white'];
}

export function emphasis(text: string): Entry {
    return [text, 'red'];
}

export function standout(text: string): Entry {
    return [text, 'orange'];
}

export function inactive(text: string): Entry {
    return [text, 'gray'];
}

export function transparent(text: string): Entry {
    return [text, 'transparent'];
}


export function formatTime(totalSeconds: number, formatter: TextFormatter): Line {
    const seconds = ~~(totalSeconds % 60);
    const minutes = ~~(totalSeconds / 60);
    return [
        formatter(String(minutes).padStart(2, '0')),
        normal('m:'),
        formatter(String(seconds).padStart(2, '0')),
        normal('s')
    ];
}
