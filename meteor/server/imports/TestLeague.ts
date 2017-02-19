import { IOC, Utils, CollectionsService, Collection, User } from "@smallstack/core";
import { TestDataGenerator } from "@smallstack/meteor";
import {
    Competition, CompetitionsService, CompetitionMatchesService, CompetitionTeam, CompetitionTeamsService,
    CompetitionRound, CompetitionRoundsService
} from "@smallstack/datalayer";

Meteor.startup(() => {
    let competitionService: CompetitionsService = CompetitionsService.instance();
    let testDataGenerator: TestDataGenerator = IOC.get<TestDataGenerator>("testDataGenerator");
    let matchesService: CompetitionMatchesService = CompetitionMatchesService.instance();


    function createCompetition(displayName: string, type: string): void {
        // delete test league if existing
        let name = Utils.createUrlConformIdFromInput(displayName);
        let foundCompetition = competitionService.getCompetitionByName({ name: name }).getModel(0);
        if (foundCompetition)
            competitionService.delete(foundCompetition);

        // create the owner
        let user: User = testDataGenerator.createTestUser();

        // create a competition
        let competition: Competition = new Competition();
        competition.name = name;
        competition.type = type;
        competition.accessGroups = ["public"];
        competition.ownerId = user.id;
        competition.displayName = displayName;
        competition.returnRound = true;
        competitionService.save(competition);

        // create teams
        let knownTeamNames: string[] = [];
        for (let t = 0; t < 10; t++) {
            let team: CompetitionTeam = new CompetitionTeam();
            team.name = Utils.createUrlConformIdFromInput(testDataGenerator.getRandomTeamName(knownTeamNames));
            knownTeamNames.push(team.name);
            let teamId = CompetitionTeamsService.instance().save(team);
            competition.addTeamIds([teamId]);
        }

        // create rounds
        for (let r = 0; r < 6; r++) {
            let round: CompetitionRound = new CompetitionRound();
            round.name = Utils.createUrlConformIdFromInput("Round " + (r + 1));
            round.index = r;
            round.competitionId = competition.id;

            let roundId = CompetitionRoundsService.instance().save(round);
            competition.addRoundIds([roundId]);
        }

        // create matches
        competition.startCompetition();
    }

    // manual 1on1
    // for (let i = 0; i < 5; i++) {
    //     let comp1on1 = createCompetition("Daddeln " + i + ". 1on1", Competition.enums.type.MANUAL1ON1);
    // }
});
