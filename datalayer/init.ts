/**
 * THIS FILE IS AUTOGENERATED
 */

import { IOC } from "@smallstack/core";

import { BetgroupsService } from "./services/BetgroupsService";
import { BetsService } from "./services/BetsService";
import { CompetitionMatchesService } from "./services/CompetitionMatchesService";
import { CompetitionRoundsService } from "./services/CompetitionRoundsService";
import { CompetitionTeamsService } from "./services/CompetitionTeamsService";
import { CompetitionsService } from "./services/CompetitionsService";
import { DevicesService } from "./services/DevicesService";

import { BetgroupsCollection } from "./collections/BetgroupsCollection";
import { BetsCollection } from "./collections/BetsCollection";
import { CompetitionMatchesCollection } from "./collections/CompetitionMatchesCollection";
import { CompetitionRoundsCollection } from "./collections/CompetitionRoundsCollection";
import { CompetitionTeamsCollection } from "./collections/CompetitionTeamsCollection";
import { CompetitionsCollection } from "./collections/CompetitionsCollection";
import { DevicesCollection } from "./collections/DevicesCollection";



export function registerDatalayerServices() {
    IOC.onRegister("dataBridge", () => {
        IOC.onRegister("collectionsService", () => {
          IOC.instance().register("betgroupsService", new BetgroupsService());
          IOC.instance().register("betsService", new BetsService());
          IOC.instance().register("competitionMatchesService", new CompetitionMatchesService());
          IOC.instance().register("competitionRoundsService", new CompetitionRoundsService());
          IOC.instance().register("competitionTeamsService", new CompetitionTeamsService());
          IOC.instance().register("competitionsService", new CompetitionsService());
          IOC.instance().register("devicesService", new DevicesService());

        });
    });
}

export function createDatalayerCollections() {
    IOC.onRegister("dataBridge", () => {
        IOC.onRegister("collectionsService", () => {
          new BetgroupsCollection();
          new BetsCollection();
          new CompetitionMatchesCollection();
          new CompetitionRoundsCollection();
          new CompetitionTeamsCollection();
          new CompetitionsCollection();
          new DevicesCollection();

        });
    });
}