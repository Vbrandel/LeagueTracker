import "./App.css";
import Ladder from "./components/Ladder";
import Cards from "./components/Cards";

function App() {
  return (
    <div className="bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 py-4 2xl:px-10 2xl:py-10">
        <h1 className="text-slate-200 text-4xl font-bold text-center">
          Le mur de la honte
        </h1>

        <div className="flex flex-col 2xl:flex-row gap-10 2xl:p-6">
          <Ladder />
          <Cards />
        </div>
      </div>
    </div>
  );
}

export default App;
