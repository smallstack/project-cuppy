import { IOC } from "smallstack";
import { GeneratedMessagesService } from "../generated/services/GeneratedMessagesService";

export class MessagesService extends GeneratedMessagesService {

	/**
	 * If you want to you can implement your own service methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("messagesService", new MessagesService());
