
/// <reference path="../generated/collections/GeneratedBetsCollection.ts" />

class BetsCollection extends GeneratedBetsCollection {

	/**
	 * If you want to you can implement your own collection methods here. This file only gets generated once and will not get overwritten!
	 */


	/**
		* This sample constructor implements the 'getBetsByIds' publication which is needed for foreign keys to work.
		* It is just an example and should get changed
		*/
	constructor() {
		super();

		if (Meteor.isServer) {
			this.collectionService.addPublisher("bets", "getBetsByIds", { "_id": { $in: ":ids" }, "ownerId": "_currentLoggedInUser_" });
		}
	}

	protected getCollectionAllowRules(): Mongo.AllowDenyOptions {
		var that = this;
		return {
			insert: function (userId, doc) {
				return false;
			},
			update: function (userId, doc, fields, modifier) {
				return false;
			},
			remove: function (userId, doc) {
				return false;
			},
			fetch: ['ownerId']
		}
	}
}

// delete the following line if you want to instanciate this collection somewhere else
new BetsCollection();