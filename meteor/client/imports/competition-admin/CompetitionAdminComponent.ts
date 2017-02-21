import { Angular2BaseComponentController } from "@smallstack/meteor";
import { InitializationAware, QueryObject } from "@smallstack/core";
import { Competition, CompetitionsService, CompetitionRound, CompetitionTeam } from "@smallstack/datalayer";

import * as _ from 'underscore';

export class CompetitionAdministrationController extends Angular2BaseComponentController implements InitializationAware {

    public competition: Competition;
    public competitionSyncer: string;
    public competitionTeams: CompetitionTeam[];
    // public administrators: User[];
    // public allCompetitionTeams: CompetitionTeam[];
    // public sideBets: SideBet[];
    // public sideBetTypes: string[];
    // public vm: CompetitionAdministrationController;
    // public range: Function;
    public isLoaded: boolean;
    public rounds: CompetitionRound[];
    // public allCompetitionMatches: CompetitionMatch[];
    // public matchesByRound: { [groupId: string]: CompetitionMatch[] };

    public afterInitialization() {
        this.isLoaded = false;

        this.getRouteParameter("competitionName", (competitionName: string) => {
            if (competitionName === undefined) {
                this.notificationService.popup.error("No competition name present in URL!");
                return;
            }


            // load competition
            var competitionQuery: QueryObject<Competition> = CompetitionsService.instance().getCompetitionByName({ name: name }, { reactive: true });
            competitionQuery.subscribe(() => {
                competitionQuery.expand(["roundIds", "teamIds.linkedUserIds"], () => {
                    Tracker.autorun(() => {
                        let competition: Competition = competitionQuery.getModel(0);
                        if (competition === undefined)
                            this.notificationService.popup.error("Competition '" + name + "' could not be loaded!");
                        else {
                            this.ngZone.run(() => {
                                this.competition = competition;
                                this.rounds = competition.getRounds().getModels();
                                this.competitionSyncer = competition.syncer;
                                this.competitionTeams = competition.getTeams().getModels();
                            });
                            this.loadSideBets(competition.id);
                            this.loadAllMatches(competition.id);
                        }
                    });
                });
            });

            this.loadAllCompetitionTeams();

            $scope.$watch("competitionSyncer", (newVal: string) => {
                if (this.competition) {
                    if (newVal === undefined || newVal === "")
                        this.competition.syncer = undefined;
                    else
                        this.competition.syncer = newVal;
                }
            });
        });
    }

    public loadAllCompetitionTeams() {
        var competitionTeamQuery: QueryObject<CompetitionTeam> = CompetitionTeamsService.instance().getAllHumanTeams({}, { entriesPerPage: 5000 });
        competitionTeamQuery.subscribe(() => {
            this.allCompetitionTeams = competitionTeamQuery.vals();
        });
    }

    public loadAllMatches(competitionId: string) {
        var competitionMatchesQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForCompetitionId({ competitionId: competitionId });
        competitionMatchesQuery.subscribe(() => {
            this.$timeout(() => {
                this.allCompetitionMatches = competitionMatchesQuery.vals();
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
        this.competition.updateCompetitionViaMethod(this.competition.toDocument(), NotificationService.instance().getStandardCallback("Could not update competition!", "Successfully updated competition!"));
    }

    public loadSideBets(competitionId: string) {
        // load sidebets
        var sideBetsQuery: QueryObject<SideBet> = SidebetsService.instance().getSideBetsByCompetitionId({ competitionId: competitionId });
        sideBetsQuery.subscribe(() => {
            this.$timeout(() => {
                this.sideBets = sideBetsQuery.vals();
            });
        });
    }

    public addSideBet() {
        var sideBet: SideBet = new SideBet();
        sideBet.competitionId = this.competition.id;
        this.sideBets.push(sideBet);
    }

    public saveSideBets() {
        SidebetsService.instance().updateSideBets(this.sideBets, NotificationService.instance().getStandardCallback());
    }
}
smallstack.angular.app.controller("CompetitionAdministrationController", CompetitionAdministrationController);



smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setControllerName("CompetitionAdministrationController")
    .setRoute("/competition/:competitionName/admin")
    .setRequiresAuthentication(true)
    .setTemplateUrl("client/views/competitions/admin/competition.admin.ng.html")
    .setVisible(false)
    .setStateName("website.competitionAdmin")
    .setSubstateOfNamed("website.competitions")
);
