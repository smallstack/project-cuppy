import { LocalizationService, IOC } from "@smallstack/core";

IOC.onRegister("localizationService", (localizationService: LocalizationService) => {
    localizationService.addTranslation("en", {
        "navigation": {
            "home": "Home",
            "rules": "Rules",
            "newcompetition": "New Competition",
            "competitions": "Competitions",
            "mycompetitions": "My Competitions",
            "competitionTeams": "Teams",
            "newcompetitionTeam": "New Team",
            "login": "Login",
            "logout": "Logout",
            "register": "Register",
            "devices": "Devices"
        },
        "application": {
            "title": "Cuppy"
        },
        "account": {
            "notloggedin": "Usernotloggedin",
            "notverified": "E-Mailaddressnotverifiedyet",
            "login": "Login",
            "signup": "Sign Up",
            "profile": "Profile",
            "successfullyloggedout": "Successfully logged out"
        },
        "common": {
            "name": "Name",
            "details": "Details",
            "description": "Description",
            "create": "Create",
            "id": "ID",
            "save": "Save",
            "edit": "Edit",
            "help": "Help",
            "language": "Language",
            "statistics": "Statistics",
            "filter": "Filter",
            "back": "Back"
        },
        "facebook": {
            "mybet": "My Bet",
            "result": "Result"
        },
        "betgroups": {
            "title": "Bet Groups",
            "createnew": "Create new Bet Group",
            "add": "Adding Player to Bet Group",
            "groupname": "Group Name",
            "groupdescription": "Group Description",
            "groupprices": "Group Prices",
            "betgroupalreadyexists": "A Bet Group with this name already exists!",
            "groupforcompetition": "Bet Group Competition",
            "selectbetgroup": "Select Bet Group"
        },
        "errors": {
            "couldnotplacebet": "Could not place bet!",
            "matchnotbetable": "You cannot place a bet on this match!",
            "norankingyet": "Seems like nobody won or lost a bet yet in this competition, you could be the first!"
        },
        "competition": {
            "title": "Look at these Awesome Competitions",
            "type": "Competition Type",
            "name": "Competition Name",
            "updatecompetition": "Update Competition",
            "specialbets": "Special Bets",
            "points": "Points",
            "createCompetition": "Create Competition",
            "upcomingmatches": "Upcoming Matches",
            "names": {
                "wc": "World Cup",
                "ec": "European Cup",
                "cl": "Champions League",
                "bundesliga": "German Bundesliga",
                "2ndbundesliga": "German 2nd Bundesliga",
                "testliga": "Test Liga"
            },
            "bets": "Bets",
            "players": "Players",
            "matches": "Matches",
            "allmatches": "All Matches",
            "finished": "Finished",
            "showmatches": "Show Matches",
            "showranking": "Show Ranking",
            "showspecialbets": "Show Special Bets",
            "showcompetitions": "Show Competitions",
            "rounds": {
                "current": "Current Round",
                "groupphase": "Group Phase",
                "groupphase1": "Group Phase I",
                "groupphase2": "Group Phase II",
                "groupphase3": "Group Phase III",
                "preliminaryround": "Preliminary Round",
                "last16": "Last 16",
                "quarterfinals": "Quarter Finals",
                "semifinals": "Semi Finals",
                "thirdplaceplayoff": "Third Place Play-Off",
                "final": "Final"
            },
            "matchday": "Matchday",
            "table": "Table",
            "errors": {
                "nomatches": "No matches found",
                "notfound": "Competition could not be found"
            },
            "types": {
                "tournament": "Tournament",
                "league": "League",
                "quickMatch": "Quick Match"
            },
            "typedescriptions": {
                "tournament": "Tournaments can have a group stage and end up in a final. The Group Phase as well as how many finals will be played is configurable! Examples: World Cup, European Cup, Champions League, etc.",
                "league": "A league competition is basically a 1on1 between all teams, grouped by matchdays. Examples: Bundesliga, Premier League, 2nd Bundesliga, etc.",
                "quickMatch": "Quick match between two teams, no fixtures, just fun!"
            },
            "tips": {
                "competitionname": "Tip: You can change the name at any time!",
                "competitiontype": "Please select the type of your new competition. The type defines, how the matches are arranged in your tournament, how points are calculated etc. You can also change this at any time!",
                "datasync": "For public tournaments like e.g. the Soccer World Cup you can choose an external service that syncs teams, groups, results. etc. If you'd like to do that on your own then you can select 'manual'!",
                "manualsync": "Here you have full control over the tournament. You can setup groups, teams, matches etc.!"
            }
        },
        "teams": {
            "algeria": "Algeria",
            "argentina": "Argentina",
            "australia": "Australia",
            "austria": "Austria",
            "belgium": "Belgium",
            "bosniaherzegovina": "Bosnia and Herzegovina",
            "brazil": "Brazil",
            "chile": "Chile",
            "czech": "Czech Republic",
            "czech_republic": "Czech Republic",
            "costarica": "Costa Rica",
            "germany": "Germany",
            "ecuador": "Ecuador",
            "cotedivoire": "Ivory Coast",
            "england": "England",
            "france": "France",
            "ghana": "Ghana",
            "greece": "Greece",
            "honduras": "Honduras",
            "iran": "Iran",
            "irland": "Irland",
            "italy": "Italy",
            "japan": "Japan",
            "cameroon": "Cameroon",
            "colombia": "Colombia",
            "croatia": "Croatia",
            "mexico": "Mexico",
            "netherlands": "Netherlands",
            "nigeria": "Nigeria",
            "portugal": "Portugal",
            "russia": "Russia",
            "switzerland": "Switzerland",
            "spain": "Spain",
            "serbia": "Serbia",
            "southkorea": "Southkorea",
            "uruguay": "Uruguay",
            "usa": "USA",
            "sweden": "Sweden",
            "romania": "Romania",
            "wales": "Wales",
            "slovakia": "Slovakia",
            "northern_ireland": "Northern Ireland",
            "turkey": "Turkey",
            "poland": "Poland",
            "ukraine": "Ukraine",
            "republic_of_ireland": "Republic of Ireland",
            "hungary": "Hungary",
            "iceland": "Iceland",
            "albania": "Albania"
        }
    });
});
