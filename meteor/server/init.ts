import { initServer, Logger } from "@smallstack/core";
import { initMeteorShared, initMeteorServer } from "@smallstack/meteor";
import { MeteorBaseCollection, createDefaultAdministrator } from "@smallstack/meteor";
import { createDatalayerCollections, registerDatalayerServices, initializeTypesystem } from "@smallstack/datalayer";

initializeTypesystem();
initMeteorShared();
initServer();
initMeteorServer();

createDatalayerCollections();
registerDatalayerServices();
createDefaultAdministrator();


