import { serverInit, MeteorBaseCollection } from "smallstack";
import { createDatalayerCollections, registerDatalayerServices } from "smallstack-datalayer";

serverInit();
createDatalayerCollections();
registerDatalayerServices();
