import { IOC } from "smallstack";
import { GeneratedEmailTemplatesService } from "../generated/services/GeneratedEmailTemplatesService";

export class EmailTemplatesService extends GeneratedEmailTemplatesService {

	/**
	 * If you want to you can implement your own service methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("emailTemplatesService", new EmailTemplatesService());
