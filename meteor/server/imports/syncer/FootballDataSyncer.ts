import { Utils } from '@smallstack/core-common';
import { CompetitionMatchesCollection, Competition, CompetitionRound, CompetitionTeam, CompetitionMatch } from '@smallstack/datalayer';
import { Autowired, ConfigurationService, CollectionsService } from '@smallstack/core-common';
import { AbstractCompetitionSyncer } from "./AbstractCompetitionSyncer";
import { ICompetitionSyncer } from "./ICompetitionSyncer";
import * as request from "request";
import * as _ from 'underscore';
import { IScoreStrategy } from "../scoreStrategies/IScoreStrategy";
import { CuppyStrategyManager } from "../CuppyStrategyManager";

export class FootballDataSyncer extends AbstractCompetitionSyncer implements ICompetitionSyncer {

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

        var competition: Competition = this.getCompetitionById(competitionId);

        if (competition.syncer !== Competition.enums.syncer.FOOTBALLDATA)
            throw new Error("Competition is not a Football-Data.org competition!");

        if (!competition.metadata.footballDataId)
            throw new Error("No competition.metadata.footballDataId found!");

        // upgrade competition
        if (!(competition.roundIds instanceof Array))
            competition.roundIds = [];

        let scoreStrategy: IScoreStrategy = this.cuppyStrategyManager.getScoreStrategy(competition.scoreStrategy);

        let queryUrl: string = this.apiUrl + '/soccerseasons/' + competition.metadata.footballDataId + "/fixtures";

        let response: any = request.get(queryUrl, {
            headers: { 'X-Auth-Token': this.apiKey }
        });

        if (!response || !response.data)
            throw new Error("Could not get response from " + queryUrl);

        let data: any = response.data;
        let fixtures: any = data.fixtures;

        if (!(fixtures instanceof Array))
            throw new Error("response.data.fixtures is not instanceof Array!");

        console.log("Updating " + fixtures.length + " fixtures!");

        _.each(fixtures, (fixture: any) => {
            var date: Date = new Date(Date.parse(fixture.date));

            // lookup competition round
            var round: CompetitionRound = this.getRound(competition.id, parseInt(fixture.matchday));

            // look up teams
            var homeTeam: CompetitionTeam = this.getTeamByName(fixture.homeTeamName);
            var awayTeam: CompetitionTeam = this.getTeamByName(fixture.awayTeamName);

            // look up match
            var match: CompetitionMatch = this.getMatch(competition.id, homeTeam.id, awayTeam.id, date, round);

            // update match date
            if (match.date !== date) {
                match.date = date;
                match.update();
            }

            // update match result
            if (match.manuallyUpdated === true)
                console.warn("Skipping match : " + fixture.homeTeamName + " vs. " + fixture.awayTeamName + " since results were set manually!");
            else {
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
        var competitionRound: CompetitionRound = this.collectionsService.getCollectionByName("competitionrounds").findOne({
            competitionId: competitionId,
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
        var match: CompetitionMatch = CompetitionMatchesCollection.getCollection().findOne({
            competitionId: competitionId,
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
        var dbName: string = Utils.createUrlConformIdFromInput(name);

        // var team: CompetitionTeam = this.competitionTeamsService.getTeamByName<CompetitionTeam>({ teamName: dbName }).val(0);
        // if (!team) {
        //     team = new CompetitionTeam();
        //     team.name = dbName;
        //     team.id = this.competitionTeamsService.save(team);
        // }
        // return team;
        return undefined;
    }
}
