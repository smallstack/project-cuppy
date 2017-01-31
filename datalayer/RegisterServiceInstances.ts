import { IOC } from "smallstack";

import { EmailService } from "./services/EmailService";
import { EmailTemplatesService } from "./services/EmailTemplatesService";
import { MessagesService } from "./services/MessagesService";
import { NewsService } from "./services/NewsService";




IOC.instance().register("emailService", new EmailService());
IOC.instance().register("emailTemplatesService", new EmailTemplatesService());
IOC.instance().register("messagesService", new MessagesService());
IOC.instance().register("newsService", new NewsService());

