import { useEffect, useState } from "react";
import { getLast10GlobalMatches, playersList } from "../services/riotApi";

function CardItem({ game }) {
  const resultClasses =
    game.result === 'W'
      ? 'bg-gradient-to-b from-blue-600/20 to-blue-600/10'
      : 'bg-gradient-to-b from-red-600/20 to-red-600/10';

  const player = playersList.find(p => p.name === game.prenom);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Image joueur desktop */}
      <div className="items-center justify-center hidden md:flex">
        <img
          src={player?.pdp || ""}
          alt={game.prenom}
          className="rounded-sm w-26 border-2 border-slate-600/80"
        />
      </div>

      <div
        className={`w-full flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-md border bg-black/80 border-slate-600/30 ${resultClasses}`}
      >
        {/* Champion + infos */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img
            src={game.champ}
            alt={`${game.prenom} champion`}
            className="rounded-sm w-20 md:w-28 border-2 border-slate-600/80"
          />
          <p className="text-slate-200 text-sm md:text-base">
            <span className="font-semibold">{game.prenom}</span> ({game.nickname}) <br />
            {game.date} – {game.duree}
          </p>
        </div>

        {/* K/D/A */}
        <div className="text-center md:text-left text-slate-200 text-2xl font-extralight mt-2 md:mt-0">
          <span className="font-semibold text-slate-200">{game.kill}</span> /{" "}
          <span className="text-red-500 font-semibold">{game.death}</span> /{" "}
          <span className="font-semibold text-yellow-200">{game.assist}</span>
        </div>

        {/* Sorts + Items : passer sous la carte sur mobile */}
        <div className="mt-2 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-slate-700 p-2 rounded-md border border-slate-600/80">
            <div className="grid grid-cols-2 grid-rows-1 gap-1">
              <img src={game.sumn1} alt="Summoner 1" className="h-10 w-10 border-2 border-slate-600/80" />
              <img src={game.sumn2} alt="Summoner 2" className="h-10 w-10 border-2 border-slate-600/80" />
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-1 place-items-center">
              {[game.slot1, game.slot2, game.slot3, game.slot4, game.slot5, game.slot6].map(
                (slot, index) => (
                  <img
                    key={index}
                    src={slot}
                    alt={`Item ${index + 1}`}
                    className="h-10 w-10 rounded-sm border-2 border-slate-600/80"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cards() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getLast10GlobalMatches()
      .then(setMatches)
      .catch(console.error);
  }, []);

  return (
    <div className="w-full space-y-4">
      {matches.map((game) => (
        <CardItem
          key={`${game.id}-${game.prenom}`}
          game={game}
        />
      ))}
    </div>
  );
}

export default Cards;
