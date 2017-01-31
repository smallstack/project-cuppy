import { IOC } from "smallstack";
import { GeneratedNewsService } from "../generated/services/GeneratedNewsService";

export class NewsService extends GeneratedNewsService {

	/**
	 * If you want to you can implement your own service methods here. 
	 * This file only gets generated once and will not get overwritten!
	 * 
	 * You can force overwriting this file by 'smallstack generate --forcedGeneration'
	 */

}

IOC.register("newsService", new NewsService());
