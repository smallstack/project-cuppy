import { initServer } from "./imports/initServer";
import { IOC } from "@smallstack/core-common";
import { CuppyStrategyManager } from "./imports/CuppyStrategyManager";
import { FootballLeagueType } from "./imports/competitionTypes/FootballLeagueType";
import { FootballQuickMatchType } from "./imports/competitionTypes/FootballQuickMatchType";
import { FootballTournamentType } from "./imports/competitionTypes/FootballTournamentType";
import { FootballDataSyncer } from "./imports/syncer/FootballDataSyncer";
import { Football3210ScoreStrategy } from "./imports/scoreStrategies/Football3210ScoreStrategy";

initServer();

// cuppy stuff
const cuppyStrategyManager: CuppyStrategyManager = new CuppyStrategyManager();
IOC.register("cuppyStrategyManager", cuppyStrategyManager);

// competition types
cuppyStrategyManager.addCompetitionType("footballLeague", new FootballLeagueType());
cuppyStrategyManager.addCompetitionType("footballQuickMatch", new FootballQuickMatchType());
cuppyStrategyManager.addCompetitionType("footballTournament", new FootballTournamentType());

// syncers
cuppyStrategyManager.addSyncer("footballData", new FootballDataSyncer());

// score strategies
cuppyStrategyManager.addScoreStrategy("football3210", new Football3210ScoreStrategy());
