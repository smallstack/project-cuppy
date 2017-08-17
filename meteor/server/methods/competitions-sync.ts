// tslint:disable:object-literal-shorthand
// tslint:disable:only-arrow-functions
import { Utils } from "@smallstack/core-common";
import { Competition, CompetitionsCollection } from "@smallstack/datalayer";
import { CuppyStrategyManager } from "../imports/CuppyStrategyManager";
import { ICompetitionSyncer } from "../imports/syncer/ICompetitionSyncer";


Meteor.methods({
    "competitions-sync": function (params: { modelId: string }) {
        Utils.check(params.modelId, "string", "modelId");

        const competition: Competition = CompetitionsCollection.getCollection().findOne({
            _id: params.modelId
        });

        if (!competition)
            throw new Meteor.Error("404", "Could not find competition with id : " + params.modelId);

        if (!competition.isAdministrator(this.userId))
            throw new Meteor.Error("403", "You are not an administrator of this competition!");

        if (competition.syncer === undefined || competition.syncer === Competition.enums.syncer.MANUAL)
            throw new Meteor.Error("403", "No syncer given for competition!");

        const syncer: ICompetitionSyncer = CuppyStrategyManager.getSyncer(competition.syncer);
        if (syncer === undefined)
            throw new Meteor.Error("403", "Competition Syncer '" + competition.syncer + "' could not be loaded!");

        return syncer.updateCompetition(competition.id);
    }
});
