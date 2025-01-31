export function requestToServer(mode: string): [string, string | RegExp, number?] {
    if (mode === 'write') {
        return ['write', "# This is a hardcoded mock of an AI backend writing something on the whiteboard."]
    } else if (mode === 'append') {
        return ['append', 'Appending text to the whiteboard.']
    } else if (mode === 'annotate') {
        return ['annotate', /whiteboard/, 0]
    } else {
        return ['error', 'Request should only have one of three modes: write, append, or annotate']
    }
}