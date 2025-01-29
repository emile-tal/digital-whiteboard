export function requestToServer(mode: string) {
    if (mode === 'write') {
        return ['write', "This is a hardcoded mock of an AI backend writing something on the whiteboard."]
    } else if (mode === 'append') {
        return ['append', 'Appending text to the whiteboard.']
    } else if (mode === 'annotate') {
        return ['annotate', /whiteboard/]
    }
}