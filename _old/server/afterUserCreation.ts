/// <reference path="../typedefinitions/generated.d.ts" />


UserService.instance().onCreateUser((user: any) => {

    console.log("creating team for userid : " + user._id);
    // create a competition team for the user
    let competitionTeam: CompetitionTeam = new CompetitionTeam();
    competitionTeam.linkedUserIds = [user._id];
    competitionTeam.name = user.profile.displayName;
    competitionTeam.ownerId = user._id;
    competitionTeam.save();
    return user;
});
