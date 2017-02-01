import { serverInit } from "smallstack";
import { createDatalayerCollections, registerDatalayerServices } from "smallstack-datalayer";

serverInit();
createDatalayerCollections();
registerDatalayerServices();
