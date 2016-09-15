/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("missingCompetitionIdOnUserSideBet", () => {

    SidebetuserbetsCollection.getMongoCollection().find({ competitionId: { $exists: false } }).forEach((sideBetUserBet: SideBetUserBet) => {
        var sideBet: SideBet = sideBetUserBet.getSideBet().val(0);
        SidebetuserbetsCollection.getMongoCollection().update(sideBetUserBet.id, { $set: { competitionId: sideBet.competitionId } });
    });

}, { onlyOnce: true });