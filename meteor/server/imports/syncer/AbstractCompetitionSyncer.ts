import { Competition, CompetitionsService, CompetitionMatchesService, CompetitionTeamsService, CompetitionRoundsService } from '@smallstack/datalayer';

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
        var competition: Competition = this.competitionsService.getCompetitionById({ id: competitionId }).getModel(0);
        if (!competition)
            throw new Error("Could not find competition with id: " + competitionId);
        return competition;
    }

}
