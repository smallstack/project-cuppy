

import { CompetitionMatch, Bet } from "@smallstack/datalayer";

export interface CompetitionRank {
    userId: string;
    rank: number;
    points: number;
};

export interface IScoreStrategy {
    updatePoints(match: CompetitionMatch, force: boolean);
    getPoints(match: CompetitionMatch, bet: Bet, multiplier: number);

    // updateSideBetPoints(sideBetId: string);

    updateRanking(competitionId: string, ranking: CompetitionRank[]);
    getRanking(competitionId: string): CompetitionRank[];

    updateMatchResult(match: CompetitionMatch, results: number[], updatePoints: boolean, updateRanking: boolean, updateRound: boolean);
}
