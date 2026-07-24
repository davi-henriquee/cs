const STORAGE_KEY = "cs2-bot-premier-tracker-v1";
const BACKUP_VERSION = 1;
const STATIC_STATE_URL = "exp.json";
const MAX_PLAYER_OVERALL = 140;
const COMPETITIVE_TEAM_COUNT = 16;
const SWISS_TARGET_RECORD = 3;

const maps = [
  "cache",
  "ancient",
  "anubis",
  "dust 2",
  "inferno",
  "mirage",
  "nuke",
  "overpass",
  "train",
  "tuscan",
  "vertigo",
];

const expPlayers = [
  { id: "pedro", name: "Pedro" },
  { id: "vinicius", name: "Vinicius" },
  { id: "vini", name: "Vini" },
  { id: "davi", name: "Davi" },
  { id: "cicero", name: "Cícero" },
  { id: "handrei", name: "Handrei" },
  { id: "mathiussi", name: "Mathiussi" },
];

const ranks = [
  { key: "GRAY", name: "GRAY", min: 0, max: 5000, color: "#7c8797" },
  { key: "LIGHT_BLUE", name: "LIGHT BLUE", min: 5000, max: 10000, color: "#5ac8ff" },
  { key: "DARK_BLUE", name: "DARK BLUE", min: 10000, max: 15000, color: "#2867ff" },
  { key: "LIGHT_PURPLE", name: "LIGHT PURPLE", min: 15000, max: 20000, color: "#b177ff" },
  { key: "PINK", name: "PINK", min: 20000, max: 25000, color: "#ff4ea3" },
  { key: "RED", name: "RED", min: 25000, max: 30000, color: "#ff354b" },
  { key: "GOLD", name: "GOLD", min: 30000, max: Infinity, color: "#ffcb3d" },
];

const botLevels = [
  { key: "GRAY", label: "BOT GRAY", short: "GRAY", commandName: "BOT Gray", color: "#7c8797", strength: 1 },
  { key: "LIGHT_BLUE", label: "BOT LIGHT BLUE", short: "LIGHT BLUE", commandName: "BOT Light Blue", color: "#5ac8ff", strength: 3 },
  { key: "DARK_BLUE", label: "BOT DARK BLUE", short: "DARK BLUE", commandName: "BOT Dark Blue", color: "#2867ff", strength: 6 },
  { key: "LIGHT_PURPLE", label: "BOT LIGHT PURPLE", short: "PURPLE", commandName: "BOT Purple", color: "#b177ff", strength: 8 },
  { key: "PINK", label: "BOT PINK", short: "PINK", commandName: "BOT Pink", color: "#ff4ea3", strength: 10 },
  { key: "RED", label: "BOT RED", short: "RED", commandName: "BOT Red", color: "#ff354b", strength: 11 },
  { key: "PRO", label: "BOT PRO", short: "PRO", commandName: "BOT PRO", color: "#ffcb3d", strength: 12 },
];

const ENEMY_STRENGTH_MULTIPLIER_MIN = 1.2;
const ENEMY_STRENGTH_MULTIPLIER_MAX = 1.5;
const rankBotTargets = {
  GRAY: "GRAY",
  LIGHT_BLUE: "LIGHT_BLUE",
  DARK_BLUE: "DARK_BLUE",
  LIGHT_PURPLE: "LIGHT_PURPLE",
  PINK: "PINK",
  RED: "RED",
  GOLD: "PRO",
};

const defaultState = {
  baseRating: 0,
  matches: [],
  esports: {
    teams: [],
    players: [],
  },
  competitive: {
    tournament: null,
  },
  exp: {
    matches: [],
    playerImages: {},
  },
};

let state = loadState();
let selectedMatchId = null;
let activeView = "exp";
let activeEsportsTab = "competitive";
let editingTeamId = null;
let editingPlayerId = null;
let teamLogoDraft = null;
let playerImageDraft = null;
let selectedTeamDetailId = null;
let selectedCompetitiveTeamIds = [];
let selectedCompetitiveMatchId = null;
let activeExpTab = "matches";
let selectedExpMatchId = null;
let selectedExpPlayerId = null;

const elements = {
  appTabs: document.querySelectorAll(".app-tab"),
  rankingView: document.querySelector("#rankingView"),
  esportsView: document.querySelector("#esportsView"),
  expView: document.querySelector("#expView"),
  generateMatchBtn: document.querySelector("#generateMatchBtn"),
  currentRating: document.querySelector("#currentRating"),
  rankBadge: document.querySelector("#rankBadge"),
  rankProgressBar: document.querySelector("#rankProgressBar"),
  rankNextText: document.querySelector("#rankNextText"),
  currentStreak: document.querySelector("#currentStreak"),
  recordText: document.querySelector("#recordText"),
  winRateText: document.querySelector("#winRateText"),
  baseRatingInput: document.querySelector("#baseRatingInput"),
  saveBaseRatingBtn: document.querySelector("#saveBaseRatingBtn"),
  exportBackupBtn: document.querySelector("#exportBackupBtn"),
  importBackupBtn: document.querySelector("#importBackupBtn"),
  backupFileInput: document.querySelector("#backupFileInput"),
  resetDataBtn: document.querySelector("#resetDataBtn"),
  mapsTableBody: document.querySelector("#mapsTableBody"),
  matchesTableBody: document.querySelector("#matchesTableBody"),
  emptyState: document.querySelector("#emptyState"),
  matchDialog: document.querySelector("#matchDialog"),
  closeDialogBtn: document.querySelector("#closeDialogBtn"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogSide: document.querySelector("#dialogSide"),
  playerTeamSide: document.querySelector("#playerTeamSide"),
  enemyTeamSide: document.querySelector("#enemyTeamSide"),
  playerTeamStrength: document.querySelector("#playerTeamStrength"),
  enemyTeamStrength: document.querySelector("#enemyTeamStrength"),
  playerBotsList: document.querySelector("#playerBotsList"),
  enemyBotsList: document.querySelector("#enemyBotsList"),
  botCommandText: document.querySelector("#botCommandText"),
  copyCommandBtn: document.querySelector("#copyCommandBtn"),
  teamRoundsInput: document.querySelector("#teamRoundsInput"),
  enemyRoundsInput: document.querySelector("#enemyRoundsInput"),
  fragsInput: document.querySelector("#fragsInput"),
  deathsInput: document.querySelector("#deathsInput"),
  deltaPreview: document.querySelector("#deltaPreview"),
  deleteMatchBtn: document.querySelector("#deleteMatchBtn"),
  markPendingBtn: document.querySelector("#markPendingBtn"),
  saveResultBtn: document.querySelector("#saveResultBtn"),
  esportsSubTabs: document.querySelectorAll("[data-esports-tab]"),
  teamsPanel: document.querySelector("#teamsPanel"),
  playersPanel: document.querySelector("#playersPanel"),
  competitivePanel: document.querySelector("#competitivePanel"),
  teamFormTitle: document.querySelector("#teamFormTitle"),
  teamNameInput: document.querySelector("#teamNameInput"),
  teamLogoInput: document.querySelector("#teamLogoInput"),
  teamLogoPreview: document.querySelector("#teamLogoPreview"),
  clearTeamLogoBtn: document.querySelector("#clearTeamLogoBtn"),
  cancelTeamEditBtn: document.querySelector("#cancelTeamEditBtn"),
  saveTeamBtn: document.querySelector("#saveTeamBtn"),
  teamsList: document.querySelector("#teamsList"),
  teamsEmptyState: document.querySelector("#teamsEmptyState"),
  playerFormTitle: document.querySelector("#playerFormTitle"),
  playerNameInput: document.querySelector("#playerNameInput"),
  playerNationalityInput: document.querySelector("#playerNationalityInput"),
  playerOverallInput: document.querySelector("#playerOverallInput"),
  playerTeamSelect: document.querySelector("#playerTeamSelect"),
  playerImageInput: document.querySelector("#playerImageInput"),
  playerImagePreview: document.querySelector("#playerImagePreview"),
  clearPlayerImageBtn: document.querySelector("#clearPlayerImageBtn"),
  cancelPlayerEditBtn: document.querySelector("#cancelPlayerEditBtn"),
  savePlayerBtn: document.querySelector("#savePlayerBtn"),
  playersList: document.querySelector("#playersList"),
  playersEmptyState: document.querySelector("#playersEmptyState"),
  teamDetailDialog: document.querySelector("#teamDetailDialog"),
  closeTeamDetailBtn: document.querySelector("#closeTeamDetailBtn"),
  teamDetailName: document.querySelector("#teamDetailName"),
  teamDetailOverall: document.querySelector("#teamDetailOverall"),
  teamDetailLogo: document.querySelector("#teamDetailLogo"),
  teamDetailMeta: document.querySelector("#teamDetailMeta"),
  teamDetailPlayers: document.querySelector("#teamDetailPlayers"),
  createCompetitiveBtn: document.querySelector("#createCompetitiveBtn"),
  resetCompetitiveBtn: document.querySelector("#resetCompetitiveBtn"),
  competitiveSetupPanel: document.querySelector("#competitiveSetupPanel"),
  competitiveSelectedCount: document.querySelector("#competitiveSelectedCount"),
  competitiveTeamsSelector: document.querySelector("#competitiveTeamsSelector"),
  cancelCompetitiveSetupBtn: document.querySelector("#cancelCompetitiveSetupBtn"),
  startCompetitiveBtn: document.querySelector("#startCompetitiveBtn"),
  competitiveBoard: document.querySelector("#competitiveBoard"),
  competitiveStatusTitle: document.querySelector("#competitiveStatusTitle"),
  competitiveStandings: document.querySelector("#competitiveStandings"),
  competitiveRounds: document.querySelector("#competitiveRounds"),
  competitiveEmptyState: document.querySelector("#competitiveEmptyState"),
  competitiveMatchDialog: document.querySelector("#competitiveMatchDialog"),
  closeCompetitiveMatchBtn: document.querySelector("#closeCompetitiveMatchBtn"),
  competitiveMatchTitle: document.querySelector("#competitiveMatchTitle"),
  winnerTeamABtn: document.querySelector("#winnerTeamABtn"),
  winnerTeamBBtn: document.querySelector("#winnerTeamBBtn"),
  generateExpMatchBtn: document.querySelector("#generateExpMatchBtn"),
  expSubTabs: document.querySelectorAll("[data-exp-tab]"),
  expMatchesPanel: document.querySelector("#expMatchesPanel"),
  expRankingPanel: document.querySelector("#expRankingPanel"),
  expMatchesTableBody: document.querySelector("#expMatchesTableBody"),
  expEmptyState: document.querySelector("#expEmptyState"),
  expMapsTableBody: document.querySelector("#expMapsTableBody"),
  expRankingList: document.querySelector("#expRankingList"),
  expRankingEmptyState: document.querySelector("#expRankingEmptyState"),
  expSetupDialog: document.querySelector("#expSetupDialog"),
  closeExpSetupBtn: document.querySelector("#closeExpSetupBtn"),
  cancelExpSetupBtn: document.querySelector("#cancelExpSetupBtn"),
  confirmExpMatchBtn: document.querySelector("#confirmExpMatchBtn"),
  expPlayerSelector: document.querySelector("#expPlayerSelector"),
  expMatchDialog: document.querySelector("#expMatchDialog"),
  closeExpMatchBtn: document.querySelector("#closeExpMatchBtn"),
  expMatchTitle: document.querySelector("#expMatchTitle"),
  expTeamAList: document.querySelector("#expTeamAList"),
  expTeamBList: document.querySelector("#expTeamBList"),
  expStatsGrid: document.querySelector("#expStatsGrid"),
  expTeamARoundsInput: document.querySelector("#expTeamARoundsInput"),
  expTeamBRoundsInput: document.querySelector("#expTeamBRoundsInput"),
  expResultPreview: document.querySelector("#expResultPreview"),
  deleteExpMatchBtn: document.querySelector("#deleteExpMatchBtn"),
  markExpPendingBtn: document.querySelector("#markExpPendingBtn"),
  saveExpMatchBtn: document.querySelector("#saveExpMatchBtn"),
  expPlayerDetailDialog: document.querySelector("#expPlayerDetailDialog"),
  closeExpPlayerDetailBtn: document.querySelector("#closeExpPlayerDetailBtn"),
  expPlayerDetailName: document.querySelector("#expPlayerDetailName"),
  expPlayerDetailStats: document.querySelector("#expPlayerDetailStats"),
  expPlayerHistoryBody: document.querySelector("#expPlayerHistoryBody"),
  expPlayerHistoryEmpty: document.querySelector("#expPlayerHistoryEmpty"),
  expPlayerPhotoPreview: document.querySelector("#expPlayerPhotoPreview"),
  uploadExpPlayerPhotoBtn: document.querySelector("#uploadExpPlayerPhotoBtn"),
  removeExpPlayerPhotoBtn: document.querySelector("#removeExpPlayerPhotoBtn"),
  expPlayerPhotoInput: document.querySelector("#expPlayerPhotoInput"),
};

elements.appTabs.forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});
elements.generateMatchBtn.addEventListener("click", generateMatch);
elements.saveBaseRatingBtn.addEventListener("click", saveBaseRating);
elements.exportBackupBtn.addEventListener("click", exportBackup);
elements.importBackupBtn.addEventListener("click", () => elements.backupFileInput.click());
elements.backupFileInput.addEventListener("change", importBackup);
elements.resetDataBtn.addEventListener("click", resetData);
elements.closeDialogBtn.addEventListener("click", closeDialog);
elements.copyCommandBtn.addEventListener("click", copyCommands);
elements.saveResultBtn.addEventListener("click", saveMatchResult);
elements.markPendingBtn.addEventListener("click", markMatchPending);
elements.deleteMatchBtn.addEventListener("click", deleteSelectedMatch);
elements.esportsSubTabs.forEach((button) => {
  button.addEventListener("click", () => switchEsportsTab(button.dataset.esportsTab));
});
elements.teamLogoInput.addEventListener("change", handleTeamLogoChange);
elements.clearTeamLogoBtn.addEventListener("click", clearTeamLogo);
elements.cancelTeamEditBtn.addEventListener("click", resetTeamForm);
elements.saveTeamBtn.addEventListener("click", saveTeam);
elements.teamsList.addEventListener("click", handleTeamsListClick);
elements.teamsList.addEventListener("keydown", handleTeamsListKeydown);
elements.cancelPlayerEditBtn.addEventListener("click", resetPlayerForm);
elements.savePlayerBtn.addEventListener("click", savePlayer);
elements.playersList.addEventListener("click", handlePlayersListClick);
elements.playerImageInput.addEventListener("change", handlePlayerImageChange);
elements.clearPlayerImageBtn.addEventListener("click", clearPlayerImage);
elements.closeTeamDetailBtn.addEventListener("click", closeTeamDetail);
elements.teamDetailDialog.addEventListener("click", (event) => {
  if (event.target === elements.teamDetailDialog) {
    closeTeamDetail();
  }
});
elements.createCompetitiveBtn.addEventListener("click", openCompetitiveSetup);
elements.resetCompetitiveBtn.addEventListener("click", resetCompetitiveTournament);
elements.cancelCompetitiveSetupBtn.addEventListener("click", closeCompetitiveSetup);
elements.startCompetitiveBtn.addEventListener("click", startCompetitiveTournament);
elements.competitiveTeamsSelector.addEventListener("change", handleCompetitiveSelectionChange);
elements.competitiveRounds.addEventListener("click", handleCompetitiveRoundsClick);
elements.closeCompetitiveMatchBtn.addEventListener("click", closeCompetitiveMatch);
elements.winnerTeamABtn.addEventListener("click", () => saveCompetitiveWinner(elements.winnerTeamABtn.dataset.teamId));
elements.winnerTeamBBtn.addEventListener("click", () => saveCompetitiveWinner(elements.winnerTeamBBtn.dataset.teamId));
elements.competitiveMatchDialog.addEventListener("click", (event) => {
  if (event.target === elements.competitiveMatchDialog) {
    closeCompetitiveMatch();
  }
});
elements.generateExpMatchBtn.addEventListener("click", openExpSetup);
elements.expSubTabs.forEach((button) => {
  button.addEventListener("click", () => switchExpTab(button.dataset.expTab));
});
elements.closeExpSetupBtn.addEventListener("click", closeExpSetup);
elements.cancelExpSetupBtn.addEventListener("click", closeExpSetup);
elements.confirmExpMatchBtn.addEventListener("click", generateExpMatchFromSetup);
elements.expPlayerSelector.addEventListener("change", handleExpPlayerSelectorChange);
elements.expMatchesTableBody.addEventListener("click", handleExpMatchesTableClick);
elements.expMatchesTableBody.addEventListener("keydown", handleExpMatchesTableKeydown);
elements.closeExpMatchBtn.addEventListener("click", closeExpMatch);
elements.deleteExpMatchBtn.addEventListener("click", deleteSelectedExpMatch);
elements.markExpPendingBtn.addEventListener("click", markExpMatchPending);
elements.saveExpMatchBtn.addEventListener("click", saveExpMatchResult);
elements.expStatsGrid.addEventListener("input", updateExpResultPreview);
elements.expStatsGrid.addEventListener("click", handleExpStatsGridClick);
elements.expTeamARoundsInput.addEventListener("input", updateExpResultPreview);
elements.expTeamBRoundsInput.addEventListener("input", updateExpResultPreview);
elements.expRankingList.addEventListener("click", handleExpRankingClick);
elements.expRankingList.addEventListener("keydown", handleExpRankingKeydown);
elements.closeExpPlayerDetailBtn.addEventListener("click", closeExpPlayerDetail);
elements.uploadExpPlayerPhotoBtn.addEventListener("click", () => elements.expPlayerPhotoInput.click());
elements.removeExpPlayerPhotoBtn.addEventListener("click", removeExpPlayerPhoto);
elements.expPlayerPhotoInput.addEventListener("change", handleExpPlayerPhotoChange);
elements.expSetupDialog.addEventListener("click", (event) => {
  if (event.target === elements.expSetupDialog) {
    closeExpSetup();
  }
});
elements.expMatchDialog.addEventListener("click", (event) => {
  if (event.target === elements.expMatchDialog) {
    closeExpMatch();
  }
});
elements.expPlayerDetailDialog.addEventListener("click", (event) => {
  if (event.target === elements.expPlayerDetailDialog) {
    closeExpPlayerDetail();
  }
});

[
  elements.teamRoundsInput,
  elements.enemyRoundsInput,
  elements.fragsInput,
  elements.deathsInput,
].forEach((input) => input.addEventListener("input", updateDeltaPreview));

elements.matchDialog.addEventListener("click", (event) => {
  if (event.target === elements.matchDialog) {
    closeDialog();
  }
});

render();
initializeStaticState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();

    const parsed = JSON.parse(raw);
    return normalizeAppState(parsed);
  } catch {
    return getDefaultState();
  }
}

function getDefaultState() {
  return {
    baseRating: defaultState.baseRating,
    matches: [],
    esports: {
      teams: [],
      players: [],
    },
    competitive: {
      tournament: null,
    },
    exp: {
      matches: [],
      playerImages: {},
    },
  };
}

function saveState() {
  saveStateLocally();
}

function saveStateLocally() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function switchView(view) {
  if (!["ranking", "esports", "exp"].includes(view)) return;
  activeView = view;

  elements.appTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  elements.rankingView.hidden = view !== "ranking";
  elements.rankingView.classList.toggle("active", view === "ranking");
  elements.esportsView.hidden = view !== "esports";
  elements.esportsView.classList.toggle("active", view === "esports");
  elements.expView.hidden = view !== "exp";
  elements.expView.classList.toggle("active", view === "exp");
  elements.generateMatchBtn.hidden = view !== "ranking";

  if (view === "esports") {
    renderEsports();
  }

  if (view === "exp") {
    renderExp();
  }
}

function switchEsportsTab(tab) {
  if (!["teams", "players", "competitive"].includes(tab)) return;
  activeEsportsTab = tab;

  elements.esportsSubTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.esportsTab === tab);
  });

  elements.teamsPanel.hidden = tab !== "teams";
  elements.teamsPanel.classList.toggle("active", tab === "teams");
  elements.playersPanel.hidden = tab !== "players";
  elements.playersPanel.classList.toggle("active", tab === "players");
  elements.competitivePanel.hidden = tab !== "competitive";
  elements.competitivePanel.classList.toggle("active", tab === "competitive");

  if (tab === "competitive") {
    renderCompetitive();
  }
}

function switchExpTab(tab) {
  if (!["matches", "ranking"].includes(tab)) return;
  activeExpTab = tab;

  elements.expSubTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.expTab === tab);
  });

  elements.expMatchesPanel.hidden = tab !== "matches";
  elements.expMatchesPanel.classList.toggle("active", tab === "matches");
  elements.expRankingPanel.hidden = tab !== "ranking";
  elements.expRankingPanel.classList.toggle("active", tab === "ranking");
}

function exportBackup() {
  const backup = {
    app: "CS RANKED",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "exp.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importBackup(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const importedState = parseBackup(String(reader.result ?? ""));
      const confirmed = window.confirm("Importing this backup will replace the current history. Continue?");
      if (!confirmed) return;

      state = importedState;
      selectedMatchId = null;
      selectedExpMatchId = null;
      selectedExpPlayerId = null;
      selectedCompetitiveMatchId = null;
      selectedCompetitiveTeamIds = [];
      saveState();
      render();
      closeDialog();
      closeExpSetup();
      closeExpMatch();
      closeExpPlayerDetail();
      closeCompetitiveMatch();
      window.alert("Backup imported in this browser. To publish it for everyone, export and upload exp.json to the site files.");
    } catch (error) {
      console.warn("Import failed", error);
      window.alert("I couldn't import this file. Check if it is a valid backup or exp.json file.");
    } finally {
      elements.backupFileInput.value = "";
    }
  });
  reader.addEventListener("error", () => {
    window.alert("I couldn't read this file.");
    elements.backupFileInput.value = "";
  });
  reader.readAsText(file);
}

function parseBackup(rawText) {
  const parsed = JSON.parse(rawText);
  return normalizeStatePayload(parsed);
}

function normalizeStatePayload(payload) {
  const data = payload?.data ?? payload;

  if (!data || typeof data !== "object") {
    throw new Error("Invalid data file");
  }

  if (!data.exp && Array.isArray(data.matches) && data.matches.some(isExpMatchLike)) {
    return normalizeAppState({
      ...getDefaultState(),
      exp: {
        matches: data.matches,
        playerImages: data.playerImages ?? {},
      },
    });
  }

  return normalizeAppState(data);
}

function isExpMatchLike(match) {
  return Boolean(match && typeof match === "object" && (Array.isArray(match.teamAIds) || Array.isArray(match.teamBIds)));
}

function normalizeAppState(data) {
  return {
    baseRating: clamp(Number(data.baseRating) || 0, 0, 50000),
    matches: Array.isArray(data.matches) ? data.matches.map(normalizeMatch).filter(Boolean) : [],
    esports: normalizeEsports(data.esports),
    competitive: normalizeCompetitive(data.competitive),
    exp: normalizeExp(data.exp),
  };
}

async function initializeStaticState() {
  try {
    const stateUrl = `${STATIC_STATE_URL}?ts=${Date.now()}`;
    const response = await fetch(stateUrl, { cache: "no-store" });
    if (response.status === 404) return;

    if (!response.ok) {
      throw new Error(`Static data load failed: ${response.status}`);
    }

    const payload = await response.json();
    state = normalizeStatePayload(payload);
    saveStateLocally();
    render();
  } catch (error) {
    console.warn(`${STATIC_STATE_URL} unavailable or invalid. Using local data.`, error);
  }
}

function normalizeExp(exp) {
  const matches = Array.isArray(exp?.matches)
    ? exp.matches.map(normalizeExpMatch).filter(Boolean)
    : [];

  return {
    matches,
    playerImages: normalizeExpPlayerImages(exp?.playerImages),
  };
}

function normalizeExpPlayerImages(playerImages) {
  const normalized = {};
  if (!playerImages || typeof playerImages !== "object") return normalized;

  expPlayers.forEach((player) => {
    const image = normalizeLogo(playerImages[player.id]);
    if (image) {
      normalized[player.id] = image;
    }
  });

  return normalized;
}

function normalizeExpMatch(match) {
  if (!match || typeof match !== "object") return null;

  const teamAIds = normalizeExpPlayerIds(match.teamAIds ?? match.teams?.a);
  const teamBIds = normalizeExpPlayerIds(match.teamBIds ?? match.teams?.b, new Set(teamAIds));
  const playerIds = [...teamAIds, ...teamBIds];
  if (playerIds.length < 2 || !teamAIds.length || !teamBIds.length) return null;

  const teamARounds = normalizeScoreValue(match.teamARounds);
  const teamBRounds = normalizeScoreValue(match.teamBRounds);
  const status = match.status === "completed" && teamARounds !== null && teamBRounds !== null
    ? "completed"
    : "pending";
  const playerStats = {};

  playerIds.forEach((playerId) => {
    playerStats[playerId] = normalizeExpPlayerStats(match.playerStats?.[playerId]);
  });

  return {
    id: typeof match.id === "string" && match.id ? match.id : makeId(),
    createdAt: Number.isNaN(new Date(match.createdAt).getTime())
      ? new Date().toISOString()
      : match.createdAt,
    map: maps.includes(match.map) ? match.map : pickRandom(maps),
    teamAIds,
    teamBIds,
    status,
    result: status === "completed" ? deriveExpResult(teamARounds, teamBRounds) : null,
    teamARounds: status === "completed" ? teamARounds : null,
    teamBRounds: status === "completed" ? teamBRounds : null,
    playerStats,
  };
}

function normalizeExpPlayerIds(ids, usedIds = new Set()) {
  if (!Array.isArray(ids)) return [];
  const validIds = new Set(expPlayers.map((player) => player.id));
  const normalized = [];

  ids.forEach((id) => {
    if (typeof id !== "string" || !validIds.has(id) || usedIds.has(id) || normalized.includes(id)) return;
    normalized.push(id);
  });

  return normalized;
}

function normalizeExpPlayerStats(stats) {
  return {
    kills: normalizeExpStatValue(stats?.kills, 999),
    deaths: normalizeExpStatValue(stats?.deaths, 999),
    assists: normalizeExpStatValue(stats?.assists, 999),
    mvp: normalizeExpStatValue(stats?.mvp, 99),
    score: normalizeExpStatValue(stats?.score, 99999),
  };
}

function normalizeExpStatValue(value, max) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? clamp(parsed, 0, max) : 0;
}

function normalizeCompetitive(competitive) {
  const tournament = normalizeTournament(competitive?.tournament);
  return { tournament };
}

function normalizeTournament(tournament) {
  if (!tournament || typeof tournament !== "object") return null;
  const teamIds = Array.isArray(tournament.teamIds)
    ? tournament.teamIds.filter((teamId) => typeof teamId === "string")
    : [];
  const rounds = Array.isArray(tournament.rounds)
    ? tournament.rounds.map(normalizeRound).filter(Boolean)
    : [];

  if (teamIds.length !== COMPETITIVE_TEAM_COUNT || !rounds.length) return null;

  return {
    id: typeof tournament.id === "string" && tournament.id ? tournament.id : makeId(),
    createdAt: Number.isNaN(new Date(tournament.createdAt).getTime())
      ? new Date().toISOString()
      : tournament.createdAt,
    status: tournament.status === "completed" ? "completed" : "active",
    teamIds,
    rounds,
  };
}

function normalizeRound(round) {
  if (!round || typeof round !== "object" || !Array.isArray(round.matches)) return null;

  return {
    id: typeof round.id === "string" && round.id ? round.id : makeId(),
    number: Math.max(1, parseInt(round.number, 10) || 1),
    matches: round.matches.map(normalizeCompetitiveMatch).filter(Boolean),
  };
}

function normalizeCompetitiveMatch(match) {
  if (!match || typeof match !== "object") return null;
  const teamAId = typeof match.teamAId === "string" ? match.teamAId : null;
  const teamBId = typeof match.teamBId === "string" ? match.teamBId : null;
  if (!teamAId || !teamBId) return null;
  const winnerId = match.winnerId === teamAId || match.winnerId === teamBId ? match.winnerId : null;

  return {
    id: typeof match.id === "string" && match.id ? match.id : makeId(),
    teamAId,
    teamBId,
    winnerId,
  };
}

function normalizeEsports(esports) {
  const teams = Array.isArray(esports?.teams)
    ? esports.teams.map(normalizeTeam).filter(Boolean)
    : [];
  const teamIds = new Set(teams.map((team) => team.id));
  const players = Array.isArray(esports?.players)
    ? esports.players.map((player) => normalizePlayer(player, teamIds)).filter(Boolean)
    : [];

  return { teams, players };
}

function normalizeTeam(team) {
  if (!team || typeof team !== "object") return null;
  const name = String(team.name ?? "").trim();
  if (!name) return null;

  return {
    id: typeof team.id === "string" && team.id ? team.id : makeId(),
    name: name.slice(0, 48),
    logo: normalizeLogo(team.logo),
  };
}

function normalizePlayer(player, teamIds) {
  if (!player || typeof player !== "object") return null;
  const name = String(player.name ?? "").trim();
  if (!name) return null;
  const teamId = typeof player.teamId === "string" && teamIds.has(player.teamId) ? player.teamId : null;

  return {
    id: typeof player.id === "string" && player.id ? player.id : makeId(),
    name: name.slice(0, 48),
    nationality: String(player.nationality ?? "").trim().slice(0, 36),
    overall: clamp(parseInt(player.overall, 10) || 0, 0, MAX_PLAYER_OVERALL),
    teamId,
    image: normalizeLogo(player.image),
  };
}

function normalizeLogo(logo) {
  if (typeof logo !== "string") return null;
  return logo.startsWith("data:image/") ? logo : null;
}

function normalizeMatch(match) {
  if (!match || typeof match !== "object") return null;

  const playerSide = match.playerSide === "TR" ? "TR" : "CT";
  const enemySide = playerSide === "CT" ? "TR" : "CT";
  const result = ["win", "draw", "loss"].includes(match.result) ? match.result : null;
  const teamRounds = normalizeScoreValue(match.teamRounds);
  const enemyRounds = normalizeScoreValue(match.enemyRounds);
  const frags = normalizeScoreValue(match.frags);
  const deaths = normalizeScoreValue(match.deaths);
  const ratingAtGeneration = Number(match.ratingAtGeneration) || 0;
  const rawPlayerStrength = Number(match.playerStrength);
  const playerStrength = Number.isFinite(rawPlayerStrength)
    ? clamp(rawPlayerStrength, botLevels[0].strength, botLevels[botLevels.length - 1].strength)
    : getPlayerStrengthForRating(ratingAtGeneration);
  const hasCompleteScore =
    result && teamRounds !== null && enemyRounds !== null && frags !== null && deaths !== null;
  const status = match.status === "completed" && hasCompleteScore ? "completed" : "pending";

  return {
    id: typeof match.id === "string" && match.id ? match.id : makeId(),
    createdAt: Number.isNaN(new Date(match.createdAt).getTime()) ? new Date().toISOString() : match.createdAt,
    map: maps.includes(match.map) ? match.map : pickRandom(maps),
    playerSide,
    enemySide,
    ratingAtGeneration,
    playerStrength,
    playerBots: normalizeBots(match.playerBots, 4),
    enemyBots: normalizeBots(match.enemyBots, 5),
    status,
    result: status === "completed" ? result : null,
    teamRounds: status === "completed" ? teamRounds : null,
    enemyRounds: status === "completed" ? enemyRounds : null,
    frags: status === "completed" ? frags : null,
    deaths: status === "completed" ? deaths : null,
  };
}

function normalizeBots(bots, expectedSize) {
  const normalized = Array.isArray(bots)
    ? bots
        .map((bot, index) => {
          const level = getBotLevel(bot?.level);
          return {
            id: typeof bot?.id === "string" && bot.id ? bot.id : makeId(),
            level: level.key,
            slot: Number(bot?.slot) || index + 1,
          };
        })
        .slice(0, expectedSize)
    : [];

  while (normalized.length < expectedSize) {
    normalized.push(makeBot(0, normalized.length + 1));
  }

  return normalized;
}

function normalizeScoreValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return null;
  return clamp(parsed, 0, 99);
}

function getRank(rating) {
  return ranks.find((rank) => rating >= rank.min && rating < rank.max) ?? ranks[0];
}

function getBotTargetLevel(rating) {
  const rank = getRank(rating);
  const targetKey = rankBotTargets[rank.key] ?? "GRAY";
  return botLevels.findIndex((level) => level.key === targetKey);
}

function getPlayerStrengthForRating(rating) {
  return getPlayerStrengthForTargetLevel(getBotTargetLevel(rating));
}

function getPlayerStrengthForTargetLevel(targetLevel) {
  return botLevels[targetLevel]?.strength ?? botLevels[0].strength;
}

function getMatchPlayerStrength(match) {
  const rawPlayerStrength = Number(match.playerStrength);
  if (Number.isFinite(rawPlayerStrength)) {
    return clamp(rawPlayerStrength, botLevels[0].strength, botLevels[botLevels.length - 1].strength);
  }

  return getPlayerStrengthForRating(match.ratingAtGeneration ?? 0);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeBot(targetLevel, index) {
  const offset = pickRandom([-1, 0, 0, 0, 1]);
  const botIndex = clamp(targetLevel + offset, 0, botLevels.length - 1);
  return makeExactBot(botIndex, index);
}

function makeExactBot(botIndex, index) {
  return {
    id: makeId(),
    level: botLevels[botIndex].key,
    slot: index,
  };
}

function makeTeam(targetLevel, size) {
  return Array.from({ length: size }, (_, index) => makeBot(targetLevel, index + 1));
}

function makeTeamWithMandatoryRank(targetLevel, size, mandatoryCount) {
  const team = [];

  for (let index = 0; index < mandatoryCount; index += 1) {
    team.push(makeExactBot(targetLevel, index + 1));
  }

  while (team.length < size) {
    team.push(makeBot(targetLevel, team.length + 1));
  }

  return shuffleTeam(team);
}

function getAllowedBotRange(targetLevel) {
  return {
    minIndex: clamp(targetLevel - 1, 0, botLevels.length - 1),
    maxIndex: clamp(targetLevel + 1, 0, botLevels.length - 1),
  };
}

function getAllowedBotOptions(minIndex, maxIndex) {
  return botLevels
    .map((level, botIndex) => ({ level, botIndex }))
    .filter(({ botIndex }) => botIndex >= minIndex && botIndex <= maxIndex);
}

function makeBotByStrength(targetAverage, index, minIndex = 0, maxIndex = botLevels.length - 1) {
  const options = getAllowedBotOptions(minIndex, maxIndex);
  const minStrength = options[0].level.strength;
  const maxStrength = options[options.length - 1].level.strength;
  const wantedStrength = clamp(targetAverage + (Math.random() - 0.5) * 3, minStrength, maxStrength);
  const weights = options.map(({ level, botIndex }) => ({
    botIndex,
    weight: 1 / (1 + Math.abs(level.strength - wantedStrength)) ** 2,
  }));
  const botIndex = pickWeighted(weights);

  return {
    id: makeId(),
    level: botLevels[botIndex].key,
    slot: index,
  };
}

function makeTeamByAverageStrength(
  targetAverage,
  size,
  fixedBots = [],
  minIndex = 0,
  maxIndex = botLevels.length - 1,
) {
  const options = getAllowedBotOptions(minIndex, maxIndex);
  const bestTeams = [];
  let bestScore = Infinity;
  const remainingSize = Math.max(size - fixedBots.length, 0);

  const buildTeams = (generatedBots) => {
    if (generatedBots.length === remainingSize) {
      const team = [...fixedBots, ...generatedBots];
      const average = getAverageStrength(team);
      const score = Math.abs(average - targetAverage);

      if (score + Number.EPSILON < bestScore) {
        bestTeams.length = 0;
        bestScore = score;
      }

      if (Math.abs(score - bestScore) <= Number.EPSILON) {
        bestTeams.push(team);
      }

      return;
    }

    options.forEach(({ botIndex }) => {
      buildTeams([...generatedBots, makeExactBot(botIndex, fixedBots.length + generatedBots.length + 1)]);
    });
  };

  buildTeams([]);

  const bestTeam = pickRandom(bestTeams);
  const fallbackTeam = [...fixedBots];

  while (fallbackTeam.length < size) {
    fallbackTeam.push(makeBotByStrength(targetAverage, fallbackTeam.length + 1, minIndex, maxIndex));
  }

  return shuffleTeam(bestTeam ?? fallbackTeam);
}

function makeTeamFromIndexes(indexes) {
  return shuffleTeam(indexes.map((botIndex, index) => makeExactBot(botIndex, index + 1)));
}

function buildBotIndexCombinations(options, size) {
  const combinations = [];

  const build = (indexes) => {
    if (indexes.length === size) {
      combinations.push(indexes);
      return;
    }

    options.forEach(({ botIndex }) => build([...indexes, botIndex]));
  };

  build([]);
  return combinations;
}

function countBotIndex(indexes, targetLevel) {
  return indexes.filter((botIndex) => botIndex === targetLevel).length;
}

function getAverageStrengthByIndexes(indexes, playerStrength = null) {
  const botStrength = indexes.reduce((sum, botIndex) => sum + botLevels[botIndex].strength, 0);
  const totalStrength = botStrength + (Number.isFinite(playerStrength) ? playerStrength : 0);
  const memberCount = indexes.length + (Number.isFinite(playerStrength) ? 1 : 0);
  return memberCount ? totalStrength / memberCount : 0;
}

function getRandomEnemyStrengthMultiplier() {
  return (
    ENEMY_STRENGTH_MULTIPLIER_MIN +
    Math.random() * (ENEMY_STRENGTH_MULTIPLIER_MAX - ENEMY_STRENGTH_MULTIPLIER_MIN)
  );
}

function chooseBalancedCandidate(candidates, targetLevel, preferredMultiplier) {
  const canUseLowerBot = targetLevel > 0;
  let pool = candidates.filter(
    (candidate) =>
      candidate.ratio >= ENEMY_STRENGTH_MULTIPLIER_MIN &&
      candidate.ratio <= ENEMY_STRENGTH_MULTIPLIER_MAX,
  );
  const lowerPlayerPool = pool.filter((candidate) => !canUseLowerBot || candidate.playerLowerCount > 0);

  if (lowerPlayerPool.length) {
    pool = lowerPlayerPool;
  } else if (!pool.length) {
    pool = candidates.filter((candidate) => !canUseLowerBot || candidate.playerLowerCount > 0);
  }

  if (!pool.length) {
    pool = candidates;
  }

  const scored = pool.map((candidate) => {
    const rangePenalty =
      candidate.ratio < ENEMY_STRENGTH_MULTIPLIER_MIN
        ? (ENEMY_STRENGTH_MULTIPLIER_MIN - candidate.ratio) * 4
        : candidate.ratio > ENEMY_STRENGTH_MULTIPLIER_MAX
          ? (candidate.ratio - ENEMY_STRENGTH_MULTIPLIER_MAX) * 4
          : 0;
    const ratioPenalty = Math.abs(candidate.ratio - preferredMultiplier);
    const diversityBonus = candidate.distinctLevelCount * 0.03;
    const playerLowerBonus = candidate.playerLowerCount * 0.035;
    const enemyAboveBonus = candidate.enemyAboveCount * 0.025;

    return {
      candidate,
      score: rangePenalty + ratioPenalty - diversityBonus - playerLowerBonus - enemyAboveBonus + Math.random() * 0.04,
    };
  });
  const bestScore = Math.min(...scored.map((item) => item.score));
  const bestCandidates = scored
    .filter((item) => item.score <= bestScore + 0.08)
    .map((item) => item.candidate);

  return pickRandom(bestCandidates);
}

function makeBalancedMatchTeams(targetLevel) {
  const allowedRange = getAllowedBotRange(targetLevel);
  const options = getAllowedBotOptions(allowedRange.minIndex, allowedRange.maxIndex);
  const playerStrength = getPlayerStrengthForTargetLevel(targetLevel);
  const preferredMultiplier = getRandomEnemyStrengthMultiplier();
  const candidates = [];
  const playerCombinations = buildBotIndexCombinations(options, 4);
  const enemyCombinations = buildBotIndexCombinations(options, 5);

  playerCombinations.forEach((playerIndexes) => {
    enemyCombinations.forEach((enemyIndexes) => {
      const totalTargetBots = countBotIndex(playerIndexes, targetLevel) + countBotIndex(enemyIndexes, targetLevel);
      if (totalTargetBots !== 4) return;

      const playerAverageStrength = getAverageStrengthByIndexes(playerIndexes, playerStrength);
      const enemyAverageStrength = getAverageStrengthByIndexes(enemyIndexes);
      const ratio = playerAverageStrength ? enemyAverageStrength / playerAverageStrength : 0;
      const allIndexes = [...playerIndexes, ...enemyIndexes];

      candidates.push({
        playerIndexes,
        enemyIndexes,
        ratio,
        playerLowerCount: playerIndexes.filter((botIndex) => botIndex < targetLevel).length,
        enemyAboveCount: enemyIndexes.filter((botIndex) => botIndex > targetLevel).length,
        distinctLevelCount: new Set(allIndexes).size,
      });
    });
  });

  if (!candidates.length) {
    return {
      playerBots: makeTeam(targetLevel, 4),
      enemyBots: makeTeam(targetLevel, 5),
    };
  }

  const chosenCandidate = chooseBalancedCandidate(candidates, targetLevel, preferredMultiplier);

  return {
    playerBots: makeTeamFromIndexes(chosenCandidate.playerIndexes),
    enemyBots: makeTeamFromIndexes(chosenCandidate.enemyIndexes),
  };
}

function pickWeighted(weights) {
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * total;

  for (const item of weights) {
    cursor -= item.weight;
    if (cursor <= 0) return item.botIndex;
  }

  return weights[weights.length - 1].botIndex;
}

function getTotalStrength(bots, playerStrength = null) {
  const botStrength = bots.reduce((sum, bot) => sum + getBotLevel(bot.level).strength, 0);
  return botStrength + (Number.isFinite(playerStrength) ? playerStrength : 0);
}

function getAverageStrength(bots, playerStrength = null) {
  const memberCount = bots.length + (Number.isFinite(playerStrength) ? 1 : 0);
  if (!memberCount) return 0;
  return getTotalStrength(bots, playerStrength) / memberCount;
}

function shuffleTeam(team) {
  const shuffled = [...team];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }

  return shuffled.map((bot, index) => ({ ...bot, slot: index + 1 }));
}

function getPlayedMapCounts() {
  const counts = new Map(maps.map((map) => [map, 0]));

  state.matches.forEach((match) => {
    if (match.status !== "completed" || !counts.has(match.map)) return;
    counts.set(match.map, counts.get(match.map) + 1);
  });

  return counts;
}

function pickLeastPlayedMap() {
  const counts = getPlayedMapCounts();
  const lowestCount = Math.min(...counts.values());
  const leastPlayedMaps = maps.filter((map) => counts.get(map) === lowestCount);
  return pickRandom(leastPlayedMaps);
}

function generateMatch() {
  const summary = calculateSummary();
  const playerSide = pickRandom(["CT", "TR"]);
  const enemySide = playerSide === "CT" ? "TR" : "CT";
  const targetLevel = getBotTargetLevel(summary.rating);
  const teams = makeBalancedMatchTeams(targetLevel);
  const playerStrength = getPlayerStrengthForTargetLevel(targetLevel);

  const match = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    map: pickLeastPlayedMap(),
    playerSide,
    enemySide,
    ratingAtGeneration: summary.rating,
    playerStrength,
    playerBots: teams.playerBots,
    enemyBots: teams.enemyBots,
    status: "pending",
    result: null,
    teamRounds: null,
    enemyRounds: null,
    frags: null,
    deaths: null,
  };

  state.matches.unshift(match);
  saveState();
  render();
  openMatch(match.id);
}

function saveBaseRating() {
  const nextRating = clamp(parseInt(elements.baseRatingInput.value, 10) || 0, 0, 50000);
  state.baseRating = nextRating;
  saveState();
  render();
}

function resetData() {
  const confirmed = window.confirm("This will delete all history and reset the starting rating to 0. Continue?");
  if (!confirmed) return;

  state = getDefaultState();
  selectedMatchId = null;
  selectedExpMatchId = null;
  selectedExpPlayerId = null;
  selectedCompetitiveMatchId = null;
  selectedCompetitiveTeamIds = [];
  saveState();
  render();
  closeDialog();
  closeExpSetup();
  closeExpMatch();
  closeExpPlayerDetail();
  closeCompetitiveMatch();
}

function calculateMatchDelta(match, winStreakBefore = 0) {
  const frags = Number(match.frags) || 0;
  const deaths = Number(match.deaths) || 0;
  const teamRounds = Number(match.teamRounds) || 0;
  const enemyRounds = Number(match.enemyRounds) || 0;
  const roundMargin = teamRounds - enemyRounds;
  const kdBalance = frags - deaths;

  const fragScore = clamp(frags / 32, 0, 1);
  const kdScore = clamp((kdBalance + 10) / 24, 0, 1);
  const roundScore =
    match.result === "win"
      ? clamp(roundMargin / 13, 0, 1)
      : clamp(1 - Math.abs(roundMargin) / 13, 0, 1);
  const performance = fragScore * 0.42 + kdScore * 0.42 + roundScore * 0.16;

  if (match.result === "draw") {
    return {
      delta: 0,
      streakBonus: 0,
      performance,
      nextStreak: 0,
    };
  }

  if (match.result === "win") {
    const nextStreak = winStreakBefore + 1;
    const streakBonus = getStreakBonus(nextStreak);
    return {
      delta: 200 + Math.round(performance * 200) + streakBonus,
      streakBonus,
      performance,
      nextStreak,
    };
  }

  const penaltyPerformance = 1 - performance;
  return {
    delta: -(200 + Math.round(penaltyPerformance * 200)),
    streakBonus: 0,
    performance,
    nextStreak: 0,
  };
}

function getStreakBonus(streak) {
  if (streak <= 1) return 0;
  return Math.min((streak - 1) * 50, 200);
}

function calculateSummary() {
  let rating = state.baseRating;
  let streak = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  const byId = new Map();

  getChronologicalMatches().forEach((match) => {
    if (match.status !== "completed") {
      byId.set(match.id, {
        ratingBefore: rating,
        ratingAfter: rating,
        delta: null,
        streakBonus: 0,
        streakBefore: streak,
        streakAfter: streak,
      });
      return;
    }

    const result = calculateMatchDelta(match, streak);
    const ratingBefore = rating;
    rating = Math.max(0, rating + result.delta);

    if (match.result === "win") {
      wins += 1;
      streak = result.nextStreak;
    } else if (match.result === "loss") {
      losses += 1;
      streak = 0;
    } else {
      draws += 1;
      streak = 0;
    }

    byId.set(match.id, {
      ratingBefore,
      ratingAfter: rating,
      delta: result.delta,
      streakBonus: result.streakBonus,
      streakBefore: match.result === "win" ? result.nextStreak - 1 : 0,
      streakAfter: streak,
    });
  });

  return { rating, streak, wins, draws, losses, matchMeta: byId };
}

function getChronologicalMatches() {
  return [...state.matches].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function render() {
  const summary = calculateSummary();
  renderRank(summary);
  renderMapsTable();
  renderTable(summary);
  renderEsports();
  renderCompetitive();
  renderExp();
  elements.baseRatingInput.value = state.baseRating;
}

function renderRank(summary) {
  const rank = getRank(summary.rating);
  const nextRank = ranks.find((item) => item.min > rank.min);
  const range = Number.isFinite(rank.max) ? rank.max - rank.min : 1;
  const progress = Number.isFinite(rank.max)
    ? clamp(((summary.rating - rank.min) / range) * 100, 0, 100)
    : 100;
  const total = summary.wins + summary.draws + summary.losses;
  const winRate = total ? Math.round((summary.wins / total) * 100) : 0;

  elements.currentRating.textContent = formatNumber(summary.rating);
  elements.rankBadge.textContent = rank.name;
  elements.rankBadge.style.color = rank.color;
  elements.rankProgressBar.style.width = `${progress}%`;
  elements.rankProgressBar.parentElement.style.color = rank.color;
  elements.rankNextText.textContent = nextRank
    ? `Next rank: ${formatNumber(rank.max)}`
    : "You are at the top: GOLD 30,000+";
  elements.currentStreak.textContent = summary.streak;
  elements.recordText.textContent = `${summary.wins} / ${summary.draws} / ${summary.losses}`;
  elements.winRateText.textContent = `${winRate}% win rate`;
}

function renderTable(summary) {
  elements.matchesTableBody.innerHTML = "";
  elements.emptyState.style.display = state.matches.length ? "none" : "block";

  state.matches.forEach((match) => {
    const meta = summary.matchMeta.get(match.id);
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.addEventListener("click", () => openMatch(match.id));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMatch(match.id);
      }
    });

    row.innerHTML = `
      <td>${formatDate(match.createdAt)}</td>
      <td class="map-cell">${escapeHtml(match.map)}</td>
      <td><span class="side-pill">${match.playerSide}</span></td>
      <td class="score-cell">${formatScore(match)}</td>
      <td>${formatResult(match)}</td>
      <td>${formatDelta(meta?.delta)}</td>
      <td>${match.playerBots.length + match.enemyBots.length} bots</td>
      <td>${formatStatus(match)}</td>
    `;

    elements.matchesTableBody.appendChild(row);
  });
}

function renderMapsTable() {
  elements.mapsTableBody.innerHTML = "";
  const counts = getPlayedMapCounts();

  maps.forEach((map, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="map-cell">${escapeHtml(map)}</td>
      <td class="map-play-count">${counts.get(map)}</td>
    `;
    elements.mapsTableBody.appendChild(row);
  });
}

function renderExp() {
  renderExpMapsTable();
  renderExpMatchesTable();
  renderExpRanking();

  if (selectedExpMatchId && elements.expMatchDialog.open) {
    const match = getSelectedExpMatch();
    if (match) renderExpMatchDialog(match);
  }

  if (selectedExpPlayerId && elements.expPlayerDetailDialog.open) {
    renderExpPlayerDetail();
  }

  switchExpTab(activeExpTab);
}

function renderExpMapsTable() {
  elements.expMapsTableBody.innerHTML = "";
  const counts = getExpMapCounts();

  maps.forEach((map, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="map-cell">${escapeHtml(map)}</td>
      <td class="map-play-count">${counts.get(map)}</td>
    `;
    elements.expMapsTableBody.appendChild(row);
  });
}

function renderExpMatchesTable() {
  elements.expMatchesTableBody.innerHTML = "";
  elements.expEmptyState.style.display = state.exp.matches.length ? "none" : "block";

  state.exp.matches.forEach((match) => {
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.dataset.expMatch = match.id;
    row.innerHTML = `
      <td>${formatDate(match.createdAt)}</td>
      <td class="map-cell">${escapeHtml(match.map)}</td>
      <td class="team-cell">${escapeHtml(formatExpTeamNames(match.teamAIds, getExpGoatId(match)))}</td>
      <td class="score-cell">${formatExpScore(match)}</td>
      <td class="team-cell">${escapeHtml(formatExpTeamNames(match.teamBIds, getExpGoatId(match)))}</td>
      <td>${formatExpResult(match)}</td>
      <td>${formatStatus(match)}</td>
    `;
    elements.expMatchesTableBody.appendChild(row);
  });
}

function renderExpRanking() {
  elements.expRankingList.innerHTML = "";
  elements.expRankingEmptyState.style.display = "none";

  getRankedExpPlayerStats().forEach((entry, index) => {
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.dataset.expPlayerDetail = entry.player.id;
    row.innerHTML = `
      <td class="standing-position">#${index + 1}</td>
      <td>
        <div class="exp-ranking-player">
          ${getExpPlayerPhotoMarkup(entry.player)}
          <strong>${escapeHtml(entry.player.name)}</strong>
        </div>
      </td>
      <td class="stat-number">${entry.wins}</td>
      <td class="stat-number">${entry.winRate}%</td>
      <td class="stat-number">${entry.kills}</td>
      <td class="stat-number">${formatKda(entry.kda)}</td>
      <td class="stat-number">${entry.score}</td>
      <td class="stat-number">${entry.mvp}</td>
      <td class="stat-number">${entry.goats}</td>
    `;
    elements.expRankingList.appendChild(row);
  });
}

function getExpMapCounts() {
  const counts = new Map(maps.map((map) => [map, 0]));

  state.exp.matches.forEach((match) => {
    if (!counts.has(match.map)) return;
    counts.set(match.map, counts.get(match.map) + 1);
  });

  return counts;
}

function pickLeastPlayedExpMap() {
  const counts = getExpMapCounts();
  const lowestCount = Math.min(...counts.values());
  const leastPlayedMaps = maps.filter((map) => counts.get(map) === lowestCount);
  return pickRandom(leastPlayedMaps);
}

function openExpSetup() {
  renderExpPlayerSelector();

  if (!elements.expSetupDialog.open) {
    elements.expSetupDialog.showModal();
  }
}

function closeExpSetup() {
  if (elements.expSetupDialog.open) {
    elements.expSetupDialog.close();
  }
}

function renderExpPlayerSelector() {
  elements.expPlayerSelector.innerHTML = "";

  expPlayers.forEach((player) => {
    const label = document.createElement("label");
    label.className = "exp-player-switch active";
    label.innerHTML = `
      <input type="checkbox" data-exp-player="${escapeHtml(player.id)}" checked />
      <span class="toggle-rail" aria-hidden="true"><span></span></span>
      <strong>${escapeHtml(player.name)}</strong>
      <em>ON</em>
    `;
    elements.expPlayerSelector.appendChild(label);
  });
}

function handleExpPlayerSelectorChange(event) {
  const checkbox = event.target.closest("[data-exp-player]");
  if (!checkbox) return;

  const label = checkbox.closest(".exp-player-switch");
  if (!label) return;

  label.classList.toggle("active", checkbox.checked);
  const stateLabel = label.querySelector("em");
  if (stateLabel) {
    stateLabel.textContent = checkbox.checked ? "ON" : "OFF";
  }
}

function generateExpMatchFromSetup() {
  const selectedPlayerIds = [...elements.expPlayerSelector.querySelectorAll("[data-exp-player]")]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.expPlayer);

  if (selectedPlayerIds.length < 2) {
    window.alert("Select at least 2 players to generate the RANKED match.");
    return;
  }

  const { teamAIds, teamBIds } = buildVariedExpTeams(selectedPlayerIds);
  const match = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    map: pickLeastPlayedExpMap(),
    teamAIds,
    teamBIds,
    status: "pending",
    result: null,
    teamARounds: null,
    teamBRounds: null,
    playerStats: makeEmptyExpStats([...teamAIds, ...teamBIds]),
  };

  state.exp.matches.unshift(match);
  saveState();
  closeExpSetup();
  renderExp();
  openExpMatch(match.id);
}

function buildVariedExpTeams(playerIds) {
  const candidates = getExpTeamSplitCandidates(playerIds);
  const history = getExpTeamVarietyHistory(playerIds);
  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      score: scoreExpTeamSplit(candidate, history) + Math.random() * 0.25,
    }))
    .sort((first, second) => first.score - second.score);
  const poolSize = Math.min(scoredCandidates.length, Math.max(2, Math.ceil(scoredCandidates.length * 0.25)));
  const chosen = pickRandom(scoredCandidates.slice(0, poolSize)).candidate;

  if (Math.random() < 0.5) {
    return {
      teamAIds: chosen.teamBIds,
      teamBIds: chosen.teamAIds,
    };
  }

  return chosen;
}

function getExpTeamSplitCandidates(playerIds) {
  const teamSize = Math.ceil(playerIds.length / 2);
  const combinations = getCombinations(playerIds, teamSize);
  const seenSplits = new Set();

  return combinations
    .map((teamAIds) => {
      const teamASet = new Set(teamAIds);
      return {
        teamAIds,
        teamBIds: playerIds.filter((playerId) => !teamASet.has(playerId)),
      };
    })
    .filter((candidate) => {
      const key = getExpTeamSplitKey(candidate.teamAIds, candidate.teamBIds);
      if (seenSplits.has(key)) return false;
      seenSplits.add(key);
      return true;
    });
}

function getExpTeamVarietyHistory(playerIds) {
  const selectedIds = new Set(playerIds);
  const history = {
    pairs: new Map(),
    recentPairs: new Map(),
    trios: new Map(),
    exactTeams: new Map(),
    recentExactTeams: new Map(),
  };

  state.exp.matches.forEach((match, matchIndex) => {
    const recentWeight = Math.max(0, 8 - matchIndex);
    [match.teamAIds, match.teamBIds].forEach((teamIds) => {
      const comparableTeamIds = teamIds.filter((playerId) => selectedIds.has(playerId));
      if (comparableTeamIds.length < 2) return;

      incrementExpCombinationCounts(history.pairs, comparableTeamIds, 2, 1);
      incrementExpCombinationCounts(history.trios, comparableTeamIds, 3, 1);
      incrementExpCount(history.exactTeams, normalizeExpTeamKey(comparableTeamIds), 1);

      if (recentWeight > 0) {
        incrementExpCombinationCounts(history.recentPairs, comparableTeamIds, 2, recentWeight);
        incrementExpCount(history.recentExactTeams, normalizeExpTeamKey(comparableTeamIds), recentWeight);
      }
    });
  });

  return history;
}

function scoreExpTeamSplit(candidate, history) {
  return scoreExpTeam(candidate.teamAIds, history) + scoreExpTeam(candidate.teamBIds, history);
}

function scoreExpTeam(teamIds, history) {
  const pairScore = sumExpCombinationCounts(history.pairs, teamIds, 2) * 12;
  const recentPairScore = sumExpCombinationCounts(history.recentPairs, teamIds, 2) * 3;
  const trioScore = sumExpCombinationCounts(history.trios, teamIds, 3) * 18;
  const exactTeamScore = (history.exactTeams.get(normalizeExpTeamKey(teamIds)) ?? 0) * 28;
  const recentExactScore = (history.recentExactTeams.get(normalizeExpTeamKey(teamIds)) ?? 0) * 5;

  return pairScore + recentPairScore + trioScore + exactTeamScore + recentExactScore;
}

function incrementExpCombinationCounts(counts, ids, size, amount) {
  getCombinations(ids, size).forEach((combination) => {
    incrementExpCount(counts, normalizeExpTeamKey(combination), amount);
  });
}

function sumExpCombinationCounts(counts, ids, size) {
  return getCombinations(ids, size).reduce(
    (total, combination) => total + (counts.get(normalizeExpTeamKey(combination)) ?? 0),
    0,
  );
}

function getExpTeamSplitKey(teamAIds, teamBIds) {
  return [normalizeExpTeamKey(teamAIds), normalizeExpTeamKey(teamBIds)].sort().join("|");
}

function normalizeExpTeamKey(ids) {
  return [...ids].sort().join("+");
}

function incrementExpCount(counts, key, amount) {
  counts.set(key, (counts.get(key) ?? 0) + amount);
}

function getCombinations(ids, size) {
  if (size <= 0) return [[]];
  if (ids.length < size) return [];

  const combinations = [];
  const walk = (startIndex, combination) => {
    if (combination.length === size) {
      combinations.push([...combination]);
      return;
    }

    for (let index = startIndex; index <= ids.length - (size - combination.length); index += 1) {
      combination.push(ids[index]);
      walk(index + 1, combination);
      combination.pop();
    }
  };

  walk(0, []);
  return combinations;
}

function makeEmptyExpStats(playerIds) {
  const stats = {};
  playerIds.forEach((playerId) => {
    stats[playerId] = {
      kills: 0,
      deaths: 0,
      assists: 0,
      mvp: 0,
      score: 0,
    };
  });
  return stats;
}

function handleExpMatchesTableClick(event) {
  const row = event.target.closest("[data-exp-match]");
  if (!row) return;
  openExpMatch(row.dataset.expMatch);
}

function handleExpMatchesTableKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const row = event.target.closest("[data-exp-match]");
  if (!row) return;

  event.preventDefault();
  openExpMatch(row.dataset.expMatch);
}

function openExpMatch(matchId) {
  const match = state.exp.matches.find((item) => item.id === matchId);
  if (!match) return;

  selectedExpMatchId = match.id;
  renderExpMatchDialog(match);

  if (!elements.expMatchDialog.open) {
    elements.expMatchDialog.showModal();
  }
}

function renderExpMatchDialog(match) {
  elements.expMatchTitle.textContent = match.map;
  elements.expTeamARoundsInput.value = match.teamARounds ?? "";
  elements.expTeamBRoundsInput.value = match.teamBRounds ?? "";
  renderExpStatsForm(match);
  updateExpResultPreview();
}

function renderExpStatsForm(match) {
  const goatId = getExpGoatId(match);
  renderExpTeamStats(elements.expTeamAList, match.teamAIds, match, goatId);
  renderExpTeamStats(elements.expTeamBList, match.teamBIds, match, goatId);
}

function renderExpTeamStats(container, playerIds, match, goatId) {
  container.innerHTML = `
    <div class="exp-team-stats-header">
      <span>Player</span>
      <span>K</span>
      <span>D</span>
      <span>A</span>
      <span>MVP</span>
      <span>Score</span>
      <span></span>
    </div>
  `;

  playerIds.forEach((playerId) => {
    const player = getExpPlayer(playerId);
    const stats = match.playerStats[playerId] ?? normalizeExpPlayerStats(null);
    const row = document.createElement("div");
    row.className = "exp-team-player-row";
    row.classList.toggle("goat-player", playerId === goatId);
    row.innerHTML = `
      <strong class="${playerId === goatId ? "goat-name" : ""}">
        ${escapeHtml(player?.name ?? "Removed player")}${playerId === goatId ? getGoatStarMarkup() : ""}
      </strong>
      ${getExpStatInputMarkup(playerId, "kills", stats.kills, match.status, 999)}
      ${getExpStatInputMarkup(playerId, "deaths", stats.deaths, match.status, 999)}
      ${getExpStatInputMarkup(playerId, "assists", stats.assists, match.status, 999)}
      ${getExpStatInputMarkup(playerId, "mvp", stats.mvp, match.status, 99)}
      ${getExpStatInputMarkup(playerId, "score", stats.score, match.status, 99999)}
      <button
        class="remove-exp-player-btn"
        type="button"
        data-remove-exp-player="${escapeHtml(playerId)}"
        aria-label="Remove ${escapeHtml(player?.name ?? "player")} from this match"
        title="Remove from this match"
      >x</button>
    `;
    container.appendChild(row);
  });
}

function getExpStatInputMarkup(playerId, stat, value, status, max) {
  const displayValue = status === "completed" || value > 0 ? value : "";
  return `
    <input
      type="number"
      min="0"
      max="${max}"
      step="1"
      value="${displayValue}"
      data-exp-stat-player="${escapeHtml(playerId)}"
      data-exp-stat="${stat}"
      aria-label="${stat}"
    />
  `;
}

function handleExpStatsGridClick(event) {
  const removeButton = event.target.closest("[data-remove-exp-player]");
  if (!removeButton) return;

  removePlayerFromSelectedExpMatch(removeButton.dataset.removeExpPlayer);
}

function removePlayerFromSelectedExpMatch(playerId) {
  const match = getSelectedExpMatch();
  if (!match) return;

  const teamKey = match.teamAIds.includes(playerId)
    ? "teamAIds"
    : match.teamBIds.includes(playerId)
      ? "teamBIds"
      : null;
  if (!teamKey) return;

  if (match[teamKey].length <= 1) {
    window.alert("Each team needs at least one player.");
    return;
  }

  syncExpMatchDraft(match);
  match[teamKey] = match[teamKey].filter((id) => id !== playerId);
  delete match.playerStats[playerId];

  if (match.status === "completed" && match.teamARounds !== null && match.teamBRounds !== null) {
    match.result = deriveExpResult(match.teamARounds, match.teamBRounds);
  }

  saveState();
  render();
}

function syncExpMatchDraft(match) {
  const teamARounds = parseInt(elements.expTeamARoundsInput.value, 10);
  const teamBRounds = parseInt(elements.expTeamBRoundsInput.value, 10);

  match.teamARounds = Number.isFinite(teamARounds) && teamARounds >= 0 && teamARounds <= 99 ? teamARounds : null;
  match.teamBRounds = Number.isFinite(teamBRounds) && teamBRounds >= 0 && teamBRounds <= 99 ? teamBRounds : null;

  [...match.teamAIds, ...match.teamBIds].forEach((playerId) => {
    const stats = match.playerStats[playerId] ?? normalizeExpPlayerStats(null);
    match.playerStats[playerId] = {
      kills: readExpDraftStatInput(playerId, "kills", 999, stats.kills),
      deaths: readExpDraftStatInput(playerId, "deaths", 999, stats.deaths),
      assists: readExpDraftStatInput(playerId, "assists", 999, stats.assists),
      mvp: readExpDraftStatInput(playerId, "mvp", 99, stats.mvp),
      score: readExpDraftStatInput(playerId, "score", 99999, stats.score),
    };
  });
}

function readExpDraftStatInput(playerId, stat, max, fallback) {
  const input = elements.expStatsGrid.querySelector(
    `[data-exp-stat-player="${playerId}"][data-exp-stat="${stat}"]`,
  );
  const value = parseInt(input?.value, 10);

  if (!input || !input.value.trim()) return 0;
  if (!Number.isFinite(value) || value < 0 || value > max) return fallback;
  return value;
}

function closeExpMatch() {
  selectedExpMatchId = null;
  if (elements.expMatchDialog.open) {
    elements.expMatchDialog.close();
  }
}

function saveExpMatchResult() {
  const match = getSelectedExpMatch();
  if (!match) return;

  const values = readExpMatchValues(match);
  if (!values) {
    window.alert("Fill rounds and individual stats with valid values.");
    return;
  }

  Object.assign(match, {
    status: "completed",
    result: deriveExpResult(values.teamARounds, values.teamBRounds),
    teamARounds: values.teamARounds,
    teamBRounds: values.teamBRounds,
    playerStats: values.playerStats,
  });

  saveState();
  render();
  closeExpMatch();
}

function markExpMatchPending() {
  const match = getSelectedExpMatch();
  if (!match) return;

  Object.assign(match, {
    status: "pending",
    result: null,
    teamARounds: null,
    teamBRounds: null,
    playerStats: makeEmptyExpStats([...match.teamAIds, ...match.teamBIds]),
  });

  saveState();
  render();
  openExpMatch(match.id);
}

function deleteSelectedExpMatch() {
  const match = getSelectedExpMatch();
  if (!match) return;

  const confirmed = window.confirm(`Delete the RANKED match on ${match.map.toUpperCase()}?`);
  if (!confirmed) return;

  state.exp.matches = state.exp.matches.filter((item) => item.id !== match.id);
  selectedExpMatchId = null;
  saveState();
  render();
  closeExpMatch();
}

function readExpMatchValues(match) {
  const teamARounds = parseInt(elements.expTeamARoundsInput.value, 10);
  const teamBRounds = parseInt(elements.expTeamBRoundsInput.value, 10);

  if (![teamARounds, teamBRounds].every((value) => Number.isFinite(value) && value >= 0 && value <= 99)) {
    return null;
  }

  const playerStats = {};
  const playerIds = [...match.teamAIds, ...match.teamBIds];

  for (const playerId of playerIds) {
    const stats = {
      kills: readExpStatInput(playerId, "kills", 999),
      deaths: readExpStatInput(playerId, "deaths", 999),
      assists: readExpStatInput(playerId, "assists", 999),
      mvp: readExpStatInput(playerId, "mvp", 99),
      score: readExpStatInput(playerId, "score", 99999),
    };

    if (Object.values(stats).some((value) => value === null)) return null;
    playerStats[playerId] = stats;
  }

  return { teamARounds, teamBRounds, playerStats };
}

function readExpStatInput(playerId, stat, max) {
  const input = elements.expStatsGrid.querySelector(
    `[data-exp-stat-player="${playerId}"][data-exp-stat="${stat}"]`,
  );
  const value = parseInt(input?.value, 10);

  if (!Number.isFinite(value) || value < 0 || value > max) return null;
  return value;
}

function updateExpResultPreview() {
  const teamARounds = parseInt(elements.expTeamARoundsInput.value, 10);
  const teamBRounds = parseInt(elements.expTeamBRoundsInput.value, 10);

  if (![teamARounds, teamBRounds].every((value) => Number.isFinite(value) && value >= 0 && value <= 99)) {
    elements.expResultPreview.textContent = "Fill the rounds to calculate the result.";
    return;
  }

  elements.expResultPreview.textContent = getExpResultLabel(deriveExpResult(teamARounds, teamBRounds));
}

function getSelectedExpMatch() {
  return state.exp.matches.find((item) => item.id === selectedExpMatchId);
}

function deriveExpResult(teamARounds, teamBRounds) {
  if (teamARounds === teamBRounds) return "draw";
  return teamARounds > teamBRounds ? "teamA" : "teamB";
}

function calculateExpPlayerStats(playerId) {
  const stats = {
    player: getExpPlayer(playerId),
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    mvp: 0,
    score: 0,
    goats: 0,
    winRate: 0,
    kda: 0,
  };

  state.exp.matches.forEach((match) => {
    if (match.status !== "completed") return;
    const isTeamA = match.teamAIds.includes(playerId);
    const isTeamB = match.teamBIds.includes(playerId);
    if (!isTeamA && !isTeamB) return;

    const playerStats = match.playerStats[playerId] ?? normalizeExpPlayerStats(null);
    stats.played += 1;
    stats.kills += playerStats.kills;
    stats.deaths += playerStats.deaths;
    stats.assists += playerStats.assists;
    stats.mvp += playerStats.mvp;
    stats.score += playerStats.score;

    if (match.result === "draw") {
      stats.draws += 1;
    } else if ((isTeamA && match.result === "teamA") || (isTeamB && match.result === "teamB")) {
      stats.wins += 1;
    } else {
      stats.losses += 1;
    }

    if (getExpGoatId(match) === playerId) {
      stats.goats += 1;
    }
  });

  const decisiveMatches = stats.wins + stats.losses;
  stats.winRate = decisiveMatches ? Math.round((stats.wins / decisiveMatches) * 100) : 0;
  stats.kda = calculateKda(stats.kills, stats.assists, stats.deaths);
  return stats;
}

function getRankedExpPlayerStats() {
  return expPlayers
    .map((player) => calculateExpPlayerStats(player.id))
    .sort((playerA, playerB) => {
      if (playerB.wins !== playerA.wins) return playerB.wins - playerA.wins;
      if (playerB.kda !== playerA.kda) return playerB.kda - playerA.kda;
      if (playerB.kills !== playerA.kills) return playerB.kills - playerA.kills;
      return expPlayers.findIndex((player) => player.id === playerA.player.id)
        - expPlayers.findIndex((player) => player.id === playerB.player.id);
    });
}

function calculateKda(kills, assists, deaths) {
  const impact = kills + assists;
  return deaths > 0 ? impact / deaths : impact;
}

function getExpGoatId(match) {
  if (!match || match.status !== "completed") return null;
  const playerIds = [...match.teamAIds, ...match.teamBIds];
  if (!playerIds.length) return null;

  let goatId = playerIds[0];
  let highestScore = -1;

  playerIds.forEach((playerId) => {
    const score = Number(match.playerStats?.[playerId]?.score) || 0;
    if (score > highestScore) {
      highestScore = score;
      goatId = playerId;
    }
  });

  return goatId;
}

function getGoatStarMarkup() {
  return '<span class="goat-star" title="GOAT" aria-label="GOAT">★</span>';
}

function handleExpRankingClick(event) {
  const card = event.target.closest("[data-exp-player-detail]");
  if (!card) return;
  openExpPlayerDetail(card.dataset.expPlayerDetail);
}

function handleExpRankingKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-exp-player-detail]");
  if (!card) return;

  event.preventDefault();
  openExpPlayerDetail(card.dataset.expPlayerDetail);
}

function openExpPlayerDetail(playerId) {
  if (!getExpPlayer(playerId)) return;

  selectedExpPlayerId = playerId;
  renderExpPlayerDetail();

  if (!elements.expPlayerDetailDialog.open) {
    elements.expPlayerDetailDialog.showModal();
  }
}

function renderExpPlayerDetail() {
  const stats = calculateExpPlayerStats(selectedExpPlayerId);
  if (!stats.player) return;

  elements.expPlayerDetailName.textContent = stats.player.name;
  renderExpPlayerPhoto(stats.player);
  elements.expPlayerDetailStats.innerHTML = `
    ${getExpDetailSectionMarkup([
      ["Matches played", stats.played],
      ["Matches won", stats.wins],
      ["Drawn matches", stats.draws],
      ["Lost matches", stats.losses],
      ["Win rate", `${stats.winRate}%`],
    ])}
    ${getExpDetailSectionMarkup([
      ["Kills", stats.kills],
      ["Deaths", stats.deaths],
      ["Assists", stats.assists],
      ["KDA", formatKda(stats.kda)],
    ])}
    ${getExpDetailSectionMarkup([
      ["Score", stats.score],
      ["MVP", stats.mvp],
      ["GOATs", stats.goats],
    ])}
  `;
  renderExpPlayerHistory(selectedExpPlayerId);
}

function getExpDetailSectionMarkup(items) {
  return `
    <div class="exp-detail-section" style="--stat-count: ${items.length}">
      ${items.map(([label, value]) => getExpDetailStatMarkup(label, value)).join("")}
    </div>
  `;
}

function getExpDetailStatMarkup(label, value) {
  return `
    <article class="stat-panel exp-detail-stat">
      <p class="panel-label">${escapeHtml(label)}</p>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function renderExpPlayerHistory(playerId) {
  const history = getExpPlayerMatchHistory(playerId);
  elements.expPlayerHistoryBody.innerHTML = "";
  elements.expPlayerHistoryEmpty.style.display = history.length ? "none" : "block";

  history.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="map-cell">${escapeHtml(entry.map)}</td>
      <td class="score-cell">${entry.teamRounds}x${entry.enemyRounds}</td>
      <td class="stat-number">${entry.kills}</td>
      <td class="stat-number">${entry.assists}</td>
      <td class="stat-number">${entry.deaths}</td>
      <td class="stat-number">${formatKda(entry.kda)}</td>
      <td class="stat-number">${entry.score}</td>
      <td class="stat-number">${entry.mvp}</td>
      <td>${formatExpHistoryStatus(entry.status)}</td>
    `;
    elements.expPlayerHistoryBody.appendChild(row);
  });
}

function getExpPlayerMatchHistory(playerId) {
  return state.exp.matches
    .filter((match) => {
      if (match.status !== "completed") return false;
      return match.teamAIds.includes(playerId) || match.teamBIds.includes(playerId);
    })
    .sort((matchA, matchB) => new Date(matchB.createdAt) - new Date(matchA.createdAt))
    .map((match) => {
      const isTeamA = match.teamAIds.includes(playerId);
      const stats = match.playerStats[playerId] ?? normalizeExpPlayerStats(null);
      const status = getExpPlayerMatchStatus(match, isTeamA);

      return {
        map: match.map,
        teamRounds: isTeamA ? match.teamARounds : match.teamBRounds,
        enemyRounds: isTeamA ? match.teamBRounds : match.teamARounds,
        kills: stats.kills,
        assists: stats.assists,
        deaths: stats.deaths,
        kda: calculateKda(stats.kills, stats.assists, stats.deaths),
        score: stats.score,
        mvp: stats.mvp,
        status,
      };
    });
}

function getExpPlayerMatchStatus(match, isTeamA) {
  if (match.result === "draw") return "draw";
  if ((isTeamA && match.result === "teamA") || (!isTeamA && match.result === "teamB")) return "win";
  return "loss";
}

function formatExpHistoryStatus(status) {
  if (status === "win") return '<span class="history-status win">WIN</span>';
  if (status === "loss") return '<span class="history-status loss">LOSS</span>';
  return '<span class="history-status draw">DRAW</span>';
}

function closeExpPlayerDetail() {
  selectedExpPlayerId = null;
  if (elements.expPlayerDetailDialog.open) {
    elements.expPlayerDetailDialog.close();
  }
}

function renderExpPlayerPhoto(player) {
  const image = getExpPlayerImage(player.id);
  elements.removeExpPlayerPhotoBtn.hidden = !image;

  if (image) {
    elements.expPlayerPhotoPreview.innerHTML = `<img src="${escapeHtml(image)}" alt="${escapeHtml(player.name)}" />`;
    return;
  }

  elements.expPlayerPhotoPreview.innerHTML = `<span>${escapeHtml(getInitials(player.name))}</span>`;
}

function getExpPlayerPhotoMarkup(player) {
  const image = getExpPlayerImage(player.id);

  if (image) {
    return `
      <div class="club-logo">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(player.name)}" />
      </div>
    `;
  }

  return `<div class="club-logo">${escapeHtml(getInitials(player.name))}</div>`;
}

function handleExpPlayerPhotoChange(event) {
  const [file] = event.target.files;
  if (!file || !selectedExpPlayerId) return;

  readImageFile(file, (image) => {
    state.exp.playerImages[selectedExpPlayerId] = image;
    elements.expPlayerPhotoInput.value = "";
    saveState();
    renderExp();
  }, elements.expPlayerPhotoInput);
}

function removeExpPlayerPhoto() {
  if (!selectedExpPlayerId) return;

  delete state.exp.playerImages[selectedExpPlayerId];
  elements.expPlayerPhotoInput.value = "";
  saveState();
  renderExp();
}

function getExpPlayer(playerId) {
  return expPlayers.find((player) => player.id === playerId) ?? null;
}

function getExpPlayerImage(playerId) {
  return state.exp.playerImages[playerId] ?? null;
}

function formatExpTeamNames(playerIds) {
  return playerIds
    .map((playerId) => getExpPlayer(playerId)?.name ?? "Removed player")
    .join(", ");
}

function formatExpScore(match) {
  if (match.status !== "completed") return "-";
  return `${match.teamARounds}x${match.teamBRounds}`;
}

function formatExpResult(match) {
  if (match.status !== "completed") return "-";
  return getExpResultLabel(match.result);
}

function getExpResultLabel(result) {
  if (result === "teamA") return "Team A win";
  if (result === "teamB") return "Team B win";
  return "Draw";
}

function formatKda(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function renderEsports() {
  renderPlayerTeamOptions();
  renderTeamLogoPreview();
  renderPlayerImagePreview();
  renderTeams();
  renderPlayers();
  if (selectedTeamDetailId && elements.teamDetailDialog.open) {
    renderTeamDetail();
  }
  switchEsportsTab(activeEsportsTab);
}

function renderPlayerTeamOptions() {
  const selectedTeamId = elements.playerTeamSelect.value;
  const options = ['<option value="">No team</option>'];

  getRankedTeams().forEach((team) => {
    options.push(`<option value="${escapeHtml(team.id)}">${escapeHtml(team.name)}</option>`);
  });

  elements.playerTeamSelect.innerHTML = options.join("");
  elements.playerTeamSelect.value = state.esports.teams.some((team) => team.id === selectedTeamId)
    ? selectedTeamId
    : "";
}

function renderTeams() {
  elements.teamsList.innerHTML = "";
  elements.teamsEmptyState.style.display = state.esports.teams.length ? "none" : "block";

  getRankedTeams().forEach((team, index) => {
    const players = getTeamPlayers(team.id);
    const overall = getTeamOverall(team.id);
    const card = document.createElement("article");
    card.className = "club-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.teamCard = team.id;
    card.innerHTML = `
      ${getLogoMarkup(team)}
      <div class="club-card-main">
        <strong>#${index + 1} ${escapeHtml(team.name)}</strong>
        <span>${players.length} players</span>
      </div>
      <span class="overall-badge">${overall === null ? "OVR -" : `OVR ${overall}`}</span>
      <div class="item-actions">
        <button class="secondary-action" type="button" data-edit-team="${escapeHtml(team.id)}">Edit</button>
        <button class="danger-action" type="button" data-delete-team="${escapeHtml(team.id)}">Delete</button>
      </div>
    `;
    elements.teamsList.appendChild(card);
  });
}

function renderPlayers() {
  elements.playersList.innerHTML = "";
  elements.playersEmptyState.style.display = state.esports.players.length ? "none" : "block";

  getRankedPlayers().forEach((player, index) => {
    const team = getTeam(player.teamId);
    const card = document.createElement("article");
    card.className = "player-card";
    card.innerHTML = `
      ${getPlayerImageMarkup(player)}
      <div class="player-card-main">
        <strong>#${index + 1} ${escapeHtml(player.name)}</strong>
        <span>${escapeHtml(player.nationality || "-")} | ${escapeHtml(team?.name ?? "No team")}</span>
      </div>
      <span class="overall-badge">OVR ${player.overall}</span>
      <div class="item-actions">
        <button class="secondary-action" type="button" data-edit-player="${escapeHtml(player.id)}">Edit</button>
        <button class="danger-action" type="button" data-delete-player="${escapeHtml(player.id)}">Delete</button>
      </div>
    `;
    elements.playersList.appendChild(card);
  });
}

function getRankedTeams() {
  return [...state.esports.teams].sort((teamA, teamB) => {
    const overallA = getTeamOverall(teamA.id) ?? -1;
    const overallB = getTeamOverall(teamB.id) ?? -1;
    if (overallB !== overallA) return overallB - overallA;
    return teamA.name.localeCompare(teamB.name, "en-US");
  });
}

function getRankedPlayers(players = state.esports.players) {
  return [...players].sort((playerA, playerB) => {
    if (playerB.overall !== playerA.overall) return playerB.overall - playerA.overall;
    return playerA.name.localeCompare(playerB.name, "en-US");
  });
}

function getLogoMarkup(team) {
  if (team.logo) {
    return `
      <div class="club-logo">
        <img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.name)}" />
      </div>
    `;
  }

  return `<div class="club-logo">${escapeHtml(getInitials(team.name))}</div>`;
}

function getPlayerImageMarkup(player) {
  if (player.image) {
    return `
      <div class="club-logo">
        <img src="${escapeHtml(player.image)}" alt="${escapeHtml(player.nationality || player.name)}" />
      </div>
    `;
  }

  return `<div class="club-logo">${escapeHtml(getInitials(player.nationality || player.name))}</div>`;
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function renderTeamLogoPreview() {
  if (teamLogoDraft) {
    elements.teamLogoPreview.innerHTML = `<img src="${escapeHtml(teamLogoDraft)}" alt="Logo" />`;
    return;
  }

  elements.teamLogoPreview.textContent = "LOGO";
}

function handleTeamLogoChange(event) {
  const [file] = event.target.files;
  if (!file) return;

  readImageFile(file, (image) => {
    teamLogoDraft = image;
    renderTeamLogoPreview();
  }, elements.teamLogoInput);
}

function clearTeamLogo() {
  teamLogoDraft = null;
  elements.teamLogoInput.value = "";
  renderTeamLogoPreview();
}

function saveTeam() {
  const name = elements.teamNameInput.value.trim();
  if (!name) {
    window.alert("Fill the team name.");
    return;
  }

  if (editingTeamId) {
    const team = getTeam(editingTeamId);
    if (team) {
      team.name = name;
      team.logo = teamLogoDraft;
    }
  } else {
    state.esports.teams.push({
      id: makeId(),
      name,
      logo: teamLogoDraft,
    });
  }

  saveState();
  resetTeamForm();
  renderEsports();
}

function editTeam(teamId) {
  const team = getTeam(teamId);
  if (!team) return;

  editingTeamId = team.id;
  teamLogoDraft = team.logo;
  elements.teamFormTitle.textContent = "Edit team";
  elements.teamNameInput.value = team.name;
  elements.cancelTeamEditBtn.hidden = false;
  elements.saveTeamBtn.textContent = "Save changes";
  elements.teamLogoInput.value = "";
  renderTeamLogoPreview();
}

function deleteTeam(teamId) {
  const team = getTeam(teamId);
  if (!team) return;

  const confirmed = window.confirm(`Delete team ${team.name}?`);
  if (!confirmed) return;

  state.esports.teams = state.esports.teams.filter((item) => item.id !== teamId);
  state.esports.players.forEach((player) => {
    if (player.teamId === teamId) {
      player.teamId = null;
    }
  });

  if (editingTeamId === teamId) {
    resetTeamForm();
  }

  saveState();
  renderEsports();
}

function resetTeamForm() {
  editingTeamId = null;
  teamLogoDraft = null;
  elements.teamFormTitle.textContent = "New team";
  elements.teamNameInput.value = "";
  elements.teamLogoInput.value = "";
  elements.cancelTeamEditBtn.hidden = true;
  elements.saveTeamBtn.textContent = "Save team";
  renderTeamLogoPreview();
}

function handleTeamsListClick(event) {
  const editButton = event.target.closest("[data-edit-team]");
  const deleteButton = event.target.closest("[data-delete-team]");
  const teamCard = event.target.closest("[data-team-card]");

  if (editButton) {
    editTeam(editButton.dataset.editTeam);
    return;
  }

  if (deleteButton) {
    deleteTeam(deleteButton.dataset.deleteTeam);
    return;
  }

  if (teamCard) {
    openTeamDetail(teamCard.dataset.teamCard);
  }
}

function handleTeamsListKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const teamCard = event.target.closest("[data-team-card]");
  if (!teamCard) return;

  event.preventDefault();
  openTeamDetail(teamCard.dataset.teamCard);
}

function openTeamDetail(teamId) {
  const team = getTeam(teamId);
  if (!team) return;

  selectedTeamDetailId = teamId;
  renderTeamDetail();

  if (!elements.teamDetailDialog.open) {
    elements.teamDetailDialog.showModal();
  }
}

function renderTeamDetail() {
  const team = getTeam(selectedTeamDetailId);
  if (!team) return;

  const players = getRankedPlayers(getTeamPlayers(team.id));
  const overall = getTeamOverall(team.id);
  elements.teamDetailName.textContent = team.name;
  elements.teamDetailOverall.textContent = overall === null ? "OVR -" : `OVR ${overall}`;
  elements.teamDetailMeta.textContent = `${players.length} players`;
  elements.teamDetailLogo.innerHTML = team.logo
    ? `<img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.name)}" />`
    : escapeHtml(getInitials(team.name));
  elements.teamDetailPlayers.innerHTML = "";

  players.forEach((player, index) => {
    const card = document.createElement("article");
    card.className = "player-card";
    card.innerHTML = `
      ${getPlayerImageMarkup(player)}
      <div class="player-card-main">
        <strong>#${index + 1} ${escapeHtml(player.name)}</strong>
        <span>${escapeHtml(player.nationality || "-")}</span>
      </div>
      <span class="overall-badge">OVR ${player.overall}</span>
    `;
    elements.teamDetailPlayers.appendChild(card);
  });

  if (!players.length) {
    elements.teamDetailPlayers.innerHTML = `
      <div class="empty-state compact">
        <strong>No players on this team.</strong>
      </div>
    `;
  }
}

function closeTeamDetail() {
  selectedTeamDetailId = null;
  if (elements.teamDetailDialog.open) {
    elements.teamDetailDialog.close();
  }
}

function savePlayer() {
  const name = elements.playerNameInput.value.trim();
  const nationality = elements.playerNationalityInput.value.trim();
  const overall = parseInt(elements.playerOverallInput.value, 10);
  const teamId = elements.playerTeamSelect.value || null;

  if (!name) {
    window.alert("Fill the player name.");
    return;
  }

  if (!nationality) {
    window.alert("Fill the player nationality.");
    return;
  }

  if (!Number.isFinite(overall) || overall < 0 || overall > MAX_PLAYER_OVERALL) {
    window.alert(`Overall must be between 0 and ${MAX_PLAYER_OVERALL}.`);
    return;
  }

  if (editingPlayerId) {
    const player = getPlayer(editingPlayerId);
    if (player) {
      player.name = name;
      player.nationality = nationality;
      player.overall = overall;
      player.teamId = teamId;
      player.image = playerImageDraft;
    }
  } else {
    state.esports.players.push({
      id: makeId(),
      name,
      nationality,
      overall,
      teamId,
      image: playerImageDraft,
    });
  }

  saveState();
  resetPlayerForm();
  renderEsports();
}

function editPlayer(playerId) {
  const player = getPlayer(playerId);
  if (!player) return;

  editingPlayerId = player.id;
  elements.playerFormTitle.textContent = "Edit player";
  elements.playerNameInput.value = player.name;
  elements.playerNationalityInput.value = player.nationality;
  elements.playerOverallInput.value = player.overall;
  elements.playerTeamSelect.value = player.teamId ?? "";
  playerImageDraft = player.image;
  elements.playerImageInput.value = "";
  renderPlayerImagePreview();
  elements.cancelPlayerEditBtn.hidden = false;
  elements.savePlayerBtn.textContent = "Save changes";
}

function deletePlayer(playerId) {
  const player = getPlayer(playerId);
  if (!player) return;

  const confirmed = window.confirm(`Delete player ${player.name}?`);
  if (!confirmed) return;

  state.esports.players = state.esports.players.filter((item) => item.id !== playerId);

  if (editingPlayerId === playerId) {
    resetPlayerForm();
  }

  saveState();
  renderEsports();
}

function resetPlayerForm() {
  editingPlayerId = null;
  playerImageDraft = null;
  elements.playerFormTitle.textContent = "New player";
  elements.playerNameInput.value = "";
  elements.playerNationalityInput.value = "";
  elements.playerOverallInput.value = "";
  elements.playerTeamSelect.value = "";
  elements.playerImageInput.value = "";
  elements.cancelPlayerEditBtn.hidden = true;
  elements.savePlayerBtn.textContent = "Save player";
  renderPlayerImagePreview();
}

function handlePlayerImageChange(event) {
  const [file] = event.target.files;
  if (!file) return;

  readImageFile(file, (image) => {
    playerImageDraft = image;
    renderPlayerImagePreview();
  }, elements.playerImageInput);
}

function clearPlayerImage() {
  playerImageDraft = null;
  elements.playerImageInput.value = "";
  renderPlayerImagePreview();
}

function renderPlayerImagePreview() {
  if (playerImageDraft) {
    elements.playerImagePreview.innerHTML = `<img src="${escapeHtml(playerImageDraft)}" alt="Image" />`;
    return;
  }

  elements.playerImagePreview.textContent = "IMG";
}

function readImageFile(file, onLoad, inputElement) {
  if (!file.type.startsWith("image/")) {
    window.alert("Choose an image file.");
    inputElement.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const image = normalizeLogo(String(reader.result ?? ""));
    if (!image) {
      window.alert("I couldn't load this image.");
      inputElement.value = "";
      return;
    }
    onLoad(image);
  });
  reader.addEventListener("error", () => {
    window.alert("I couldn't load this image.");
    inputElement.value = "";
  });
  reader.readAsDataURL(file);
}

function handlePlayersListClick(event) {
  const editButton = event.target.closest("[data-edit-player]");
  const deleteButton = event.target.closest("[data-delete-player]");

  if (editButton) {
    editPlayer(editButton.dataset.editPlayer);
  }

  if (deleteButton) {
    deletePlayer(deleteButton.dataset.deletePlayer);
  }
}

function getTeam(teamId) {
  return state.esports.teams.find((team) => team.id === teamId) ?? null;
}

function getPlayer(playerId) {
  return state.esports.players.find((player) => player.id === playerId) ?? null;
}

function getTeamPlayers(teamId) {
  return state.esports.players.filter((player) => player.teamId === teamId);
}

function getTeamOverall(teamId) {
  const players = getTeamPlayers(teamId);
  if (!players.length) return null;
  const total = players.reduce((sum, player) => sum + player.overall, 0);
  return Math.round(total / players.length);
}

function renderCompetitive() {
  const tournament = state.competitive?.tournament ?? null;
  const setupOpen = !elements.competitiveSetupPanel.hidden;

  if (setupOpen) {
    renderCompetitiveSelection();
  }

  elements.competitiveBoard.hidden = !tournament;
  elements.competitiveEmptyState.style.display = tournament || setupOpen ? "none" : "block";
  elements.resetCompetitiveBtn.hidden = !tournament && !setupOpen;
  elements.createCompetitiveBtn.textContent = tournament ? "New cup" : "Create cup";

  if (!tournament) return;

  const standings = getTournamentStandings(tournament);
  elements.competitiveStatusTitle.textContent =
    tournament.status === "completed" ? "Cup completed" : "Active cup";
  renderCompetitiveStandings(standings);
  renderCompetitiveRounds(tournament);
}

function openCompetitiveSetup() {
  if (state.esports.teams.length < COMPETITIVE_TEAM_COUNT) {
    window.alert(`Register at least ${COMPETITIVE_TEAM_COUNT} teams to create a cup.`);
    return;
  }

  if (state.competitive.tournament) {
    const confirmed = window.confirm("Creating a new cup will replace the current cup. Continue?");
    if (!confirmed) return;
  }

  state.competitive.tournament = null;
  selectedCompetitiveTeamIds = getRankedTeams()
    .slice(0, COMPETITIVE_TEAM_COUNT)
    .map((team) => team.id);
  elements.competitiveSetupPanel.hidden = false;
  renderCompetitive();
}

function closeCompetitiveSetup() {
  selectedCompetitiveTeamIds = [];
  elements.competitiveSetupPanel.hidden = true;
  renderCompetitive();
}

function renderCompetitiveSelection() {
  elements.competitiveTeamsSelector.innerHTML = "";
  const teams = getRankedTeams();

  elements.competitiveSelectedCount.textContent =
    `${selectedCompetitiveTeamIds.length} / ${COMPETITIVE_TEAM_COUNT} selected`;
  elements.startCompetitiveBtn.disabled = selectedCompetitiveTeamIds.length !== COMPETITIVE_TEAM_COUNT;

  teams.forEach((team, index) => {
    const overall = getTeamOverall(team.id);
    const label = document.createElement("label");
    label.className = "selector-team";
    label.innerHTML = `
      <input type="checkbox" data-competitive-team="${escapeHtml(team.id)}" ${
        selectedCompetitiveTeamIds.includes(team.id) ? "checked" : ""
      } />
      ${getLogoMarkup(team)}
      <span>#${index + 1} ${escapeHtml(team.name)}</span>
      <strong>${overall === null ? "OVR -" : `OVR ${overall}`}</strong>
    `;
    elements.competitiveTeamsSelector.appendChild(label);
  });
}

function handleCompetitiveSelectionChange(event) {
  const checkbox = event.target.closest("[data-competitive-team]");
  if (!checkbox) return;

  const teamId = checkbox.dataset.competitiveTeam;
  if (checkbox.checked) {
    if (selectedCompetitiveTeamIds.length >= COMPETITIVE_TEAM_COUNT) {
      checkbox.checked = false;
      window.alert(`You can only select ${COMPETITIVE_TEAM_COUNT} teams.`);
      return;
    }
    selectedCompetitiveTeamIds.push(teamId);
  } else {
    selectedCompetitiveTeamIds = selectedCompetitiveTeamIds.filter((id) => id !== teamId);
  }

  renderCompetitiveSelection();
}

function startCompetitiveTournament() {
  if (selectedCompetitiveTeamIds.length !== COMPETITIVE_TEAM_COUNT) {
    window.alert(`Select exactly ${COMPETITIVE_TEAM_COUNT} teams.`);
    return;
  }

  state.competitive.tournament = createTournament(selectedCompetitiveTeamIds);
  selectedCompetitiveTeamIds = [];
  elements.competitiveSetupPanel.hidden = true;
  saveState();
  renderCompetitive();
}

function createTournament(teamIds) {
  const pairs = pairSequentially(shuffleIds(teamIds));
  return {
    id: makeId(),
    createdAt: new Date().toISOString(),
    status: "active",
    teamIds: [...teamIds],
    rounds: [createCompetitiveRound(1, pairs)],
  };
}

function createCompetitiveRound(number, pairs) {
  return {
    id: makeId(),
    number,
    matches: pairs.map(([teamAId, teamBId]) => ({
      id: makeId(),
      teamAId,
      teamBId,
      winnerId: null,
    })),
  };
}

function pairSequentially(teamIds) {
  const pairs = [];
  for (let index = 0; index < teamIds.length; index += 2) {
    if (teamIds[index] && teamIds[index + 1]) {
      pairs.push([teamIds[index], teamIds[index + 1]]);
    }
  }
  return pairs;
}

function shuffleIds(ids) {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }
  return shuffled;
}

function renderCompetitiveStandings(standings) {
  elements.competitiveStandings.innerHTML = "";

  standings.forEach((standing, index) => {
    const team = getTournamentTeam(standing.teamId);
    const row = document.createElement("article");
    row.className = `standing-row ${standing.status}`;
    row.innerHTML = `
      <span class="standing-position">#${index + 1}</span>
      ${getTournamentLogoMarkup(team)}
      <div class="standing-main">
        <strong>${escapeHtml(team.name)}</strong>
        <span>${standing.wins}-${standing.losses} | ${standing.statusLabel}</span>
      </div>
      <span class="overall-badge">OVR ${standing.overall}</span>
    `;
    elements.competitiveStandings.appendChild(row);
  });
}

function renderCompetitiveRounds(tournament) {
  elements.competitiveRounds.innerHTML = "";

  tournament.rounds
    .slice()
    .reverse()
    .forEach((round) => {
      const block = document.createElement("section");
      block.className = "round-block";
      block.innerHTML = `<h4>Round ${round.number}</h4>`;

      round.matches.forEach((match) => {
        const teamA = getTournamentTeam(match.teamAId);
        const teamB = getTournamentTeam(match.teamBId);
        const winner = match.winnerId ? getTournamentTeam(match.winnerId) : null;
        const card = document.createElement("button");
        card.className = `swiss-match ${match.winnerId ? "completed" : "pending"}`;
        card.type = "button";
        card.dataset.competitiveMatch = match.id;
        card.innerHTML = `
          <span>${escapeHtml(teamA.name)}</span>
          <strong>VS</strong>
          <span>${escapeHtml(teamB.name)}</span>
          <em>${winner ? `Winner: ${escapeHtml(winner.name)}` : "Set winner"}</em>
        `;
        block.appendChild(card);
      });

      elements.competitiveRounds.appendChild(block);
    });
}

function handleCompetitiveRoundsClick(event) {
  const matchButton = event.target.closest("[data-competitive-match]");
  if (!matchButton) return;
  openCompetitiveMatch(matchButton.dataset.competitiveMatch);
}

function openCompetitiveMatch(matchId) {
  const located = findCompetitiveMatch(matchId);
  if (!located) return;

  selectedCompetitiveMatchId = matchId;
  const { match } = located;
  const teamA = getTournamentTeam(match.teamAId);
  const teamB = getTournamentTeam(match.teamBId);
  elements.competitiveMatchTitle.textContent = `${teamA.name} vs ${teamB.name}`;
  elements.winnerTeamABtn.textContent = teamA.name;
  elements.winnerTeamBBtn.textContent = teamB.name;
  elements.winnerTeamABtn.dataset.teamId = teamA.id;
  elements.winnerTeamBBtn.dataset.teamId = teamB.id;
  elements.winnerTeamABtn.classList.toggle("active", match.winnerId === teamA.id);
  elements.winnerTeamBBtn.classList.toggle("active", match.winnerId === teamB.id);

  if (!elements.competitiveMatchDialog.open) {
    elements.competitiveMatchDialog.showModal();
  }
}

function closeCompetitiveMatch() {
  selectedCompetitiveMatchId = null;
  if (elements.competitiveMatchDialog.open) {
    elements.competitiveMatchDialog.close();
  }
}

function saveCompetitiveWinner(teamId) {
  const tournament = state.competitive.tournament;
  const located = findCompetitiveMatch(selectedCompetitiveMatchId);
  if (!tournament || !located || !teamId) return;
  const { roundIndex, match } = located;
  if (teamId !== match.teamAId && teamId !== match.teamBId) return;

  match.winnerId = teamId;

  if (roundIndex < tournament.rounds.length - 1) {
    tournament.rounds = tournament.rounds.slice(0, roundIndex + 1);
  }

  advanceTournament(tournament);
  saveState();
  closeCompetitiveMatch();
  renderCompetitive();
}

function advanceTournament(tournament) {
  const currentRound = tournament.rounds[tournament.rounds.length - 1];
  if (!currentRound.matches.every((match) => match.winnerId)) return;

  const standings = getTournamentStandings(tournament);
  const activeTeams = standings.filter((standing) => standing.status === "active");
  if (!activeTeams.length) {
    tournament.status = "completed";
    return;
  }

  const pairs = makeSwissPairs(tournament, activeTeams);
  if (!pairs.length) {
    tournament.status = "completed";
    return;
  }

  tournament.rounds.push(createCompetitiveRound(tournament.rounds.length + 1, pairs));
}

function makeSwissPairs(tournament, activeStandings) {
  const previousPairs = getPreviousPairKeys(tournament);
  const records = [...activeStandings].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return b.overall - a.overall;
  });
  const grouped = new Map();

  records.forEach((standing) => {
    const key = `${standing.wins}-${standing.losses}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(standing);
  });

  const pairs = [];
  let pool = [];

  [...grouped.values()].forEach((group) => {
    pool = [...pool, ...shuffleIds(group.map((standing) => standing.teamId)).map((teamId) =>
      records.find((standing) => standing.teamId === teamId),
    )];

    while (pool.length >= 2) {
      const first = pool.shift();
      let opponentIndex = pool.findIndex((candidate) => !previousPairs.has(getPairKey(first.teamId, candidate.teamId)));
      if (opponentIndex === -1) opponentIndex = 0;
      const opponent = pool.splice(opponentIndex, 1)[0];
      pairs.push([first.teamId, opponent.teamId]);
    }
  });

  return pairs;
}

function getTournamentStandings(tournament) {
  const standings = new Map();

  tournament.teamIds.forEach((teamId) => {
    standings.set(teamId, {
      teamId,
      wins: 0,
      losses: 0,
      overall: getTeamOverall(teamId) ?? 0,
      status: "active",
      statusLabel: "Active",
    });
  });

  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (!match.winnerId) return;
      const loserId = match.winnerId === match.teamAId ? match.teamBId : match.teamAId;
      standings.get(match.winnerId).wins += 1;
      standings.get(loserId).losses += 1;
    });
  });

  standings.forEach((standing) => {
    if (standing.wins >= SWISS_TARGET_RECORD) {
      standing.status = "qualified";
      standing.statusLabel = "Qualified";
    } else if (standing.losses >= SWISS_TARGET_RECORD) {
      standing.status = "eliminated";
      standing.statusLabel = "Eliminated";
    }
  });

  return [...standings.values()].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    if (b.overall !== a.overall) return b.overall - a.overall;
    return getTournamentTeam(a.teamId).name.localeCompare(getTournamentTeam(b.teamId).name, "en-US");
  });
}

function getPreviousPairKeys(tournament) {
  const keys = new Set();
  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => keys.add(getPairKey(match.teamAId, match.teamBId)));
  });
  return keys;
}

function getPairKey(teamAId, teamBId) {
  return [teamAId, teamBId].sort().join("::");
}

function findCompetitiveMatch(matchId) {
  const tournament = state.competitive.tournament;
  if (!tournament || !matchId) return null;

  for (let roundIndex = 0; roundIndex < tournament.rounds.length; roundIndex += 1) {
    const round = tournament.rounds[roundIndex];
    const match = round.matches.find((item) => item.id === matchId);
    if (match) return { tournament, round, roundIndex, match };
  }

  return null;
}

function resetCompetitiveTournament() {
  if (!state.competitive.tournament && elements.competitiveSetupPanel.hidden) return;

  const confirmed = window.confirm("Reset the current cup?");
  if (!confirmed) return;

  state.competitive.tournament = null;
  selectedCompetitiveTeamIds = [];
  selectedCompetitiveMatchId = null;
  elements.competitiveSetupPanel.hidden = true;
  saveState();
  renderCompetitive();
}

function getTournamentTeam(teamId) {
  return getTeam(teamId) ?? {
    id: teamId,
    name: "Removed team",
    logo: null,
  };
}

function getTournamentLogoMarkup(team) {
  if (team.logo) {
    return `
      <div class="club-logo">
        <img src="${escapeHtml(team.logo)}" alt="${escapeHtml(team.name)}" />
      </div>
    `;
  }

  return `<div class="club-logo">${escapeHtml(getInitials(team.name))}</div>`;
}

function openMatch(matchId) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;

  selectedMatchId = matchId;
  elements.dialogTitle.textContent = match.map;
  elements.dialogSide.textContent = match.playerSide;
  elements.playerTeamSide.textContent = match.playerSide;
  elements.enemyTeamSide.textContent = match.enemySide;
  elements.playerTeamStrength.textContent = `Average strength: ${formatStrength(
    getAverageStrength(match.playerBots, getMatchPlayerStrength(match)),
  )}`;
  elements.enemyTeamStrength.textContent = `Average strength: ${formatStrength(getAverageStrength(match.enemyBots))}`;
  elements.teamRoundsInput.value = match.teamRounds ?? "";
  elements.enemyRoundsInput.value = match.enemyRounds ?? "";
  elements.fragsInput.value = match.frags ?? "";
  elements.deathsInput.value = match.deaths ?? "";
  elements.botCommandText.value = buildBotCommands(match);

  renderBots(elements.playerBotsList, match.playerBots);
  renderBots(elements.enemyBotsList, match.enemyBots);
  updateDeltaPreview();

  if (!elements.matchDialog.open) {
    elements.matchDialog.showModal();
  }
}

function closeDialog() {
  if (elements.matchDialog.open) {
    elements.matchDialog.close();
  }
}

function renderBots(list, bots) {
  list.innerHTML = "";

  bots.forEach((bot, index) => {
    const level = getBotLevel(bot.level);
    const item = document.createElement("li");
    item.innerHTML = `
      <span>${escapeHtml(level.commandName)} ${index + 1}</span>
      <span class="bot-pill" style="color: ${level.color}">${escapeHtml(level.short)}</span>
    `;
    list.appendChild(item);
  });
}

function saveMatchResult() {
  const match = getSelectedMatch();
  if (!match) return;

  const values = readResultValues();
  if (!values) {
    window.alert("Fill rounds, kills and deaths with valid values.");
    return;
  }
  const result = deriveMatchResult(values.teamRounds, values.enemyRounds);

  Object.assign(match, {
    status: "completed",
    result,
    ...values,
  });

  saveState();
  render();
  closeDialog();
}

function markMatchPending() {
  const match = getSelectedMatch();
  if (!match) return;

  Object.assign(match, {
    status: "pending",
    result: null,
    teamRounds: null,
    enemyRounds: null,
    frags: null,
    deaths: null,
  });

  saveState();
  render();
  openMatch(match.id);
}

function deleteSelectedMatch() {
  const match = getSelectedMatch();
  if (!match) return;

  const confirmed = window.confirm(`Delete the match on ${match.map.toUpperCase()}?`);
  if (!confirmed) return;

  state.matches = state.matches.filter((item) => item.id !== match.id);
  selectedMatchId = null;
  saveState();
  render();
  closeDialog();
}

function getSelectedMatch() {
  return state.matches.find((item) => item.id === selectedMatchId);
}

function readResultValues() {
  const teamRounds = parseInt(elements.teamRoundsInput.value, 10);
  const enemyRounds = parseInt(elements.enemyRoundsInput.value, 10);
  const frags = parseInt(elements.fragsInput.value, 10);
  const deaths = parseInt(elements.deathsInput.value, 10);

  const values = [teamRounds, enemyRounds, frags, deaths];
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 99)) return null;

  return { teamRounds, enemyRounds, frags, deaths };
}

function deriveMatchResult(teamRounds, enemyRounds) {
  if (teamRounds === enemyRounds) return "draw";
  if (teamRounds >= 13 && teamRounds > enemyRounds) return "win";
  return "loss";
}

function updateDeltaPreview() {
  const match = getSelectedMatch();
  const values = readResultValues();

  if (!match || !values) {
    elements.deltaPreview.textContent = "Fill rounds, kills and deaths to calculate rating.";
    return;
  }
  const result = deriveMatchResult(values.teamRounds, values.enemyRounds);

  const tempMatch = {
    ...match,
    status: "completed",
    result,
    ...values,
  };
  const existingIndex = state.matches.findIndex((item) => item.id === match.id);
  const tempMatches = state.matches.map((item, index) => (index === existingIndex ? tempMatch : item));
  const tempState = state;

  state = { ...state, matches: tempMatches };
  const summary = calculateSummary();
  state = tempState;

  const meta = summary.matchMeta.get(match.id);
  const bonusText = meta?.streakBonus ? `, streak bonus +${meta.streakBonus}` : "";
  elements.deltaPreview.textContent = `${getResultLabel(result)}: ${formatSigned(meta?.delta ?? 0)} points${bonusText}.`;
}

function copyCommands() {
  const command = elements.botCommandText.value;

  navigator.clipboard
    .writeText(command)
    .then(() => {
      elements.copyCommandBtn.textContent = "Copied";
      window.setTimeout(() => {
        elements.copyCommandBtn.textContent = "Copy";
      }, 1400);
    })
    .catch(() => {
      elements.botCommandText.select();
      document.execCommand("copy");
    });
}

function buildBotCommands(match) {
  const counts = new Map();
  const lines = [];

  const addBotLines = (bots, side) => {
    bots.forEach((bot) => {
      const level = getBotLevel(bot.level);
      const count = (counts.get(level.key) ?? 0) + 1;
      counts.set(level.key, count);
      const commandSide = side === "CT" ? "bot_add_ct" : "bot_add_t";
      lines.push(`${commandSide} "${getConsoleBotName(level)} ${count}";`);
    });
  };

  addBotLines(match.playerBots, match.playerSide);
  addBotLines(match.enemyBots, match.enemySide);

  return lines.join("\n");
}

function getConsoleBotName(level) {
  return level.commandName.replace(/^BOT\s+/i, "");
}

function getBotLevel(key) {
  return botLevels.find((level) => level.key === key) ?? botLevels[0];
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatSigned(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}`;
}

function formatStrength(value) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatScore(match) {
  if (match.status !== "completed") return "-";
  return `${match.teamRounds}x${match.enemyRounds}`;
}

function formatResult(match) {
  if (match.status !== "completed") return "-";
  return getResultLabel(match.result);
}

function getResultLabel(result) {
  if (result === "win") return "Win";
  if (result === "draw") return "Draw";
  return "Loss";
}

function formatDelta(delta) {
  if (delta === null || delta === undefined) return "-";
  const className = delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";
  return `<span class="delta-pill ${className}">${formatSigned(delta)}</span>`;
}

function formatStatus(match) {
  if (match.status === "completed") {
    return '<span class="status-pill done">Completed</span>';
  }
  return '<span class="status-pill pending">Pending</span>';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
