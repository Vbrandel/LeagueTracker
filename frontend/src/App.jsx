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
      <div className="container mx-auto px-4 py-4 2xl:px-10 2xl:py-10">
        {/* Header */}
          <h1 className="text-slate-200 text-4xl font-bold text-center">Le mur de la honte</h1>

        <div className="flex flex-col 2xl:flex-row gap-10 2xl:p-6">
            <Ladder refreshFlag={refreshFlag} />

          {/* Colonne droite */}
            <Cards refreshFlag={refreshFlag} />
        </div>
      </div>
    </div>
  );
}

export default App;
