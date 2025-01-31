import './Whiteboard.scss'

import { cloneElement, useEffect, useRef, useState } from 'react'

import { annotate } from 'rough-notation'

interface Props {
    whiteboardContent: string
    annotateRegex: RegExp
    regexIndex: number
}

interface RegExpIndices extends RegExpExecArray {
    indices: [number, number][]
}

export function Whiteboard({ whiteboardContent, annotateRegex, regexIndex }: Props) {
    const [displayedText, setDisplayedText] = useState('')
    const displayedTextRef = useRef('')
    const annotateRefs = useRef<(HTMLSpanElement | null)[]>([])

    const annotateText = (jsxArray: JSX.Element[]): JSX.Element[] => {
        let regexMatchCount = 0

        // Go through each JSX element to identify matches to regex
        return jsxArray.map((el, index) => {
            const text = el.props.children
            const regexArray = annotateRegex.exec(text) as RegExpIndices
            if (regexArray) {
                if (regexMatchCount === regexIndex) {
                    const cloned = cloneElement(
                        el,
                        {},
                        text.slice(0, regexArray['indices'][0][0]),
                        <span ref={(el) => (annotateRefs.current[index] = el)}>{text.slice(regexArray['indices'][0][0], regexArray['indices'][0][1])}</span>,
                        text.slice(regexArray['indices'][0][1])
                    )
                    return cloned
                }
                regexMatchCount++
                return el
            }
            return el
        })
    }

    const markdownToJsx = (markdown: string) => {
        return markdown.split('/n').map((line, index) => {
            if (line.slice(0, 2) === "# ") return <h1 key={index}>{line.slice(2)}</h1>
            if (line.slice(0, 3) === "## ") return <h2 key={index}>{line.slice(3)}</h2>
            if (line.slice(0, 4) === "### ") return <h3 key={index}>{line.slice(4)}</h3>
            if (line.slice(0, 2) === "- ") return <li key={index}>{line.slice(2)}</li>
            if (line.slice(0, 2) === "**" && line.slice(-2) === "**") return <strong key={index}>{line.slice(2, -2)}</strong>
            if (line.slice(0, 1) === "*" && line.slice(-1) === "*") return <em key={index}>{line.slice(1, -1)}</em>

            // Find any bolded or italic markdown within the paragraph
            const lineSplit = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            return (
                <p key={index}>
                    {lineSplit.map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                                <strong key={i}>{part.slice(2, -2)}</strong>
                            )
                        } else if (part.startsWith("*") && part.endsWith("*")) {
                            return (
                                <em key={i}>{part.slice(1, -1)}</em>
                            )
                        } else {
                            return part
                        }
                    })}
                </p>
            )
        })
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
    }, [annotateRegex])

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
        }, 50)

        return () => clearInterval(displayTextInterval)
    }, [whiteboardContent])

    return (
        <div className='whiteboard'>
            <div>
                {annotateText(markdownToJsx(displayedText))}
            </div>
        </div>
    )
}
