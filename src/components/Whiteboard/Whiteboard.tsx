import './Whiteboard.scss'

import { useEffect, useRef, useState } from 'react'

import { annotate } from 'rough-notation'

interface Props {
    whiteboardContent: string
    annotateIndices: [number, number][]
}

export function Whiteboard({ whiteboardContent, annotateIndices }: Props) {
    const [displayedText, setDisplayedText] = useState('')
    const displayedTextRef = useRef('')
    const annotateRefs = useRef<(HTMLSpanElement | null)[]>([])

    // Wrap the text within the annotateIndices in a span so that they can be annotated
    const annotateText = () => {
        let result = []
        let lastIndex = 0

        annotateIndices.forEach(([start, end], index) => {
            if (lastIndex < start) {
                result.push(
                    <span key={`text-${index}`} >{displayedText.slice(lastIndex, start)}</span>
                )
            }
            result.push(
                <span key={`annotated-${index}`} ref={(el) => (annotateRefs.current[index] = el)}>
                    {displayedText.slice(start, end)}
                </span>
            )
            lastIndex = end;
        })

        if (lastIndex < displayedText.length) {
            result.push(
                <span key='text-end'>{displayedText.slice(lastIndex)}</span>
            )
        }

        return result;
    }

    useEffect(() => {
        annotateRefs.current.forEach((ref) => {
            if (ref) {
                const annotation = annotate(ref, { type: 'underline', color: 'blue' })

                // Only annotate most recent annotation so as not to repeatedly animate the same element
                if (annotateRefs.current.indexOf(ref) === annotateRefs.current.length - 1) {
                    annotation.show()
                }
            }
        })
    }, [annotateIndices])

    useEffect(() => {
        let i: number

        // Check if whiteboardContent text has been replaced or if text has been appended
        if (whiteboardContent.slice(0, displayedText.length) === displayedText) {
            i = displayedText.length
        } else {
            i = 0
            setDisplayedText('')
            displayedTextRef.current = ''
        }

        // Add letters one by one to displayedText, use a ref to account for state being asynchronous
        const displayTextInterval = setInterval(() => {
            if (i < whiteboardContent.length) {
                const nextChar = whiteboardContent[i]
                i++
                displayedTextRef.current += nextChar
                setDisplayedText(displayedTextRef.current)
            } else {
                clearInterval(displayTextInterval)
            }
        }, 75)

        return () => clearInterval(displayTextInterval)
    }, [whiteboardContent])

    return (
        <div className='whiteboard'>
            <p>{annotateText()}</p>
        </div>
    )
}
