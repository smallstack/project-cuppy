import { Competition } from "@smallstack/datalayer";

export interface ICompetitionType {
    createRoundsAndMatches(competition: Competition): void;
}