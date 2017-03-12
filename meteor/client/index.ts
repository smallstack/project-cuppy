
import "./imports/initClient";
import { initClient, startClient } from "./imports/initClient";

import { AppComponent } from "./imports/app/AppComponent";
import { HomeComponent } from "./imports/home/HomeComponent";

initClient();

// include backoffices and other components
import "./imports/login/LoginComponent";
import "./imports/logout/LogoutComponent";
import "./imports/competition-create/CreateCompetitionComponent";
import "./imports/competition/CompetitionComponent";
import "./imports/competition-admin/CompetitionAdminComponent";


startClient(AppComponent, [HomeComponent]);

