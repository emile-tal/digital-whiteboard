import './Button.scss'

interface Props {
    action: string
    callBackend: (action: string) => void
}

export function Button({ action, callBackend }: Props) {
    return (
        <button onClick={() => callBackend(action)}>{action}</button>
    )
}