import './Button.scss'

interface Props {
    text: string
}

export function Button({ text }: Props) {
    return (
        <button>{text}</button>
    )
}