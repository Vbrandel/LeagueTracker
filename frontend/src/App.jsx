import { useState } from 'react'
import './App.css'
import Ladder from './components/ladder'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-red-500'>League Tracker</h1>
      <Ladder />
    </>
  )
}

export default App
