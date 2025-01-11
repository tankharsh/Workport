import { useState } from 'react'
import './App.css'
import Dashboard from './pages/sp_pages/Dashboard'
import Layout from './pages/user_pages/Layout'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Layout />
      {/* <Dashboard /> */}
    </>
  )
}

export default App
