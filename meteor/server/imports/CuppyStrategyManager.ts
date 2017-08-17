

import { ICompetitionSyncer } from "./syncer/ICompetitionSyncer";
import { IScoreStrategy } from "./scoreStrategies/IScoreStrategy";
import { ICompetitionType } from "./competitionTypes/ICompetitionType";

export class CuppyStrategyManager {

    private syncers: { [name: string]: ICompetitionSyncer } = {};
    private scoreStrategies: { [name: string]: IScoreStrategy } = {};
    private competitionTypes: { [name: string]: ICompetitionType } = {};

    public addSyncer(name: string, instance: ICompetitionSyncer) {
        this.syncers[name] = instance;
    }

    public getSyncer(name: string): ICompetitionSyncer {
        return this.syncers[name];
    }

    public addScoreStrategy(name: string, instance: IScoreStrategy) {
        this.scoreStrategies[name] = instance;
    }

    public getScoreStrategy(name: string): IScoreStrategy {
        return this.scoreStrategies[name];
    }

    public addCompetitionType(name: string, instance: ICompetitionType) {
        this.competitionTypes[name] = instance;
    }

    public getCompetitionType(name: string): ICompetitionType {
        return this.competitionTypes[name];
    }
}