import matchtest from '../data/matchtest.json'
import virgil from '../assets/virgil.png'

/**
 * Sous-composant pour une carte
 */
function CardItem({ game }) {
  const resultClasses =
    game.result === 'W'
      ? 'bg-gradient-to-b from-blue-600/20 to-blue-600/10'
      : game.result === 'L'
      ? 'bg-gradient-to-b from-red-600/20 to-red-600/10'
      : 'bg-gray-500'

  return (

    <div className="flex row gap-4">
      <div className="items-center justify-center hidden md:flex">
        <img
          src={virgil}
          alt="Virgil"
          className="rounded-sm w-26 border-2 border-slate-600/80"
        />
      </div>

    <div
      key={game.id}
      className={`w-full flex justify-between items-center p-4 rounded-md border bg-black/80 border-slate-600/30 ${resultClasses}`}
    >
      {/* Partie gauche */}
      <div className="flex items-center gap-4">
        <img
          src={game.champ}
          alt={`${game.prenom} champion`}
          className="rounded-sm w-28 border-2 border-slate-600/80"
        />
        <p className="text-xl text-white">
        il y a {game.date} <br></br> {game.duree}
        </p>
      </div>

      {/* Partie milieu */}
      <div className="text-center">
        <p className="font-extralight text-white text-2xl">
          <span className="font-semibold">{game.kill}</span> /{' '}
          <span className="text-red-500 font-semibold">{game.death}</span> /{' '}
          <span className="font-semibold text-yellow-200">{game.assist}</span>
        </p>
      </div>

      {/* Partie droite */}
      <div className="flex items-center gap-4 bg-slate-700 p-2 rounded-md border border-slate-600/80">
        {/* Summoners */}
        <div className="grid grid-cols-1 grid-rows-2 gap-1">
          <img src={game.sumn1} alt="Summoner 1" className="h-8 w-8 border-2 border-slate-600/80" />
          <img src={game.sumn2} alt="Summoner 2" className="h-8 w-8 border-2 border-slate-600/80" />
        </div>

        {/* Séparateur */}
        <div className="hidden lg:block w-px h-12 bg-white/10" aria-hidden="true"></div>

        {/* Items */}
        <div className="grid grid-cols-3 grid-rows-2 gap-1 place-items-center">
          {[game.slot1, game.slot2, game.slot3, game.slot4, game.slot5, game.slot6].map(
            (slot, index) => (
              <img
                key={index}
                src={slot}
                alt={`Item ${index + 1}`}
                className="h-8 w-8 rounded-sm border-2 border-slate-600/80"
              />
            )
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

/**
 * Composant principal
 */
function Cards() {
  return (
    <div className="w-full space-y-4">
      {matchtest.map((game) => (
        <CardItem key={game.id} game={game} />
      ))}
    </div>
  )
}

export default Cards
