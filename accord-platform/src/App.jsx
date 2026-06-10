import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import EngineViewer from './EngineViewer'

function App() {
  return (
    <div>
      <h1>Accord Built</h1>
      <h3>Engine Viewer</h3>
      <EngineViewer />
    </div>
  )
}

export default App