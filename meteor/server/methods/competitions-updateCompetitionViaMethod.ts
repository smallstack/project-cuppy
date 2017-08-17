// tslint:disable:object-literal-shorthand
// tslint:disable:only-arrow-functions
import { RolesService, Utils } from "@smallstack/core-common";
import { Competition, CompetitionsCollection } from "@smallstack/datalayer";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
    "competitions-updateCompetitionViaMethod": function (params: { modelId: string, competition: any }) {
        Utils.check(params.modelId, "string", "modelId");
        Utils.check(params.competition, "object", "competition");

        // check access
        const competition: Competition = CompetitionsCollection.getCollection().findOne(params.modelId);
        if (!competition)
            throw new Meteor.Error(404, "Competition not found!");

        if (!competition.isAdministrator(this.userId))
            throw new Meteor.Error(403, "You're not an administrator of this competition!");

        const competititonToSave: Competition = Competition.fromDocument<Competition>(params.competition);
        competititonToSave.update();
    }
});
