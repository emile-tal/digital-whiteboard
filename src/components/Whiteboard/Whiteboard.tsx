import './Whiteboard.scss'

import { useEffect, useRef } from 'react'

import { annotate } from 'rough-notation'

interface Props {
    whiteboardContent: string
    annotateIndices: [number, number][]
}

export function Whiteboard({ whiteboardContent, annotateIndices }: Props) {
    const annotateRefs = useRef<(HTMLSpanElement | null)[]>([])

    const annotateText = () => {
        let result = []
        let lastIndex = 0

        annotateIndices.forEach(([start, end], index) => {
            if (lastIndex < start) {
                result.push(
                    <span key={`text-${index}`} >{whiteboardContent.slice(lastIndex, start)}</span>
                )
            }

            result.push(
                <span key={`annotated-${index}`} ref={(el) => (annotateRefs.current[index] = el)}>
                    {whiteboardContent.slice(start, end)}
                </span>
            )
            lastIndex = end;
        })

        if (lastIndex < whiteboardContent.length) {
            result.push(
                <span key='text-end'>{whiteboardContent.slice(lastIndex)}</span>
            )
        }

        return result;
    }

    useEffect(() => {
        annotateRefs.current.forEach((ref) => {
            if (ref) {
                const annotation = annotate(ref, { type: 'underline', color: 'yellow' });
                if (annotateRefs.current.indexOf(ref) === annotateRefs.current.length - 1) {
                    annotation.show()
                }
            }
        })
    }, [annotateIndices])

    return (
        <div className='whiteboard'>
            <p>{annotateText()}</p>
        </div>
    )
}
