import { useState } from 'react'
import './App.css'
import Ladder from './components/ladder'
import Cards from './components/Cards'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-red-500'>League Tracker</h1>
      <div className='h-full flex gap-24'>
      <Ladder />
      <Cards className='flex-grow'/>
      </div>
    </div>
  )
}

export default App
