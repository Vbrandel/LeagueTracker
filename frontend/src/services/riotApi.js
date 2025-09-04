export const API_KEY = "RGAPI-967b31a2-fdbc-428b-b939-1c620b1b3839";
export const MATCH_BASE_URL = "https://europe.api.riotgames.com/lol/match/v5/matches";
export const RANK_BASE_URL = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid";

export const playersList = [
  { puuid: "iH_iOH-AgK8yFcf5ahZtpeD5g0M4iw72fIdDeUC_xk3kNZBi3DevjgBhw_Q9Ft99-vZY7vU6u0ojMQ", name: "Virgil", nickname: "Nekes", pdp: "/assets/virgil.png" },
  { puuid: "p9G07LD8pNT-2giDP4IQnlQSrR-IGfSHNoE9HxVhvNrSha0uFXrUAmYw44F-r0vfBRCSfdQs_ZzKZw", name: "Yazid", nickname: "Karim Benzemaaa", pdp: "/assets/yazid.png" },
  { puuid: "PZKf_T-LGEm5ghlOfRQ_irppKrl9Ti-FodQL6iWYz9UE6THTZDKbiY_kxuYykI6x5Rh13G9ykiadBQ", name: "Maxence", nickname: "vicxys11", pdp: "/assets/maxence.png" },
  { puuid: "EKBaIyWRmeUmH2sYH_6vZoFee3p05pZUpnhf2ctsbjNbHbojTO1JI3u7_JmW_3dLhrMOqzx58i0d5g", name: "Adrien", nickname: "Nervìosse", pdp: "/assets/adrien.png" }
];


async function riotFetch(url) {
  const res = await fetch(url, { headers: { "X-Riot-Token": API_KEY } });
  if (!res.ok) throw new Error(`Erreur API (${url}): ${res.status}`);
  return res.json();
}

// Classement
export async function getInfoRank(puuid) {
  return riotFetch(`${RANK_BASE_URL}/${puuid}`);
}

// Matchs
async function getLastMatches(puuid, count = 5) {
  return riotFetch(`${MATCH_BASE_URL}/by-puuid/${puuid}/ids?start=0&count=${count}`);
}

async function getMatchDetails(matchId) {
  return riotFetch(`${MATCH_BASE_URL}/${matchId}`);
}

export async function getLast10GlobalMatches() {
  let allMatches = [];
  for (const player of playersList) {
    const matchIds = await getLastMatches(player.puuid, 5);
    for (const matchId of matchIds) {
      const match = await getMatchDetails(matchId);
      const participant = match.info.participants.find(p => p.puuid === player.puuid);
      if (participant) {
        allMatches.push({
          id: match.metadata.matchId,
          timestamp: match.info.gameEndTimestamp,
          prenom: player.name,
          nickname: player.nickname,
          champ: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/champion/${participant.championName}.png`,
          kill: participant.kills,
          death: participant.deaths,
          assist: participant.assists,
          duree: Math.floor(match.info.gameDuration / 60) + " min",
          date: new Date(match.info.gameEndTimestamp).toLocaleDateString(),
          result: participant.win ? "W" : "L",
          sumn1: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/spell/Summoner${participant.summoner1Id}.png`,
          sumn2: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/spell/Summoner${participant.summoner2Id}.png`,
          slot1: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item0}.png`,
          slot2: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item1}.png`,
          slot3: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item2}.png`,
          slot4: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item3}.png`,
          slot5: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item4}.png`,
          slot6: `https://ddragon.leagueoflegends.com/cdn/14.18.1/img/item/${participant.item5}.png`,
        });
      }
    }
  }

  return allMatches.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
}
