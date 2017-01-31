import { IOC } from "smallstack";
import { GeneratedMessage } from "../generated/models/GeneratedMessage";

export class Message extends GeneratedMessage {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("Message", Message);
