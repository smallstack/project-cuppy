
/// <reference path="../generated/models/GeneratedCompetitionTeam.ts" />

class CompetitionTeam extends GeneratedCompetitionTeam {

	public getAvatarUrls(): string[] {
		if (this.linkedUserIds !== undefined) {
			var urls: string[] = [];
			_.each(this.getLinkedUsers().cursor.fetch(), function (user: User) {
				urls.push(user.profile.avatarUrl);
			});
			return urls;
		}
		else if (this.avatarId !== undefined)
			return ["/medias/" + this.avatarId];
		else if (this.flag !== undefined)
			return ["/flags/" + this.flag];
		else
			return ["/images/soccer-icon.png"];
	}

	public getLinkedUsersTitle() {
		var namedUsers: string = undefined;
		_.each(this.getLinkedUsers().cursor.fetch(), function (user: User) {
			if (namedUsers !== undefined)
				namedUsers += ", ";
			else
				namedUsers = "";
			namedUsers += user.profile.displayName;
		});
		return namedUsers;
	}

}
