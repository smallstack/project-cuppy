/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * THIS FILE IS AUTO-GENERATED AND WILL BE REPLACED ON ANY RE-GENERATION
 */


Meteor.methods({
    "server-counts": function(queryName: string, parameters:any) {
        Utils.check(queryName, String, "queryName");

        switch (queryName) {
            case "getPageById":
                return smallstack.collections["pages"].find({"_id": parameters.id }).count();
                        
            case "getAllPages":
                return smallstack.collections["pages"].find({}).count();
                        
            case "getPageByName":
                return smallstack.collections["pages"].find({"name": parameters.name }).count();
                        
            case "getConfiguration":
                return smallstack.collections["configuration"].find({"scope":"everywhere"}).count();
                        
            case "getAllMails":
                return smallstack.collections["emails"].find({}).count();
                        
            case "getAllTemplates":
                return smallstack.collections["emailtemplates"].find({}).count();
                        
            case "getAllLanguages":
                return smallstack.collections["languages"].find({}).count();
                        
            case "getLanguageByKey":
                return smallstack.collections["languages"].find({"key": parameters.key }).count();
                        
            case "getLocalizationsForLanguage":
                return smallstack.collections["localizations"].find({"language": parameters.languageKey }).count();
                        
            case "getLocalizationForLanguage":
                return smallstack.collections["localizations"].find({"key": parameters.key ,"language": parameters.languageKey }).count();
                        
            case "getLocalizations":
                return smallstack.collections["localizations"].find({}).count();
                        
            case "getLocalizedTextsByIds":
                return smallstack.collections["localizations"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getLocalizedTextById":
                return smallstack.collections["localizations"].find({"_id": parameters.id }).count();
                        
            case "getMediaFormatByName":
                return smallstack.collections["mediaformats"].find({"name": parameters.name }).count();
                        
            case "getAllMediaFormats":
                return smallstack.collections["mediaformats"].find({}).count();
                        
            case "getMediaFormatsByIds":
                return smallstack.collections["mediaformats"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getMediaFormatById":
                return smallstack.collections["mediaformats"].find({"_id": parameters.id }).count();
                        
            case "getMediaByIds":
                return smallstack.collections["medias"].find({"_id":{"$in": parameters.ids },"ownerId":this.userId}).count();
                        
            case "getMediaById":
                return smallstack.collections["medias"].find({"_id": parameters.id }).count();
                        
            case "getAllMedias":
                return smallstack.collections["medias"].find({}).count();
                        
            case "getMediasByTag":
                return smallstack.collections["medias"].find({"tags": parameters.tag }).count();
                        
            case "getMyMessages":
                return smallstack.collections["messages"].find({"participantIds":this.userId}).count();
                        
            case "getMyMessagesWithUser":
                return smallstack.collections["messages"].find({"participantIds":[ parameters.userId ,this.userId]}).count();
                        
            case "getNavigationForType":
                return smallstack.collections["navigation"].find({"type": parameters.type }).count();
                        
            case "getNavigationEntryById":
                return smallstack.collections["navigation"].find({"_id": parameters.id }).count();
                        
            case "getAllNews":
                return smallstack.collections["news"].find({}).count();
                        
            case "getAllUnreadNews":
                return smallstack.collections["news"].find({"seenByIds":{"$nin":[this.userId]}}).count();
                        
            case "getAllPushNotifications":
                return smallstack.collections["pushnotifications"].find({}).count();
                        
            case "getRoleByName":
                return smallstack.collections["roles"].find({"name": parameters.name }).count();
                        
            case "getRoleById":
                return smallstack.collections["roles"].find({"_id": parameters.id }).count();
                        
            case "getRolesByIds":
                return smallstack.collections["roles"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getAllRoles":
                return smallstack.collections["roles"].find({}).count();
                        
            case "getUsersByIds":
                return smallstack.collections["users"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getUserById":
                return smallstack.collections["users"].find({"_id": parameters.id }).count();
                        
            case "getAllUsers":
                return smallstack.collections["users"].find({}).count();
                        
            case "getMyUser":
                return smallstack.collections["users"].find({"_id":this.userId}).count();
                        
            case "getBetgroupsByIds":
                return smallstack.collections["betgroups"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getBetById":
                return smallstack.collections["bets"].find({"_id": parameters.id }).count();
                        
            case "getBetsByIds":
                return smallstack.collections["bets"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getBetsForCompetitionId":
                return smallstack.collections["bets"].find({"competitionId": parameters.competitionId }).count();
                        
            case "getBetsForCompetitionAndUserId":
                return smallstack.collections["bets"].find({"competitionId": parameters.competitionId ,"ownerId": parameters.userId }).count();
                        
            case "getBetsForMatchAndUserId":
                return smallstack.collections["bets"].find({"matchId": parameters.matchId ,"ownerId": parameters.userId }).count();
                        
            case "getBetsForMatchId":
                return smallstack.collections["bets"].find({"matchId": parameters.matchId }).count();
                        
            case "getCompetitionMatchesByIds":
                return smallstack.collections["competitionMatches"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getCompetitionMatchById":
                return smallstack.collections["competitionMatches"].find({"_id": parameters.id }).count();
                        
            case "getCompetitionMatchByIndex":
                return smallstack.collections["competitionMatches"].find({"index": parameters.index }).count();
                        
            case "getMatchesForCompetitionId":
                return smallstack.collections["competitionMatches"].find({"competitionId": parameters.competitionId }).count();
                        
            case "getMatchesForCompetitionAndRound":
                return smallstack.collections["competitionMatches"].find({"competitionId": parameters.competitionId ,"roundId": parameters.roundId }).count();
                        
            case "getMatchesForTeam":
                return smallstack.collections["competitionMatches"].find({"teamIds":{"$in":[ parameters.competitionTeamId ]}}).count();
                        
            case "getMatchesForCompetitionAndTeam":
                return smallstack.collections["competitionMatches"].find({"teamIds":{"$in":[ parameters.competitionTeamId ]},"competitionId": parameters.competitionId }).count();
                        
            case "getMatchesForCompetitionAndTeamsAndDate":
                return smallstack.collections["competitionMatches"].find({"teamIds":{"$all":[ parameters.teamAId , parameters.teamBId ]},"date": parameters.date ,"competitionId": parameters.competitionId }).count();
                        
            case "getCompetitionRoundById":
                return smallstack.collections["competitionRounds"].find({"_id": parameters.id }).count();
                        
            case "getCompetitionRoundsByIds":
                return smallstack.collections["competitionRounds"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getAllRoundsForCompetitionId":
                return smallstack.collections["competitionRounds"].find({"competitionId": parameters.competitionId }).count();
                        
            case "getCompetitionTeamById":
                return smallstack.collections["competitionTeams"].find({"_id": parameters.id }).count();
                        
            case "getCompetitionTeamsByIds":
                return smallstack.collections["competitionTeams"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getAllCompetitionTeams":
                return smallstack.collections["competitionTeams"].find({}).count();
                        
            case "getAllHumanTeams":
                return smallstack.collections["competitionTeams"].find({"linkedUserIds.0":{"$exists":true}}).count();
                        
            case "getTeamByName":
                return smallstack.collections["competitionTeams"].find({"name": parameters.teamName }).count();
                        
            case "getCompetitionById":
                return smallstack.collections["competitions"].find({"_id": parameters.id }).count();
                        
            case "getCompetitionsByIds":
                return smallstack.collections["competitions"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getAllCompetitions":
                return smallstack.collections["competitions"].find({}).count();
                        
            case "getCompetitionByName":
                return smallstack.collections["competitions"].find({"name": parameters.name }).count();
                        
            case "getMyCompetitions":
                return smallstack.collections["competitions"].find({"ownerId":this.userId}).count();
                        
            case "getDeviceById":
                return smallstack.collections["devices"].find({"_id": parameters.id ,"ownerId":this.userId}).count();
                        
            case "getDevicesByIds":
                return smallstack.collections["devices"].find({"_id":{"$in": parameters.ids },"ownerId":this.userId}).count();
                        
            case "getDeviceByDeviceId":
                return smallstack.collections["devices"].find({"deviceId": parameters.deviceId ,"ownerId":this.userId}).count();
                        
            case "getMyDevices":
                return smallstack.collections["devices"].find({"ownerId":this.userId}).count();
                        
            case "getSideBetById":
                return smallstack.collections["sidebets"].find({"_id": parameters.id }).count();
                        
            case "getSidebetsByIds":
                return smallstack.collections["sidebets"].find({"_id":{"$in": parameters.ids }}).count();
                        
            case "getSideBetsByCompetitionId":
                return smallstack.collections["sidebets"].find({"competitionId": parameters.competitionId }).count();
                        
            case "getForSideBetAndUserId":
                return smallstack.collections["sidebetuserbets"].find({"sideBetId": parameters.sideBetId ,"ownerId": parameters.userId }).count();
                        
            case "getForUserId":
                return smallstack.collections["sidebetuserbets"].find({"ownerId": parameters.userId }).count();
                        
            case "getForCompetitionId":
                return smallstack.collections["sidebetuserbets"].find({"competitionId": parameters.competitionId }).count();
                        
            
        }
    }
});
