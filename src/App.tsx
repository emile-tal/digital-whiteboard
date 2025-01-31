import './app.scss'

import { Button } from './components/Button/Button'
import { Whiteboard } from "./components/Whiteboard/Whiteboard"
import { requestToServer } from './backend'
import { useState } from 'react'

function App() {
  const [whiteboardContent, setWhiteboardContent] = useState('')
  const [annotateRegex, setAnnotateRegex] = useState<RegExp>(/\*/)
  const [regexIndex, setRegexIndex] = useState<number>(-1)

  const callBackend = (action: string) => {
    try {
      const [mode, content, index = 0] = requestToServer(action)
      if (mode === 'write') {
        setWhiteboardContent(String(content))
      } else if (mode === 'append') {
        const newWhiteboardContent = whiteboardContent + '/n' + content
        setWhiteboardContent(newWhiteboardContent)
      } else if (mode === 'annotate') {
        const regexWithFlag = new RegExp(content, 'gd')
        setAnnotateRegex(regexWithFlag)
        setRegexIndex(index)
      } else {
        console.error(content)
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
      <Whiteboard whiteboardContent={whiteboardContent} annotateRegex={annotateRegex} regexIndex={regexIndex} />
    </div>
  )
}

export default App
