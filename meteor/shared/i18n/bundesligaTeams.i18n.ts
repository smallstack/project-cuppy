import { LocalizationService, IOC } from "@smallstack/core";

IOC.onRegister("localizationService", (localizationService: LocalizationService) => {

    var buliTeams = {
        "teams": {
            "1fckaiserslautern": "1. FC Kaiserslautern",
            "vflbochum": "VfL Bochum",
            "hannover96": "Hannover 96",
            "svsandhausen": "SV Sandhausen",
            "1fcunionberlin": "1. FC Union Berlin",
            "dynamodresden": "Dynamo Dresden",
            "1fcnuernberg": "1. FC Nürnberg",
            "fortunaduesseldorf": "Fortuna Düsseldorf",
            "spvgggreutherfuerth": "SpVgg Greuther Fürth",
            "tsv1860muenchen": "TSV 1860 München",
            "1fcheidenheim1846": "1. FC Heidenheim 1846",
            "erzgebirgeaue": "Erzgebirge Aue",
            "arminiabielefeld": "Armina Bielefeld",
            "karlsruhersc": "Karlsruher SC",
            "eintrachtbraunschweig": "Eintracht Braunschweig",
            "wuerzburgerkickers": "Würzburger Kickers",
            "vfbstuttgart": "VfB Stuttgart",
            "fcstpauli": "FC St. Pauli",
            "fcbayernmuenchen": "FC Bayern München",
            "werderbremen": "SV Werder Bremen",
            "borussiadortmund": "Borussia Dortmund",
            "1fsvmainz05": "1. FSV Mainz 05",
            "1fckoeln": "1. FC Köln",
            "svdarmstadt98": "SV Darmstadt 98",
            "fcaugsburg": "FC Augsburg",
            "vflwolfsburg": "VfL Wolfsburg",
            "hamburgersv": "Hamburger SV",
            "fcingolstadt04": "FC Ingolstadt 04",
            "eintrachtfrankfurt": "Eintracht Frankfurt",
            "fcschalke04": "FC Schalke 04",
            "bormoenchengladbach": "Borussia Mönchengladbach",
            "bayerleverkusen": "Bayer 04 Leverkusen",
            "herthabsc": "Hertha BSC",
            "scfreiburg": "SC Freiburg",
            "tsg1899hoffenheim": "TSG 1899 Hoffenheim",
            "redbullleipzig": "RB Leipzig"
        }
    };

    localizationService.addTranslation("de", buliTeams);
    localizationService.addTranslation("en", buliTeams);

});