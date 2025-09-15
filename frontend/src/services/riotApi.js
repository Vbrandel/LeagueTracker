// riotApi.js
import { SUMMONER_SPELLS } from "./summonerSpells.js";
import { ITEM_PLACEHOLDER } from "./items.js";

// --- CONFIG ---
export const API_KEY = import.meta.env.VITE_API_KEY;
const MATCH_BASE_URL = "https://europe.api.riotgames.com/lol/match/v5/matches";
const RANK_BASE_URL = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid";
const DDRAGON_URL = "https://ddragon.leagueoflegends.com/cdn/15.17.1";

export const playersList = [
  { puuid: "iH_iOH-AgK8yFcf5ahZtpeD5g0M4iw72fIdDeUC_xk3kNZBi3DevjgBhw_Q9Ft99-vZY7vU6u0ojMQ", name: "Virgil", nickname: "Nekes", pdp: "/assets/virgil.png" },
  { puuid: "p9G07LD8pNT-2giDP4IQnlQSrR-IGfSHNoE9HxVhvNrSha0uFXrUAmYw44F-r0vfBRCSfdQs_ZzKZw", name: "Yazid", nickname: "Karim Benzemaaa", pdp: "/assets/yazid.png" },
  { puuid: "PZKf_T-LGEm5ghlOfRQ_irppKrl9Ti-FodQL6iWYz9UE6THTZDKbiY_kxuYykI6x5Rh13G9ykiadBQ", name: "Maxence", nickname: "vicxys11", pdp: "/assets/maxence.png" },
  { puuid: "l1qUgWv2uRM5t6vwRIzVa3WvfGgyTuMa1vkCM1ZAX5HsKRkre-6hE_C3moTjoCb0sMqQ8dvwJDdenw", name: "Adrien", nickname: "Nervìosse", pdp: "/assets/adrien.png" },
  // { puuid: "7Ni7FAbXXFjb3gph5XSOhM2Y-DpuWINvKgWvPMI_7MdXjcSZh8zEotgHkWRHr7sJ7O2fYoRDyZ-lNw", name: "Cesar", nickname: "SNIFFEUR2CALBAR", pdp: "/assets/cesar.png" },
  { puuid: "T3zkqXQdhww75Wi46FR0zstoP3DQIjoD7o1SndEXReC6XdjQSNbrqqL3BbuhDQ-axiynAi5EAYPkfQ", name: "Jordan", nickname: "Mcfouuuf", pdp: "/assets/maxence.png" }
  // { puuid: "5aW9dFg9W564JnlPxZbo4c298ZBCe5FQ3UZnCNBs5o9MXbjV_ECDkTs-OWpQNrV2gQwQPuKHoeJJyg", name: "Marqui", nickname: "MinouQuiGoutte", pdp: "/assets/marqui.png" },
  // { puuid: "fzWnf6xGUWQZUG9cccgy7Yi_1vrKxoe-bV85lbbF5kcgYBMR65WrlKe0givEgUm2JqhQ_U_7ePAj9g", name: "Tinou", nickname: "Congolais Malin", pdp: "/assets/tinou.png" },
  // { puuid: "my5H-kRZ779PrG3276d9PSAdu6Sal4ql8PMZKpBHQwUJ5X8KxDEmHQLe8IesnOlRMVHKSxilLtPl1A", name: "Ranson", nickname: "Ransomware", pdp: "/assets/ranson.png" }
];


// --- CACHE LOCALSTORAGE ---
const CACHE_DURATION = 3 * 60 * 1000; // 3 min

const cache = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { timestamp, data } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_DURATION) return null;
      return data;
    } catch {
      return null;
    }
  },
  set(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {
      console.warn("Impossible de stocker le cache:", e);
    }
  },
};

// --- FETCH UTIL ---
async function cachedFetch(url) {
  const cached = cache.get(url);
  if (cached) return cached;

  const res = await fetch(url, { headers: { "X-Riot-Token": API_KEY } });
  if (!res.ok) throw new Error(`Erreur API (${url}): ${res.status}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
}

// --- UTIL: URL builders ---
const getChampionUrl = champ => `${DDRAGON_URL}/img/champion/${champ}.png`;
const getSpellUrl = id => `${DDRAGON_URL}/img/spell/${SUMMONER_SPELLS[id]}.png`;
const getItemUrl = id => id ? `${DDRAGON_URL}/img/item/${id}.png` : ITEM_PLACEHOLDER;

// --- RELATIVE TIME ---
export function timeAgo(timestamp) {
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  const diff = timestamp - Date.now();

  const units = [
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, ms] of units) {
    const value = Math.round(diff / ms);
    if (Math.abs(value) > 0) return rtf.format(value, unit);
  }
}

// --- API WRAPPERS ---
export const getInfoRank = puuid =>
  cachedFetch(`${RANK_BASE_URL}/${puuid}`);

const getLastMatches = (puuid, count = 10, type = "ranked") =>
  cachedFetch(`${MATCH_BASE_URL}/by-puuid/${puuid}/ids?start=0&count=${count}&type=${type}`);

const getMatchDetails = matchId =>
  cachedFetch(`${MATCH_BASE_URL}/${matchId}`);

// --- MAIN ---
export async function getLast10GlobalMatches() {
  const matches = await Promise.all(
    playersList.map(async player => {
      const matchIds = await getLastMatches(player.puuid, 5, "ranked");
      return Promise.all(
        matchIds.map(async matchId => {
          const match = await getMatchDetails(matchId);
          const participant = match.info.participants.find(p => p.puuid === player.puuid);

          if (!participant) return null;

          return {
            id: match.metadata.matchId,
            timestamp: match.info.gameEndTimestamp,
            prenom: player.name,
            nickname: player.nickname,
            champ: getChampionUrl(participant.championName),
            kill: participant.kills,
            death: participant.deaths,
            assist: participant.assists,
            duree: Math.floor(match.info.gameDuration / 60) + " min",
            date: timeAgo(match.info.gameEndTimestamp),
            result: participant.win ? "W" : "L",
            sumn1: getSpellUrl(participant.summoner1Id),
            sumn2: getSpellUrl(participant.summoner2Id),
            slot1: getItemUrl(participant.item0),
            slot2: getItemUrl(participant.item1),
            slot3: getItemUrl(participant.item2),
            slot4: getItemUrl(participant.item3),
            slot5: getItemUrl(participant.item4),
            slot6: getItemUrl(participant.item5),
          };
        })
      );
    })
  );

  return matches.flat().filter(Boolean).sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
}
