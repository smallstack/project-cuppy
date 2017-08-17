import { IOC } from "@smallstack/core-common";
import { FootballLeagueType } from "./imports/competitionTypes/FootballLeagueType";
import { FootballQuickMatchType } from "./imports/competitionTypes/FootballQuickMatchType";
import { FootballTournamentType } from "./imports/competitionTypes/FootballTournamentType";
import { CuppyStrategyManager } from "./imports/CuppyStrategyManager";
import { initServer } from "./imports/initServer";
import { Football3210ScoreStrategy } from "./imports/scoreStrategies/Football3210ScoreStrategy";
import { FootballDataOrgSyncer } from "./imports/syncer/FootballDataOrgSyncer";

initServer();

// cuppy stuff
const cuppyStrategyManager: CuppyStrategyManager = new CuppyStrategyManager();
IOC.register("cuppyStrategyManager", cuppyStrategyManager);

// competition types
cuppyStrategyManager.addCompetitionType("footballLeague", new FootballLeagueType());
cuppyStrategyManager.addCompetitionType("footballQuickMatch", new FootballQuickMatchType());
cuppyStrategyManager.addCompetitionType("footballTournament", new FootballTournamentType());

// syncers
cuppyStrategyManager.addSyncer("footballDataOrg", new FootballDataOrgSyncer());

// score strategies
cuppyStrategyManager.addScoreStrategy("football3210", new Football3210ScoreStrategy());
