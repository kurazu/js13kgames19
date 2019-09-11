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
