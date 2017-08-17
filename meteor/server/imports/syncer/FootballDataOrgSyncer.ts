import { Utils } from "@smallstack/core-common";
import { Autowired, CollectionsService, ConfigurationService } from "@smallstack/core-common";
import { Competition, CompetitionMatch, CompetitionMatchesCollection, CompetitionRound, CompetitionRoundsCollection, CompetitionTeam, CompetitionTeamsService } from "@smallstack/datalayer";
import * as request from "request";
import * as _ from "underscore";
import { CuppyStrategyManager } from "../CuppyStrategyManager";
import { IScoreStrategy } from "../scoreStrategies/IScoreStrategy";
import { AbstractCompetitionSyncer } from "./AbstractCompetitionSyncer";
import { ICompetitionSyncer } from "./ICompetitionSyncer";

export class FootballDataOrgSyncer extends AbstractCompetitionSyncer implements ICompetitionSyncer {

    @Autowired()
    private configurationService: ConfigurationService;

    @Autowired()
    private collectionsService: CollectionsService;

    @Autowired()
    private cuppyStrategyManager: CuppyStrategyManager;

    private apiUrl: string = "http://api.football-data.org/v1";
    private apiKey: string;

    constructor() {
        super();

        this.configurationService.onSet("footballdata.api.url", (url: string) => {
            this.apiUrl = url;
        });

        this.configurationService.onSet("footballdata.api.key", (key: string) => {
            this.apiKey = key;
        });
    }


    public updateCompetition(competitionId: string) {

        const competition: Competition = this.getCompetitionById(competitionId);

        if (competition.syncer !== Competition.enums.syncer.FOOTBALLDATAORG)
            throw new Error("Competition is not a Football-Data.org competition!");

        if (!competition.metadata.footballDataId)
            throw new Error("No competition.metadata.footballDataId found!");

        // upgrade competition
        if (!(competition.roundIds instanceof Array))
            competition.roundIds = [];

        const scoreStrategy: IScoreStrategy = this.cuppyStrategyManager.getScoreStrategy(competition.scoreStrategy);

        const queryUrl: string = this.apiUrl + "/competitions/" + competition.metadata.footballDataId + "/fixtures";

        const response: HTTP.HTTPResponse = HTTP.get(queryUrl, {
            headers: { "X-Auth-Token": this.apiKey }
        });

        if (!response || !response.data)
            throw new Error("Could not get response from " + queryUrl);

        const data: any = response.data;
        const fixtures: any = data.fixtures;

        if (!(fixtures instanceof Array))
            throw new Error("response.data.fixtures is not instanceof Array!");

        console.log("Updating " + fixtures.length + " fixtures!", competition);

        _.each(fixtures, (fixture: any) => {
            const date: Date = new Date(Date.parse(fixture.date));

            // lookup competition round
            const round: CompetitionRound = this.getRound(competition.id, parseInt(fixture.matchday));

            // look up teams
            const homeTeam: CompetitionTeam = this.getTeamByName(fixture.homeTeamName);
            const awayTeam: CompetitionTeam = this.getTeamByName(fixture.awayTeamName);

            // look up match
            const match: CompetitionMatch = this.getMatch(competition.id, homeTeam.id, awayTeam.id, date, round);

            // update match date
            if (match.date !== date) {
                match.date = date;
                match.update();
            }

            // update match result
            if (match.manuallyUpdated === true)
                console.warn("Skipping match : " + fixture.homeTeamName + " vs. " + fixture.awayTeamName + " since results were set manually!");
            else if (fixture.result.goalsHomeTeam !== null && fixture.result.goalsAwayTeam !== null) {
                scoreStrategy.updateMatchResult(match, [fixture.result.goalsHomeTeam, fixture.result.goalsAwayTeam], true, false, true);
            }

            // update roundIds
            if (_.indexOf(competition.roundIds, round.id) === -1)
                competition.roundIds.push(round.id);

            // update rounds->matchIds
            if (_.indexOf(round.matchIds, match.id) === -1) {
                round.matchIds.push(match.id);
                round.update();
            }
        });

        // save changes done to competition
        competition.update();
        scoreStrategy.updateRanking(competition.id, scoreStrategy.getRanking(competition.id));
    }

    private getRound(competitionId: string, roundIndex: number): CompetitionRound {
        let competitionRound: CompetitionRound = CompetitionRoundsCollection.getCollection().findOne({
            competitionId,
            index: roundIndex
        });

        if (!competitionRound) {
            competitionRound = new CompetitionRound();
            competitionRound.competitionId = competitionId;
            competitionRound.index = roundIndex;
            competitionRound.name = "round_" + roundIndex;
            competitionRound.id = this.competitionRoundsService.save(competitionRound);
        }
        return competitionRound;
    }

    private getMatch(competitionId: string, homeTeamId: string, awayTeamId: string, date: Date, round: CompetitionRound): CompetitionMatch {
        let match: CompetitionMatch = CompetitionMatchesCollection.getCollection().findOne({
            competitionId,
            teamIds: { $all: [homeTeamId, awayTeamId] },
            roundId: round.id
        });

        if (!match) {
            match = new CompetitionMatch();
            match.competitionId = competitionId;
            match.date = date;
            match.teamIds = [];
            match.teamIds[0] = homeTeamId;
            match.teamIds[1] = awayTeamId;
            match.roundId = round.id;
            match.maxPoints = round.betMultiplier * 3;
            match.id = this.competitionMatchesService.save(match);
        }
        return match;
    }

    private getTeamByName(name: string): CompetitionTeam {
        const dbName: string = Utils.createUrlConformIdFromInput(name);
        let team: CompetitionTeam = this.competitionTeamsService.getTeamByName({ teamName: dbName }).getModel(0);
        if (!team) {
            team = new CompetitionTeam();
            team.name = dbName;
            team.id = this.competitionTeamsService.save(team);
        }
        return team;
    }
}
