/// <reference path="../../typedefinitions/generated.d.ts" />
/// <reference path="ICompetitionService.ts" />

class DefaultCompetitionService implements ICompetitionService {

    @Autowired
    private betsService: BetsService;

    @Autowired
    private sidebetuserbetsService: SidebetuserbetsService;

    @Autowired
    private competitionsService: CompetitionsService;

    public updatePoints(match: CompetitionMatch, force: boolean = false) {
        if (!match.isFinished() && !force)
            return;

        var round: CompetitionRound = match.getRound().val(0);
        var multiplier: number = round.multiplier ? round.multiplier : 1;

        var bets: Bet[] = this.betsService.getBetsForMatchId({ matchId: match.id }).val();

        _.each<Bet>(bets, (bet: Bet) => {
            bet.points = this.getPoints(match, bet, multiplier);
            bet.update();
        });
    }

    public getPoints(match: CompetitionMatch, bet: Bet, multiplier: number = 1) {
        if (!match || !match.isFinished())
            return 0;

        if (bet === undefined)
            return 0;

        var points: number = 0;

        // calculate points
        if (match.result[0] === bet.result[0] && match.result[1] === bet.result[1])
            points = 3;
        else if ((match.result[0] - match.result[1]) === (bet.result[0] - bet.result[1]))
            points = 2;
        else if (this.winnerIndex(match.result) === this.winnerIndex(bet.result))
            points = 1;

        return points * multiplier;
    }

    public updateMatchResult(match: CompetitionMatch, results: number[], updatePoints: boolean = true, updateRanking: boolean = true, updateRound: boolean = true) {
        match.result = results;
        if (match.update() !== 1)
            throw new Meteor.Error("501", "Scores could not be updated!");
        if (updatePoints)
            this.updatePoints(match);
        if (updateRanking)
            this.updateRanking(match.competitionId, this.getRanking(match.competitionId));
        if (updateRound) {
            this.updateRound(match.getRound().val(0));
        }
    }

    public updateRound(round: CompetitionRound) {
        var allMatchesFinished: boolean = true;
        round.getMatches().cursor.forEach((match: CompetitionMatch) => {
            if (!match.isFinished())
                allMatchesFinished = false;
        });

        round.allMatchesFinished = allMatchesFinished;
        round.update();
    }

    public updateSideBetPoints(sideBetId: string) {
        var sideBet: SideBet = SidebetsCollection.getMongoCollection().findOne(sideBetId);
        if (!sideBet)
            throw new Error("Could not find sidebet with id : " + sideBetId);

        // update user sidebets
        SidebetuserbetsCollection.getMongoCollection().find({ sideBetId: sideBetId }).forEach((sideBetUserBet: SideBetUserBet) => {
            // compare result
            var points: number = 0;
            if (sideBet.result === sideBetUserBet.result)
                points = sideBet.points;
            SidebetuserbetsCollection.getMongoCollection().update(sideBetUserBet.id, { $set: { points: points } });
        });

        this.updateRanking(sideBet.competitionId, this.getRanking(sideBet.competitionId));
    }

    public updateRanking(competitionId: string, ranking: CompetitionRank[]) {
        if (CompetitionsCollection.getMongoCollection().update(competitionId, { $set: { ranking: ranking } }) !== 1)
            throw new Error("Could not update competition ranking cause it wasn't found!");
    }


    public getRanking(competitionId: string): CompetitionRank[] {
        var groupedByUser: { [userId: string]: number } = {};

        // bets
        this.betsService.getBetsForCompetitionId({ competitionId: competitionId }).cursor.forEach((bet: Bet, index: number, cursor: Mongo.Cursor<Bet>) => {
            if (_.isNumber(bet.points)) {
                if (groupedByUser[bet.ownerId] === undefined)
                    groupedByUser[bet.ownerId] = 0;
                groupedByUser[bet.ownerId] += bet.points;
            }
        });

        // sidebets
        this.sidebetuserbetsService.getForCompetitionId({ competitionId: competitionId }).cursor.forEach((sideBetUserBet: SideBetUserBet, index: number, cursor: Mongo.Cursor<SideBetUserBet>) => {
            if (_.isNumber(sideBetUserBet.points)) {
                if (groupedByUser[sideBetUserBet.ownerId] === undefined)
                    groupedByUser[sideBetUserBet.ownerId] = 0;
                groupedByUser[sideBetUserBet.ownerId] += sideBetUserBet.points;
            }
        });

        // create ranking entries
        var ranking: CompetitionRank[] = [];
        _.each(groupedByUser, (entry: number, userId: string) => {
            ranking.push({ points: entry, userId: userId, rank: 0 });
        });

        // sort 
        ranking.sort((a: CompetitionRank, b: CompetitionRank) => {
            if (a.points > b.points)
                return -1;
            if (a.points < b.points)
                return 1;
            return 0;
        });

        // add rank
        var currentRank = 1;
        var pointsRank = [];
        _.each(ranking, (rank: CompetitionRank) => {
            if (pointsRank[rank.points] !== undefined)
                rank.rank = pointsRank[rank.points];
            else {
                rank.rank = currentRank;
                pointsRank[rank.points] = currentRank;
            }
            currentRank++;
        });
        return ranking;
    }

    private winnerIndex(matchOrBetResult: number[]) {
        if (matchOrBetResult[0] === matchOrBetResult[1])
            return undefined;

        if (matchOrBetResult[0] > matchOrBetResult[1])
            return 0;
        return 1;
    }

}