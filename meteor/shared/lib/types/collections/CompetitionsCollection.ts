
/// <reference path="../generated/collections/GeneratedCompetitionsCollection.ts" />

class CompetitionsCollection extends GeneratedCompetitionsCollection {

	/**
	 * If you want to you can implement your own collection methods here. This file only gets generated once and will not get overwritten!
	 */


    /**
     * This sample constructor implements the 'getCompetitionsByIds' publication which is needed for foreign keys to work.
     * It is just an example and should get changed
     */
    constructor() {
        super();
    }

    protected createSearchIndex() {
        if (Package["easysearch:core"]) {
            smallstack.indizes["competitions"] = new EasySearch.Index({
                collection: this._collection,
                fields: ["name", "displayName", "type"],
                engine: new EasySearch.MongoDB()
            });
        }
    }
}

// delete the following line if you want to instanciate this collection somewhere else
new CompetitionsCollection();