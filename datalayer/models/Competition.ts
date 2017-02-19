import { CompetitionMatch } from './CompetitionMatch';
import { DefaultCompetitionService } from './../services/DefaultCompetitionService';
import { IOC, Autowired, NotificationService } from "@smallstack/core";
import { GeneratedCompetition } from "../generated/models/GeneratedCompetition";
import { CompetitionTeam } from "../models/CompetitionTeam";
import { CompetitionsService } from "../services/CompetitionsService";
import { CompetitionMatchesService } from "../services/CompetitionMatchesService";
import { ICompetitionService } from "../services/ICompetitionService";

export class Competition extends GeneratedCompetition {

    @Autowired()
    private competitionsService: CompetitionsService;

    @Autowired()
    private competitionMatchesService: CompetitionMatchesService;

    // public triggerTournamentUpdate() {
    // 	CompetitionsService.instance().triggerTournamentUpdate(this.id, function (error: Meteor.Error, result: any) {
    // 		if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not trigger tournament update!");
    // 	});
    // }

    public getWildcards() {
        if (this.type === Competition.enums.type.LEAGUE)
            return this.teamIds.length % 2;
        if (this.type === Competition.enums.type.TOURNAMENT)
            return this.competitionsService.getTournamentWildcardCount(this.teamIds.length);
    }

    public startCompetition() {
        this.competitionsService.startCompetition(this.id, (error: Error, result: boolean) => {
            if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not start competition!");
            else NotificationService.instance().notification.success("Competition started!");
        });
    }

    public restartCompetition() {
        var that = this;
        NotificationService.instance().popup.confirmation("Restart Competition?", "Do you really want to restart the competition? All matches, bets etc. will be lost!", function (answer: boolean) {
            if (answer) {
                that.competitionsService.startCompetition(that.id, (error: Error, result: boolean) => {
                    if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not start competition!");
                    else NotificationService.instance().notification.success("Competition started!");
                });
            }
        });
    }

    public addTeam(team: CompetitionTeam) {
        var that = this;
        if (this.started) {
            if (this.type !== Competition.enums.type.LEAGUE)
                NotificationService.instance().popup.error("After a competition is started, you can only add teams to league competitions!");
            else {
                NotificationService.instance().popup.confirmation("Add team to running competition?", "The competition is already started, do you really want to add team '" + team.name + "'?", function (answer: boolean) {
                    if (answer)
                        CompetitionsService.instance().addTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not add Team!", "Successfully added Team!"));
                });
            }
        }
        else
            CompetitionsService.instance().addTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not add Team!", "Successfully added Team!"));
    }

    public removeTeam(team: CompetitionTeam) {
        var that = this;
        if (this.started) {
            if (this.type !== Competition.enums.type.LEAGUE)
                NotificationService.instance().popup.error("After a competition is started, you can only remove teams from league competitions!");
            else {
                NotificationService.instance().popup.confirmation("yah", "The competition is already started, do you really want to remove team '" + team.name + "'? This would result in deleting all matches that the team has already played!", function (answer: boolean) {
                    if (answer)
                        CompetitionsService.instance().removeTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not remove Team!", "Successfully removed Team!"));

                });
            }
        }
        else
            CompetitionsService.instance().removeTeam(that.id, team.id, NotificationService.instance().getStandardCallback("Could not remove Team!", "Successfully removed Team!"));
    }

    public getCompetitionService(): ICompetitionService {
        if (this.dataBridge.isClient())
            throw new Error("CompetitionsServices are only available on the server!");

        switch (this.type) {
            case Competition.enums.type.TOURNAMENT:
                return new DefaultCompetitionService();
            case Competition.enums.type.LEAGUE:
                return new DefaultCompetitionService();
        }
    }

    public isAdministrator(userId: string): boolean {
        return this.administratorIds.indexOf(userId) !== -1;
    }
/*
    public getNextMatch(currentMatchIndex: number, callback: (competitionMatch: CompetitionMatch) => void): void {
        this.competitionMatchesService.getCompetitionMatchByIndex({ index: (currentMatchIndex + 1) }).subscribe((cursor: Mongo.Cursor<CompetitionMatch>) => {
            let match: CompetitionMatch = cursor.fetch()[0];
            callback(match);
        });
    }

    public getPreviousMatch(currentMatchIndex: number, callback: (competitionMatch: CompetitionMatch) => void): void {
        this.competitionMatchesService.getCompetitionMatchByIndex({ index: (currentMatchIndex - 1) }).subscribe((cursor: Mongo.Cursor<CompetitionMatch>) => {
            let match: CompetitionMatch = cursor.fetch()[0];
            callback(match);
        });
    }*/

}

IOC.register("Competition", Competition);
