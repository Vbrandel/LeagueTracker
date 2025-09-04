import { useState } from "react";
import "./App.css";
import Ladder from "./components/Ladder";
import Cards from "./components/Cards";

function App() {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  const handleRefresh = () => {
    setRefreshFlag((f) => f + 1);
    setLastUpdate(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-slate-200 text-4xl font-bold">League Tracker</h1>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-slate-400 text-sm">
                Dernière MAJ : {lastUpdate}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="">
          {/* Colonne gauche */}
          <div className="">
            <Ladder refreshFlag={refreshFlag} />
          </div>

          {/* Colonne droite */}
          <div className="">
            <Cards refreshFlag={refreshFlag} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
