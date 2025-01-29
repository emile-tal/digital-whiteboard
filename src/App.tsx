import './app.scss'

import { Button } from './components/Button/Button'
import { Whiteboard } from "./components/Whiteboard/Whiteboard"

function App() {
  return (
    <div className="app">
      <div className='app__button-container'>
        <Button text='write' />
        <Button text='append' />
        <Button text='annotate' />
      </div>
      <Whiteboard />
    </div>
  )
}

export default App
