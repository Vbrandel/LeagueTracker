// riotApi.js
export const API_KEY = import.meta.env.VITE_API_KEY;
export const MATCH_BASE_URL = "https://europe.api.riotgames.com/lol/match/v5/matches";
export const RANK_BASE_URL = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid";


import { SUMMONER_SPELLS } from "./summonerSpells.js";
import { ITEM_PLACEHOLDER } from "./items.js";

// Liste des joueurs
export const playersList = [
    { puuid: "iH_iOH-AgK8yFcf5ahZtpeD5g0M4iw72fIdDeUC_xk3kNZBi3DevjgBhw_Q9Ft99-vZY7vU6u0ojMQ", name: "Virgil", nickname: "Nekes", pdp: "/assets/virgil.png" },
    { puuid: "p9G07LD8pNT-2giDP4IQnlQSrR-IGfSHNoE9HxVhvNrSha0uFXrUAmYw44F-r0vfBRCSfdQs_ZzKZw", name: "Yazid", nickname: "Karim Benzemaaa", pdp: "/assets/yazid.png" },
    { puuid: "PZKf_T-LGEm5ghlOfRQ_irppKrl9Ti-FodQL6iWYz9UE6THTZDKbiY_kxuYykI6x5Rh13G9ykiadBQ", name: "Maxence", nickname: "vicxys11", pdp: "/assets/maxence.png" },
    { puuid: "l1qUgWv2uRM5t6vwRIzVa3WvfGgyTuMa1vkCM1ZAX5HsKRkre-6hE_C3moTjoCb0sMqQ8dvwJDdenw", name: "Adrien", nickname: "Nervìosse", pdp: "/assets/adrien.png" },
    { puuid: "7Ni7FAbXXFjb3gph5XSOhM2Y-DpuWINvKgWvPMI_7MdXjcSZh8zEotgHkWRHr7sJ7O2fYoRDyZ-lNw", name: "Cesar", nickname: "SNIFFEUR2CALBAR", pdp: "/assets/cesar.png" },
    { puuid: "T3zkqXQdhww75Wi46FR0zstoP3DQIjoD7o1SndEXReC6XdjQSNbrqqL3BbuhDQ-axiynAi5EAYPkfQ", name: "Jordan", nickname: "Mcfouuuf", pdp: "/assets/maxence.png" },
    // { puuid: "5aW9dFg9W564JnlPxZbo4c298ZBCe5FQ3UZnCNBs5o9MXbjV_ECDkTs-OWpQNrV2gQwQPuKHoeJJyg", name: "Marqui", nickname: "MinouQuiGoutte", pdp: "/assets/marqui.png" },
    // { puuid: "fzWnf6xGUWQZUG9cccgy7Yi_1vrKxoe-bV85lbbF5kcgYBMR65WrlKe0givEgUm2JqhQ_U_7ePAj9g", name: "Tinou", nickname: "Congolais Malin", pdp: "/assets/tinou.png" },
    // { puuid: "my5H-kRZ779PrG3276d9PSAdu6Sal4ql8PMZKpBHQwUJ5X8KxDEmHQLe8IesnOlRMVHKSxilLtPl1A", name: "Ranson", nickname: "Ransomware", pdp: "/assets/ranson.png" }
  ];
  

// --- CACHE LOCALSTORAGE ---
const CACHE_DURATION = 3 * 60 * 1000; // 10 minutes

function getCachedData(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_DURATION) return null; // expiré
    return data;
  } catch (e) {
    return null;
  }
}

function setCachedData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch (e) {
    console.warn("Impossible de stocker le cache:", e);
  }
}

// --- Fetch avec cache persisté ---
async function cachedFetch(url) {
  const cached = getCachedData(url);
  if (cached) {
    console.log("CACHE HIT:", url);
    return cached;
  }

  console.log("CACHE MISS:", url);
  const res = await fetch(url, { headers: { "X-Riot-Token": API_KEY } });
  if (!res.ok) throw new Error(`Erreur API (${url}): ${res.status}`);
  const data = await res.json();
  setCachedData(url, data);
  return data;
}

// --- Relative Time ---
export function timeAgo(timestamp) {
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  const now = Date.now();
  const diff = timestamp - now;

  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(diff / (1000 * 60));
  const hours = Math.round(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (Math.abs(days) > 0) return rtf.format(days, "day");
  if (Math.abs(hours) > 0) return rtf.format(hours, "hour");
  if (Math.abs(minutes) > 0) return rtf.format(minutes, "minute");
  return rtf.format(seconds, "second");
}

// --- Classement ---
export async function getInfoRank(puuid) {
  return cachedFetch(`${RANK_BASE_URL}/${puuid}`);
}

// --- Matchs ---
async function getLastMatches(puuid, count = 10, type = "ranked") {
  const url = `${MATCH_BASE_URL}/by-puuid/${puuid}/ids?start=0&count=${count}&type=${type}`;
  return cachedFetch(url);
}

async function getMatchDetails(matchId) {
  const url = `${MATCH_BASE_URL}/${matchId}`;
  return cachedFetch(url);
}

export async function getLast10GlobalMatches() {
  let allMatches = [];

  for (const player of playersList) {
    // Récupère les derniers matchs ranked
    const matchIds = await getLastMatches(player.puuid, 5, "ranked");

    for (const matchId of matchIds) {
      const match = await getMatchDetails(matchId);
      const participant = match.info.participants.find(p => p.puuid === player.puuid);

      if (participant) {
        allMatches.push({
          id: match.metadata.matchId,
          timestamp: match.info.gameEndTimestamp,
          prenom: player.name,
          nickname: player.nickname,
          champ: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/champion/${participant.championName}.png`,
          kill: participant.kills,
          death: participant.deaths,
          assist: participant.assists,
          duree: Math.floor(match.info.gameDuration / 60) + " min",
          date: timeAgo(match.info.gameEndTimestamp),
          result: participant.win ? "W" : "L",
          sumn1: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/spell/${SUMMONER_SPELLS[participant.summoner1Id]}.png`,
          sumn2: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/spell/${SUMMONER_SPELLS[participant.summoner2Id]}.png`,
          slot1: participant.item0 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item0}.png` : ITEM_PLACEHOLDER,
          slot2: participant.item1 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item1}.png` : ITEM_PLACEHOLDER,
          slot3: participant.item2 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item2}.png` : ITEM_PLACEHOLDER,
          slot4: participant.item3 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item3}.png` : ITEM_PLACEHOLDER,
          slot5: participant.item4 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item4}.png` : ITEM_PLACEHOLDER,
          slot6: participant.item5 ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${participant.item5}.png` : ITEM_PLACEHOLDER,
        });
      }
    }
  }

  // Tri par date décroissante et limitation à 20 matchs
  return allMatches.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
}