import { Competition } from './../../models/Competition';
import { CompetitionRoundsService } from './../CompetitionRoundsService';
import { CompetitionTeamsService } from './../CompetitionTeamsService';
import { CompetitionMatchesService } from './../CompetitionMatchesService';
import { CompetitionsService } from '../../services/CompetitionsService';

export class AbstractCompetitionSyncer {

    protected competitionsService: CompetitionsService;
    protected competitionMatchesService: CompetitionMatchesService;
    protected competitionTeamsService: CompetitionTeamsService;
    protected competitionRoundsService: CompetitionRoundsService;

    constructor() {
        this.competitionsService = CompetitionsService.instance();
        this.competitionMatchesService = CompetitionMatchesService.instance();
        this.competitionTeamsService = CompetitionTeamsService.instance();
        this.competitionRoundsService = CompetitionRoundsService.instance();
    }

    protected getCompetitionById(competitionId: string) {
        var competition: Competition = this.competitionsService.getCompetitionById<Competition>({ id: competitionId }).val(0);
        if (!competition)
            throw new Error("Could not find competition with id: " + competitionId);
        return competition;
    }

}
