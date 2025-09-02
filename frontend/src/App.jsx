import { useState } from 'react'
import './App.css'
import Ladder from './components/Ladder'
import Cards from './components/Cards'

function App() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-slate-200 text-4xl font-bold text-center m-6">
          League Tracker
        </h1>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {/* Colonne gauche */}
          <div className="w-full md:w-1/3">
            <Ladder />
          </div>

          {/* Colonne droite */}
          <div className="w-full md:w-2/3">
            <Cards />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
