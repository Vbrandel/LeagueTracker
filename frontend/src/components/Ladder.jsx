import { useEffect, useState } from "react";
import { getInfoRank, playersList } from "../services/riotApi";

function calculateWR(wins = 0, losses = 0) {
  const totalGames = wins + losses;
  if (totalGames === 0) return "0.0%";
  return `${((wins / totalGames) * 100).toFixed(1)}%`;
}

async function fetchPlayer(puuid, name, nickname) {
  const data = await getInfoRank(puuid);
  const soloQ = data.find((queue) => queue.queueType === "RANKED_SOLO_5x5");

  if (!soloQ) {
    return { id: puuid, name, nickname, rank: "Unranked", wins: 0, losses: 0 };
  }

  return {
    id: soloQ.leagueId,
    name,
    nickname,
    rank: `${soloQ.tier} ${soloQ.rank} (${soloQ.leaguePoints} LP)`,
    wins: soloQ.wins,
    losses: soloQ.losses,
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

  return (
    <div className="flex-col bg-slate-800 rounded-md p-6 border border-slate-600/30">
      <h2 className="text-slate-300 text-2xl font-bold mb-4">Classement</h2>
      {loading ? (
        <p className="text-center text-slate-400">Chargement...</p>
      ) : (
        <table className="table-auto w-full text-center text-slate-300 border-collapse">
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
            {players.map((p, i) => (
              <tr key={p.id}>
                <td className="px-3 py-3 border-b bg-slate-700">{p.name}</td>
                <td className="px-3 py-3 border-b bg-slate-700">
                  {p.nickname}
                </td>
                <td className="px-3 py-3 border-b bg-slate-700">{p.rank}</td>
                <td className="px-3 py-3 border-b bg-slate-700">
                  {calculateWR(p.wins, p.losses)}
                </td>
                <td className="px-3 py-3 border-b bg-slate-700">{p.wins}</td>
                <td className="px-3 py-3 border-b bg-slate-700">{p.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Ladder;
