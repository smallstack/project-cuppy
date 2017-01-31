import { IOC } from "smallstack";
import { GeneratedNews } from "../generated/models/GeneratedNews";

export class News extends GeneratedNews {

	/**
	 * If you want to you can implement your own model methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("News", News);
