/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("competitionAdministrator", () => {

	CompetitionsCollection.getMongoCollection().find({ "administratorIds": { $exists: false } }).forEach((competition: Competition) => {
		CompetitionsCollection.getMongoCollection().update(competition.id, { $set: { administratorIds: [competition.ownerId] } });
	});

}, { onlyOnce: true });