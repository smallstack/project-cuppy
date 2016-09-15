/// <reference path="../../typedefinitions/generated.d.ts" />

Meteor.startup(() => {
    var competitionService: CompetitionsService = CompetitionsService.instance();
    var testDataGenerator: TestDataGenerator = smallstack.ioc.get<TestDataGenerator>("testDataGenerator");
    var matchesService: CompetitionMatchesService = CompetitionMatchesService.instance();


    function createCompetition(displayName: string, type: string): void {
        // delete test league if existing
        var name = Utils.createUrlConformIdFromInput(displayName);
        var foundCompetition = CompetitionsCollection.getMongoCollection().findOne({ name: name });
        if (foundCompetition)
            competitionService.deleteCompetition(foundCompetition);

        // create the owner
        testDataGenerator.createTestUser(function (error: Meteor.Error, userId: string) {

            // create a competition
            var competition: Competition = new Competition();
            competition.name = name;
            competition.type = type;
            competition.accessGroups = ["public"];
            competition.ownerId = userId;
            competition.displayName = displayName;
            competition.returnRound = true;
            var id = competitionService.saveCompetition(competition);
            competition = competitionService.getCompetitionById({ id: id }).val(0);

            // create teams
            var knownTeamNames: string[] = [];
            for (var t = 0; t < 10; t++) {
                var team: CompetitionTeam = new CompetitionTeam();
                team.name = Utils.createUrlConformIdFromInput(testDataGenerator.getRandomTeamName(knownTeamNames));
                knownTeamNames.push(team.name);
                var teamId = CompetitionTeamsService.instance().saveCompetitionTeam(team);
                competition.addTeamIds([teamId]);
            }

            // create rounds
            for (var r = 0; r < 6; r++) {
                var round: CompetitionRound = new CompetitionRound();
                round.name = Utils.createUrlConformIdFromInput("Round " + (r + 1));
                round.index = r;
                round.competitionId = competition.id;

                var roundId = CompetitionRoundsService.instance().saveCompetitionRound(round);
                competition.addRoundIds([roundId]);
            }

            // create matches
            competition.startCompetition();
        });
    }

    // manual 1on1
    // for (var i = 0; i < 5; i++) {
    //     var comp1on1 = createCompetition("Daddeln " + i + ". 1on1", Competition.enums.type.MANUAL1ON1);
    // }
});