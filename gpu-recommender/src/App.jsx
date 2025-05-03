import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GPUForm from './page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GPUForm/>
    </>
  )
}

export default App
