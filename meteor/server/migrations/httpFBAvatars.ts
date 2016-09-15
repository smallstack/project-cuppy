/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("httpFBAvatarFix", function () {

	smallstack.collections["users"].find({ "profile.avatarUrl": { $regex: "http://graph.facebook.com/*" } }).forEach(function (user) {
		smallstack.collections["users"].update(user, { $unset: { "profile.avatarUrl": 0 } });
	});

}, { onlyOnce: true });