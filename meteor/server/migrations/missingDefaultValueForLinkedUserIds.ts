/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("missingDefaultValueForLinkedUserIds", () => {

    CompetitionTeamsCollection.getMongoCollection().find().forEach((team: CompetitionTeam) => {
        if (team.linkedUserIds === undefined) {
            team.linkedUserIds = [];
            team.update();
        }
    });


}, { onlyOnce: true });

