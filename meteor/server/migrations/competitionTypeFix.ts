/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("competitionTypeFix", function () {

	_.each(CompetitionsCollection.getMongoCollection().find().fetch(), (competition: Competition) => {
		if (competition.type === "manual1on1") {
			competition.type = Competition.enums.type.LEAGUE;
			competition.update();
		}
	});

}, { onlyOnce: true });