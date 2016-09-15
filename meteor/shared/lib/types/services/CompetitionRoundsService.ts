
/// <reference path="../generated/services/GeneratedCompetitionRoundsService.ts" />

class CompetitionRoundsService extends GeneratedCompetitionRoundsService {


    public getSubscriptionCacheLimit(): number {
        return -1;
    }

	/**
	 * If you want to you can implement your own service methods here. This file only gets generated once and will not get overwritten!
	 */

	/** server only */
	public deleteRoundRecursive(round: CompetitionRound) {
		var that = this;
		
		// delete sub rounds
		_.each(round.getSubRounds().cursor.fetch(), function(round: CompetitionRound) {
			that.deleteRoundRecursive(round);
		});
		
		// delete matches
		_.each(round.getMatches().cursor.fetch(), function(match: CompetitionMatch) {
			match.delete();
		});
		
		// delete itself
		round.delete();
	}
}