import { useEffect, useState } from "react";
import { getInfoRank, playersList } from "../services/riotApi";
import { tierOrder, divisionOrder } from "../services/rankUtils.js";

// Calcul du winrate
function calculateWR(wins = 0, losses = 0) {
  const totalGames = wins + losses;
  if (totalGames === 0) return "0.0%";
  return `${((wins / totalGames) * 100).toFixed(1)}%`;
}

// Récupération des infos d'un joueur
async function fetchPlayer(puuid, name, nickname) {
  const data = await getInfoRank(puuid);
  const soloQ = data.find((queue) => queue.queueType === "RANKED_SOLO_5x5");

  if (!soloQ) {
    return { 
      id: puuid, 
      name, 
      nickname, 
      rank: "Unranked", 
      wins: 0, 
      losses: 0, 
      rankValue: 0 
    };
  }

  const base = tierOrder[soloQ.tier] * 1000;
  const division = divisionOrder[soloQ.rank] * 100;
  const lp = soloQ.leaguePoints;

  return {
    id: soloQ.leagueId,
    name,
    nickname,
    rank: `${soloQ.tier} ${soloQ.rank} (${lp} LP)`,
    wins: soloQ.wins,
    losses: soloQ.losses,
    rankValue: base + division + lp,
  };
}

function Ladder({ refreshFlag }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAllPlayers() {
    try {
      setLoading(true);
      const allPlayers = await Promise.all(
        playersList.map((p) => fetchPlayer(p.puuid, p.name, p.nickname))
      );
      allPlayers.sort((a, b) => b.rankValue - a.rankValue);
      setPlayers(allPlayers);
    } catch (err) {
      console.error("Erreur récupération ladder:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllPlayers();
  }, [refreshFlag]);

  if (loading) {
    return (
      <div className="flex-col bg-slate-800 rounded-md p-6 border border-slate-600/30">
        <h2 className="text-slate-300 text-2xl font-bold mb-4 text-center">Classement</h2>
        <p className="text-center text-slate-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <h2 className="text-slate-300 text-3xl font-bold mb-4 text-center">Classement</h2>

      {/* Table pour desktop */}
      <div className="hidden md:block overflow-hidden rounded-md border border-slate-600/30">
        <table className="table-auto w-full text-center text-slate-300">
          <thead>
            <tr className="bg-slate-900/60">
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Pseudo</th>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">WR</th>
              <th className="px-6 py-4">W</th>
              <th className="px-6 py-4">L</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{p.name}</td>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{p.nickname}</td>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{p.rank}</td>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{calculateWR(p.wins, p.losses)}</td>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{p.wins}</td>
                <td className="px-3 py-3 border-b border-slate-600/60 bg-slate-700">{p.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cartes pour mobile */}
      <div className="md:hidden space-y-4">
        {players.map((p) => (
          <div key={p.id} className="bg-slate-700 p-4 rounded-md border border-slate-600/50">
            <p className="font-bold text-slate-200">{p.name} ({p.nickname})</p>
            <p className="text-slate-300">{p.rank}</p>
            <div className="flex justify-between mt-2 text-slate-200">
              <span>WR: {calculateWR(p.wins, p.losses)}</span>
              <span>W: {p.wins}</span>
              <span>L: {p.losses}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ladder;
