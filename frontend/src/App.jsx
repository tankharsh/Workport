import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='bg-red-700 text-4xl text-center'>Workport</div>
     <div className="bg-green-700 text-4xl text-center">Jay Shree Karishna</div>
    </>
  )
}

export default App
