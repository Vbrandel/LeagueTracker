import data from "../data/data.json";

function calculateWR(wins = 0, losses = 0) {
  const totalGames = wins + losses;
  if (totalGames === 0) return "0.0%";
  return `${((wins / totalGames) * 100).toFixed(1)}%`;
}

const columns = [
  { key: "name", label: "Nom" },
  { key: "nickname", label: "Pseudo" },
  { key: "rank", label: "Rank" },
  {
    key: "wr",
    label: "WR",
    render: (player) => calculateWR(player.wins, player.losses),
  },
  { key: "wins", label: "W" },
  { key: "losses", label: "L" },
];

function Ladder() {
  return (
    <div className="flex-col bg-slate-800 rounded-md p-6 border border-slate-600/30">
      <h2 className="text-slate-300 text-3xl font-bold text-center mb-6">
        Classement
      </h2>

      {/* Vue desktop (inchangée, padding pris en compte) */}
      <div className="hidden md:block overflow-x-auto">
  <table className="table-auto w-full max-w-full text-center text-slate-300 border-collapse">
    <thead>
      <tr className="bg-slate-900/60">
        {columns.map((col) => (
          <th key={col.key} className="px-6 py-4">
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((player, index) => (
        <tr key={player.id}>
          {columns.map((col) => (
            <td
              key={col.key}
              className="px-3 py-3 border-b bg-slate-700 border-slate-600/80"
            >
              {col.key === "index"
                ? index + 1
                : col.render
                ? col.render(player)
                : player[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Vue mobile (cartes) */}
      <div className="grid gap-4 md:hidden">
        {data.map((player, index) => (
          <div
            key={player.id}
            className="bg-slate-700 rounded-md p-4 border border-slate-600/60"
          >
            <p className="text-slate-200 font-bold text-lg">
              {index + 1}. {player.name}{" "}
              <span className="text-sm">({player.nickname})</span>
            </p>
            <p className="text-slate-400">Rank: {player.rank}</p>
            <div className="flex justify-between text-slate-300 mt-2">
              <span>WR: {calculateWR(player.wins, player.losses)}</span>
              <span className="text-green-400">W: {player.wins}</span>
              <span className="text-red-400">L: {player.losses}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Ladder;
