import './app.scss'

import { Button } from './components/Button/Button'
import { Whiteboard } from "./components/Whiteboard/Whiteboard"
import { requestToServer } from './backend'
import { useState } from 'react'

function App() {
  const [whiteboardContent, setWhiteboardContent] = useState('')
  const [annotateIndices, setAnnotateIndices] = useState<[number, number][]>([])
  const [annotateRegex, setAnnotateRegex] = useState<RegExp>(/\*/)
  const [regexIndex, setRegexIndex] = useState<number>(-1)

  // const getRegexMatch = (regex: RegExp, index: number) => {
  //   let regexArray
  //   let count = 0
  //   while ((regexArray = regex.exec(whiteboardContent)) !== null) {
  //     if (count === index) {
  //       return regexArray
  //     }
  //     count++
  //   }
  //   return null
  // }

  const callBackend = (action: string) => {
    try {
      const [mode, content, index = 0] = requestToServer(action)
      if (mode === 'write') {
        setWhiteboardContent(content)
      } else if (mode === 'append') {
        const newWhiteboardContent = whiteboardContent + ' ' + content
        setWhiteboardContent(newWhiteboardContent)
      } else if (mode === 'annotate') {
        const regexWithFlag = new RegExp(content, 'gd')
        setAnnotateRegex(regexWithFlag)
        setRegexIndex(index)
        // const match = getRegexMatch(regexWithFlag, index)
        // if (match) {
        //   const newAnnotateIndices = [...annotateIndices, match['indices'][0]]
        //   setAnnotateIndices(newAnnotateIndices)
        // } else {
        //   console.error("No expression matches the annotation request")
        // }
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="app">
      <div className='app__button-container'>
        <Button action='write' callBackend={callBackend} />
        <Button action='append' callBackend={callBackend} />
        <Button action='annotate' callBackend={callBackend} />
      </div>
      <Whiteboard whiteboardContent={whiteboardContent} annotateIndices={annotateIndices} annotateRegex={annotateRegex} regexIndex={regexIndex} />
    </div>
  )
}

export default App
