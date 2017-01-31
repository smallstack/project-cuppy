/// <reference path="../../typedefinitions/generated.d.ts" />


var migrationService: MigrationService = MigrationService.instance();

migrationService.addMigrationFn("defaultAvatarFix", function() {

	smallstack.collections["users"].find({ "profile.avatarUrl": "/packages/pb-services-user/images/default-avatar.png" }).forEach(function(user) {
		smallstack.collections["users"].update(user, { $set: { "profile.avatarUrl": "/packages/smallstack_user/images/default-avatar.png" } });
	});

}, { onlyOnce: true });