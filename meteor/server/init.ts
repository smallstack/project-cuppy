import { Logger } from "@smallstack/core-common";
import { initServer } from "@smallstack/core-server";
import { initMeteorServer } from "@smallstack/meteor-server";
import { initMeteorShared, MeteorBaseCollection } from "@smallstack/meteor-common";
import { createDefaultAdministrator } from "@smallstack/meteor-server";
import { createDatalayerCollections, registerDatalayerServices, initializeTypesystem } from "@smallstack/datalayer";

initializeTypesystem();
initMeteorShared();
initServer();
initMeteorServer();

createDatalayerCollections();
registerDatalayerServices();
createDefaultAdministrator();


