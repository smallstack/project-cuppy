import { IOC } from "smallstack";
import { GeneratedEmailService } from "../generated/services/GeneratedEmailService";

export class EmailService extends GeneratedEmailService {

	/**
	 * If you want to you can implement your own service methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("emailService", new EmailService());
