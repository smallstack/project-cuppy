/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("backofficeRoleFix", function () {

	smallstack.collections["users"].find({ "roles": "adminpanel.manage" }).forEach(function (user) {
		smallstack.collections["users"].update(user, { $addToSet: { "roles": "backoffice.manage" } });
	});

}, { onlyOnce: true });