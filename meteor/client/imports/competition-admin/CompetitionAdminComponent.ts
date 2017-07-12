import { AngularBaseComponentController, AngularComponent } from "@smallstack/core-client";
import { QueryObject, IOC, NavigationService, NavigationEntry } from "@smallstack/core-common";
import { InitializationAware } from "@smallstack/core-common";
import { Competition, CompetitionsService, CompetitionRound, CompetitionTeam, CompetitionTeamsService, CompetitionMatchesService, CompetitionMatch } from "@smallstack/datalayer";

import * as _ from 'underscore';

import template from "./CompetitionAdminComponent.html";

export class CompetitionAdminComponent extends AngularBaseComponentController implements InitializationAware {

    public competition: Competition;
    public competitionSyncer: string;
    public competitionTeams: CompetitionTeam[];
    // public administrators: User[];
    public allCompetitionTeams: CompetitionTeam[];
    // public sideBets: SideBet[];
    // public sideBetTypes: string[];
    // public vm: CompetitionAdminComponent;
    // public range: Function;
    public isLoaded: boolean;
    public rounds: CompetitionRound[];
    public allCompetitionMatches: CompetitionMatch[];
    public matchesByRound: { [groupId: string]: CompetitionMatch[] };

    public afterInitialization() {
        this.isLoaded = false;

        this.getRouteParameter("competitionName", (competitionName: string) => {
            if (competitionName === undefined) {
                this.notificationService.popup.error("No competition name present in URL!");
                return;
            }


            // load competition
            var competitionQuery: QueryObject<Competition> = CompetitionsService.instance().getCompetitionByName({ name: competitionName }, { reactive: true });
            competitionQuery.subscribe(() => {
                competitionQuery.expand(["roundIds", "teamIds.linkedUserIds"], () => {
                    Tracker.autorun(() => {
                        let competition: Competition = competitionQuery.getModel(0);
                        if (competition === undefined)
                            this.notificationService.popup.error("Competition '" + competitionName + "' could not be loaded!");
                        else {
                            this.ngZone.run(() => {
                                this.competition = competition;
                                this.rounds = competition.getRounds().getModels();
                                this.competitionSyncer = competition.syncer;
                                this.competitionTeams = competition.getTeams().getModels();
                            });
                            // this.loadSideBets(competition.id);
                            this.loadAllMatches(competition.id);
                        }
                    });
                });
            });

            this.loadAllCompetitionTeams();

            // $scope.$watch("competitionSyncer", (newVal: string) => {
            //     if (this.competition) {
            //         if (newVal === undefined || newVal === "")
            //             this.competition.syncer = undefined;
            //         else
            //             this.competition.syncer = newVal;
            //     }
            // });
        });
    }

    public loadAllCompetitionTeams() {
        var competitionTeamQuery: QueryObject<CompetitionTeam> = CompetitionTeamsService.instance().getAllHumanTeams({}, { entriesPerPage: 5000 });
        competitionTeamQuery.subscribe(() => {
            this.allCompetitionTeams = competitionTeamQuery.getModels();
        });
    }

    public loadAllMatches(competitionId: string) {
        var competitionMatchesQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForCompetitionId({ competitionId: competitionId });
        competitionMatchesQuery.subscribe(() => {
            this.ngZone.run(() => {
                this.allCompetitionMatches = competitionMatchesQuery.getModels();
                this.matchesByRound = {};
                _.each(this.allCompetitionMatches, (match: CompetitionMatch) => {
                    if (this.matchesByRound[match.roundId] === undefined)
                        this.matchesByRound[match.roundId] = [];
                    this.matchesByRound[match.roundId].push(match);
                });
            });
        });
    }

    public updateCompetition() {
        this.competition.updateCompetitionViaMethod(this.competition.toDocument(), this.notificationService.getStandardCallback("Could not update competition!", "Successfully updated competition!"));
    }

    // public loadSideBets(competitionId: string) {
    //     // load sidebets
    //     var sideBetsQuery: QueryObject<SideBet> = SidebetsService.instance().getSideBetsByCompetitionId({ competitionId: competitionId });
    //     sideBetsQuery.subscribe(() => {
    //         this.$timeout(() => {
    //             this.sideBets = sideBetsQuery.vals();
    //         });
    //     });
    // }

    // public addSideBet() {
    //     var sideBet: SideBet = new SideBet();
    //     sideBet.competitionId = this.competition.id;
    //     this.sideBets.push(sideBet);
    // }

    // public saveSideBets() {
    //     SidebetsService.instance().updateSideBets(this.sideBets, NotificationService.instance().getStandardCallback());
    // }
}


AngularComponent.new("CompetitionAdminComponent", CompetitionAdminComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setComponent(CompetitionAdminComponent)
        .setRoute("/competition/:competitionName/admin")
        .setRequiresAuthentication(true)
        .setVisible(false)
    );
});
