import './Whiteboard.scss'

interface Props {
    whiteboardContent: string[]
}

export function Whiteboard({ whiteboardContent }: Props) {

    return (
        <div className='whiteboard'>
            <p>{whiteboardContent.join(' ')}</p>
        </div>
    )
}