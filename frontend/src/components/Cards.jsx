import matchtest from '../data/matchtest.json'

function Cards() {

  return (
    <>
        <div>

            {matchtest.map(game => (
                <div key={game.id} className={`card-matches flex ${game.result === 'W' ? 'bg-gradient-to-b from-blue-600/20 to-blue-600/10' : game.result === 'L' ? 'bg-gradient-to-b from-red-600/20 to-red-600/10' : 'bg-gray-500'} justify-between items-center p-4 rounded-md border bg-black/80 border-slate-600/30`}>
                  <div className='flex flex-row items-center gap-4'>
                    <img src={game.champ} className='rounded-sm w-full border-2 border-slate-600/80'></img>
                    <div>
                      <p className='text-xl text-white'>{game.duree} / {game.date}</p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <p className="text-4xl font-bold text-white">{game.prenom}</p>
                    <p className='font-extralight text-white text-2xl'><span className='font-semibold opacity-100'>{game.kill}</span> / <span className='text-red-500 font-semibold'>{game.death}</span> / <span class="font-semibold text-yellow-200">{game.assist}</span></p>
                  </div>
                <div className='flex items-center gap-4 bg-slate-700 p-2 rounded-md border-solid border-1 border-slate-600/80'>
                  <div className='grid grid-cols-1 grid-rows-2 gap-1'>
                    <img src={game.sumn1} className='border-2 border-slate-600/80'></img>
                    <div className="row-start-2">                   
                    <img src={game.sumn2} className='border-2 border-slate-600/80'></img></div>
                  </div>
                  <div className="hidden lg:block w-px h-12 bg-white/10 mx-0" aria-hidden="true"></div>

                  <div className='grid grid-cols-3 grid-rows-2 gap-1 place-items-center '>
                      <img src={game.slot1} className='rounded-sm border-2 border-slate-600/80'></img>
                      <img src={game.slot2} className='rounded-sm border-2 border-slate-600/80'></img>
                      <img src={game.slot3} className='rounded-sm border-2 border-slate-600/80'></img>              
                      <img src={game.slot4} className='rounded-sm border-2 border-slate-600/80'></img>
                      <img src={game.slot5} className='rounded-sm border-2 border-slate-600/80'></img>
                      <img src={game.slot6} className='rounded-sm border-2 border-slate-600/80'></img>
                  </div>
                </div>

                </div>
                     )
                )
            }
        </div>
    </>
  )
}

export default Cards
