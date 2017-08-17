import { Utils } from "@smallstack/core-common";
import { Competition, CompetitionsService } from "@smallstack/datalayer";
import * as _ from "underscore";
import * as Chance from "chance";
import { IScoreStrategy } from "../imports/scoreStrategies/IScoreStrategy";
import { CuppyStrategyManager } from "../imports/CuppyStrategyManager";

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
    "competitions-createCompetition": function (params: { competitionName: string, competitionType: string, scoreStrategy: string }) {
        Utils.check(params.competitionName, "string", "competitionName");
        Utils.check(params.competitionType, "string", "competitionType");
        Utils.check(params.scoreStrategy, "string", "scoreStrategy");

        if (this.userId === null)
            throw new Meteor.Error("You have to be logged in to be able to create a new competition!");
        if (!Match.test(params.competitionName, String))
            throw new Meteor.Error("Competition Name must be a string!");
        if (params.competitionName.length < 3)
            throw new Meteor.Error("Competition Name must be at least 3 characters long!");
        if (!_.contains(_.toArray(Competition.enums.type), params.competitionType))
            throw new Meteor.Error("Unknown Competition Type '" + params.competitionType + "'!");

        const scoreStrategy: IScoreStrategy = CuppyStrategyManager.getScoreStrategy(params.scoreStrategy);
        if (scoreStrategy === undefined)
            throw new Meteor.Error("Unknown Score Strategy '" + params.scoreStrategy + "'!");

        // find a suitable ID
        var id = Utils.createUrlConformIdFromInput(params.competitionName);
        var randomHash = "";
        do {
            var count: number = CompetitionsService.instance().getCompetitionByName({
                name: id + randomHash
            }).getModels().length;
            if (count !== 0)
                randomHash = new Chance().word();
        } while (count !== 0);
        var competitionId = id + randomHash;

        // create the competition
        var competition: Competition = new Competition();
        competition.name = competitionId;
        competition.displayName = params.competitionName;
        competition.type = params.competitionType;
        competition.ownerId = this.userId;
        competition.userIds = [this.userId];
        competition.administratorIds = [this.userId];
        competition.createdAt = new Date();
        competition.scoreStrategy = params.scoreStrategy;
        competition.syncer = "manual";

        CompetitionsService.instance().save(competition);

        return competition.name;
    }
});
