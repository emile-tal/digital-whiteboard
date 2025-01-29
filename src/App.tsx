import './app.scss'

import { Button } from './components/Button/Button'
import { Whiteboard } from "./components/Whiteboard/Whiteboard"
import { requestToServer } from './backend'
import { useState } from 'react'

function App() {
  const [whiteboardContent, setWhiteboardContent] = useState([])

  const callBackend = (action: string) => {
    try {
      const response = requestToServer(action)
      if (response[0] === 'write') {
        setWhiteboardContent(response[1].split(' '))
      }
      if (response[0] === 'append') {
        const appendedContent = response[1].split(' ')
        const newWhiteboardContent = whiteboardContent.concat(appendedContent)
        setWhiteboardContent(newWhiteboardContent)
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
      <Whiteboard whiteboardContent={whiteboardContent} />
    </div>
  )
}

export default App
