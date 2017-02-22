import { LocalizationService, IOC } from "@smallstack/core";

IOC.onRegister("localizationService", (localizationService: LocalizationService) => {

    localizationService.addTranslation("de", {
        "navigation": {
            "home": "Home",
            "news": "Neuigkeiten",
            "rules": "Regeln",
            "newcompetition": "Neues Turnier",
            "competitions": "Turniere",
            "mycompetitions": "Meine Turniere",
            "competitionTeams": "Teams",
            "newcompetitionTeam": "Neues Team",
            "login": "Anmelden",
            "register": "Registrieren",
            "devices": "Geräte"
        },
        "application": {
            "title": "Cuppy"
        },
        "account": {
            "notloggedin": "Benutzer nicht eingeloggt",
            "notverified": "E-Mail Adresse wurde noch nicht bestätigt",
            "login": "Anmelden",
            "signup": "Benutzer erstellen",
            "profile": "Profil",
            "successfullyloggedout": "Erfolgreich abgemeldet"
        },
        "common": {
            "name": "Name",
            "details": "Details",
            "description": "Beschreibung",
            "create": "Erstellen",
            "id": "ID",
            "save": "Speichern",
            "edit": "Bearbeiten",
            "help": "Hilfe",
            "language": "Sprache",
            "statistics": "Statistiken",
            "filter": "Filter",
            "back": "Zurück"
        },
        "facebook": {
            "mybet": "Meine Wette",
            "result": "Resultat"
        },
        "betgroups": {
            "title": "Wettgruppen",
            "createnew": "Neue Wettgruppe erstellen",
            "add": "Spieler zu Wettgruppe hinzufügen",
            "groupname": "Gruppenname",
            "groupdescription": "Gruppenbeschreibung",
            "groupprices": "Gruppenpreise",
            "betgroupalreadyexists": "Eine Gruppe mit dem Namen existiert bereits!",
            "groupforcompetition": "Bet Group Competition",
            "selectbetgroup": "Wettgruppe auswählen"
        },
        "errors": {
            "couldnotplacebet": "Wette konnte nicht plaziert werden",
            "matchnotbetable": "Du kannst nicht auf dieses Spiel wetten!",
            "norankingyet": "Es sieht so aus als ob noch niemand weder eine Wette gewonnen oder verloren hat, du könntest der erste sein!"
        },
        "competition": {
            "title": "Wettbewerbe",
            "type": "Wettbewerbstyp",
            "updatecompetition": "Wettbewerb aktualisieren",
            "specialbets": "Spezialwetten",
            "points": "Punkte",
            "createCompetition": "Wettbewerb erstellen",
            "upcomingmatches": "Nächste Spiele",
            "names": {
                "wc": "Weltmeisterschaft",
                "ec": "Europa Meisterschaft",
                "cl": "Champions League",
                "worldcup2014": "Weltmeisterschaft 2014",
                "bundesliga": "Bundesliga",
                "2ndbundesliga": "2. Bundesliga",
                "testliga": "Test Liga"
            },
            "bets": "Wetten",
            "players": "Spieler",
            "matches": "Spiele",
            "allmatches": "Alle Spiele",
            "finished": "Beendet",
            "showmatches": "Spiele anzeigen",
            "showranking": "Rangliste anzeigen",
            "showspecialbets": "Spezialwetten anzeigen",
            "showcompetitions": "Wettbewerbe anzeigen",
            "rounds": {
                "current": "Aktuelle Runde",
                "groupphase": "Gruppenphase",
                "groupphase1": "Gruppenphase I",
                "groupphase2": "Gruppenphase II",
                "groupphase3": "Gruppenphase III",
                "preliminaryround": "Vorrunde",
                "last16": "Achtelfinale",
                "quarterfinals": "Viertelfinale",
                "semifinals": "Halbfinale",
                "thirdplaceplayoff": "Spiel um Platz 3",
                "final": "Finale",
            },
            "matchday": "Spieltag",
            "table": "Tabelle",
            "types": {
                "tournament": "Turnier",
                "league": "Liga",
                "quickMatch": "Schnelles Spiel"
            },
            "typedescriptions": {
                "tournament": "Turniere können eine Gruppenphase haben und enden mit einem Finale. Die Gruppenphase und die Anzahl der Finalrunden ist konfigurierbar. Beispiele: Weltmeisterschaft, Europameisterschaft, Champions League usw.",
                "league": "Eine Liga ist ein 1 gegen 1 Turnier welches über Spieltage gruppiert ist. Beispiele: Bundesliga, Premier League, 2. Bundesliga usw.",
                "quickMatch": "Schnelles Spiel zwischen 2 Teams, keine Tabelle usw., nur Spaß!"
            }
        },
        "teams": {
            "algeria": "Algerien",
            "argentina": "Argentinien",
            "australia": "Australien",
            "austria": "Österreich",
            "belgium": "Belgien",
            "bosniaherzegovina": "Bosnien und Herzegowina",
            "brazil": "Brasilien",
            "chile": "Chile",
            "czech": "Tschechien",
            "czech_republic": "Tschechien",
            "costarica": "Costa Rica",
            "germany": "Deutschland",
            "ecuador": "Ecuador",
            "cotedivoire": "Elfenbeinküste",
            "england": "England",
            "france": "Frankreich",
            "ghana": "Ghana",
            "greece": "Griechenland",
            "honduras": "Honduras",
            "iran": "Iran",
            "irland": "Irland",
            "italy": "Italien",
            "japan": "Japan",
            "cameroon": "Kamerun",
            "colombia": "Kolumbien",
            "croatia": "Kroatien",
            "mexico": "Mexiko",
            "netherlands": "Holland",
            "nigeria": "Nigeria",
            "portugal": "Portugal",
            "russia": "Russland",
            "switzerland": "Schweiz",
            "spain": "Spanien",
            "serbia": "Serbien",
            "southkorea": "Süd Korea",
            "uruguay": "Uruguai",
            "usa": "USA",
            "sweden": "Schweden",
            "romania": "Rumänien",
            "wales": "Wales",
            "slovakia": "Slovakai",
            "northern_ireland": "Nordirland",
            "turkey": "Türkei",
            "poland": "Polen",
            "ukraine": "Ukraine",
            "republic_of_ireland": "Irland",
            "hungary": "Ungarn",
            "iceland": "Island",
            "albania": "Albanien"
        }
    });
});
