// tslint:disable:object-literal-shorthand
// tslint:disable:only-arrow-functions
import { RolesService, Utils } from "@smallstack/core-common";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
    "competitionTeams-createCompetitionTeam": function (params: { competitionName: string, competitionType: string, scoreStrategy: string }) {
        Utils.check(params.competitionName, "string", "competitionName");
        Utils.check(params.competitionType, "string", "competitionType");
        Utils.check(params.scoreStrategy, "string", "scoreStrategy");

        console.log("comp team : ", this);

        RolesService.checkRole(this.userId, "administrator");
        throw new Meteor.Error("501", "This method is not implemented yet!");

        // Please either return a value of type string or thow a new Meteor.Error in this method!
    }
});
