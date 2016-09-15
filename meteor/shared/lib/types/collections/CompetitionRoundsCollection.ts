
/// <reference path="../generated/collections/GeneratedCompetitionRoundsCollection.ts" />

class CompetitionRoundsCollection extends GeneratedCompetitionRoundsCollection {

	/**
	 * If you want to you can implement your own collection methods here. This file only gets generated once and will not get overwritten!
	 */
    
    
    /**
     * This sample constructor implements the 'getCompetitionRoundsByIds' publication which is needed for foreign keys to work.
     * It is just an example and should get changed
     */    
    constructor() {
	   super();
        
        if (Meteor.isServer) {
			this.collectionService.addPublisher("competitionRounds", "getCompetitionRoundsByIds", { "_id": { $in: ":ids" }, "ownerId": "_currentLoggedInUser_" });
        }
	}
}

// delete the following line if you want to instanciate this collection somewhere else
new CompetitionRoundsCollection();