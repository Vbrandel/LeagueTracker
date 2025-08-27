import data from '../data/data.json'

function Ladder() {

  return (
    <>
      <h1 className='text-blue-500 text-4xl font-bold text-center'>Classement</h1>
      <table className="table-auto w-full text-left border-separate border-spacing-x-4 border-spacing-y-2">
        <thead>
          <tr className="text-center">
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Pseudo</th>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">WR</th>
            <th className="px-4 py-2">W</th>
            <th className="px-4 py-2">L</th>
          </tr>
        </thead>
          <tbody>
              {data.map(player => (
                <tr key={player.id} className="odd:bg-gray-50 text-center">
                  <td className="px-4 py-2">..</td>
                  <td className="px-4 py-2">{player.name}</td>
                  <td className="px-4 py-2">{player.nickname}</td>
                  <td className="px-4 py-2">{player.rank}</td>
                  <td className="px-4 py-2">{
                    (() => {
                      const totalGames = (player.wins ?? 0) + (player.losses ?? 0)
                      if (totalGames === 0) return '0.0%'
                      const wr = ((player.wins ?? 0) / totalGames) * 100
                      return `${wr.toFixed(1)}%`
                    })()
                  }</td>
                  <td className="px-4 py-2">{player.wins}</td>
                  <td className="px-4 py-2">{player.losses}</td>
                </tr>
              ))}
          </tbody>
      </table>
    </>
  )
}

export default Ladder
