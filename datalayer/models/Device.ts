import { IOC } from "@smallstack/core";
import { GeneratedDevice } from "../generated/models/GeneratedDevice";

export class Device extends GeneratedDevice {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("Device", Device);
