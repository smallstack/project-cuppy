/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("userCompetitionTeams", () => {

    smallstack.collections["users"].find().forEach((user: any) => {
        if (CompetitionTeamsCollection.getMongoCollection().findOne({ ownerId: user._id, linkedUserIds: user._id }) === undefined) {
            let competitionTeam: CompetitionTeam = new CompetitionTeam();
            competitionTeam.linkedUserIds = [user._id];
            competitionTeam.name = user.profile.displayName;
            competitionTeam.ownerId = user._id;
            competitionTeam.save();
        }
    });


}, { onlyOnce: true });

