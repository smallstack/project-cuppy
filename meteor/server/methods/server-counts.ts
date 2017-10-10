// tslint:disable:object-literal-shorthand
// tslint:disable:only-arrow-functions

/**
 * THIS FILE IS AUTO-GENERATED AND WILL BE REPLACED ON ANY RE-GENERATION
 */

import { CollectionsService } from "@smallstack/core-common";
import {  Utils, IOC } from "@smallstack/common";

IOC.onRegister("collectionsService", (collectionsService: CollectionsService) => {

    Meteor.methods({
        "server-counts": function (data: { queryName: string, parameters: any}) {
            Utils.typeOfCheck(data.queryName, "string", "queryName");
            let parameters:any = data.parameters;

            switch (data.queryName) {
                case "getAllApps":
        return collectionsService.getCollectionByName("apps").find({}).count();
                            
                case "getAppById":
        return collectionsService.getCollectionByName("apps").find({"_id": parameters.id }).count();
                            
                case "getAppByIdentifier":
        return collectionsService.getCollectionByName("apps").find({"identifier": parameters.identifier }).count();
                            
                case "getAppSnapshots":
        return collectionsService.getCollectionByName("appsnapshots").find({"appId": parameters.appId }).count();
                            
                case "getLatestAppSnapshot":
        return collectionsService.getCollectionByName("appsnapshots").find({"appId": parameters.appId ,"public":true}).count();
                            
                case "getConfiguration":
        return collectionsService.getCollectionByName("configuration").find({"scope":"everywhere"}).count();
                            
                case "getCompleteConfiguration":
        return collectionsService.getCollectionByName("configuration").find({}).count();
                            
                case "getAllCountries":
        return collectionsService.getCollectionByName("countries").find({}).count();
                            
                case "getCountryByKey":
        return collectionsService.getCollectionByName("countries").find({"key": parameters.key }).count();
                            
                case "getAllCronjobs":
        return collectionsService.getCollectionByName("cronjobs").find({}).count();
                            
                case "getAllCurrencies":
        return collectionsService.getCollectionByName("currencies").find({}).count();
                            
                case "getCurrencyById":
        return collectionsService.getCollectionByName("currencies").find({"_id": parameters.id }).count();
                            
                case "getCurrenciesByIds":
        return collectionsService.getCollectionByName("currencies").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllMails":
        return collectionsService.getCollectionByName("emails").find({}).count();
                            
                case "getAllTemplates":
        return collectionsService.getCollectionByName("emailtemplates").find({}).count();
                            
                case "getFileById":
        return collectionsService.getCollectionByName("files").find({"_id": parameters.id }).count();
                            
                case "getFilesByIds":
        return collectionsService.getCollectionByName("files").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllFiles":
        return collectionsService.getCollectionByName("files").find({}).count();
                            
                case "getAllLanguages":
        return collectionsService.getCollectionByName("languages").find({}).count();
                            
                case "getLanguageByKey":
        return collectionsService.getCollectionByName("languages").find({"key": parameters.key }).count();
                            
                case "getLanguagesByIds":
        return collectionsService.getCollectionByName("languages").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getLocalizationsForLanguage":
        return collectionsService.getCollectionByName("localizations").find({"language": parameters.languageKey }).count();
                            
                case "getLocalizationForLanguage":
        return collectionsService.getCollectionByName("localizations").find({"key": parameters.key ,"language": parameters.languageKey }).count();
                            
                case "getLocalizations":
        return collectionsService.getCollectionByName("localizations").find({}).count();
                            
                case "getLocalizedTextsByIds":
        return collectionsService.getCollectionByName("localizations").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getLocalizedTextById":
        return collectionsService.getCollectionByName("localizations").find({"_id": parameters.id }).count();
                            
                case "getNavigationForType":
        return collectionsService.getCollectionByName("navigation").find({"type": parameters.type }).count();
                            
                case "getNavigationForTreeId":
        return collectionsService.getCollectionByName("navigation").find({"navigationTreeId": parameters.navigationTreeId }).count();
                            
                case "getNavigationEntryById":
        return collectionsService.getCollectionByName("navigation").find({"_id": parameters.id }).count();
                            
                case "getNavigationEntryByPageId":
        return collectionsService.getCollectionByName("navigation").find({"pageId": parameters.pageId }).count();
                            
                case "getNavigationTree":
        return collectionsService.getCollectionByName("navigationtrees").find({"identifier": parameters.identifier }).count();
                            
                case "getNavigationTreeById":
        return collectionsService.getCollectionByName("navigationtrees").find({"_id": parameters.id }).count();
                            
                case "getNavigationTreesByIds":
        return collectionsService.getCollectionByName("navigationtrees").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getNavigationTreesForTag":
        return collectionsService.getCollectionByName("navigationtrees").find({"tags": parameters.tag }).count();
                            
                case "getPageById":
        return collectionsService.getCollectionByName("pages").find({"_id": parameters.id }).count();
                            
                case "getPagesByIds":
        return collectionsService.getCollectionByName("pages").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllPages":
        return collectionsService.getCollectionByName("pages").find({}).count();
                            
                case "getPageByName":
        return collectionsService.getCollectionByName("pages").find({"name": parameters.name }).count();
                            
                case "getPageByIdentifier":
        return collectionsService.getCollectionByName("pages").find({"identifier": parameters.identifier }).count();
                            
                case "getAllProducts":
        return collectionsService.getCollectionByName("products").find({}).count();
                            
                case "getProducts":
        return collectionsService.getCollectionByName("products").find({}).count();
                            
                case "getProductsByIds":
        return collectionsService.getCollectionByName("products").find({"_id":{"$in": parameters.ids },"active":true}).count();
                            
                case "getProductById":
        return collectionsService.getCollectionByName("products").find({"_id": parameters.id }).count();
                            
                case "getAllPushNotifications":
        return collectionsService.getCollectionByName("pushnotifications").find({}).count();
                            
                case "getPushNotificationsByIds":
        return collectionsService.getCollectionByName("pushnotifications").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getRoleByName":
        return collectionsService.getCollectionByName("roles").find({"name": parameters.name }).count();
                            
                case "getRoleById":
        return collectionsService.getCollectionByName("roles").find({"_id": parameters.id }).count();
                            
                case "getRolesByIds":
        return collectionsService.getCollectionByName("roles").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllRoles":
        return collectionsService.getCollectionByName("roles").find({}).count();
                            
                case "getAllExecutions":
        return collectionsService.getCollectionByName("taskexecutions").find({}).count();
                            
                case "getTaskExecutionsByIds":
        return collectionsService.getCollectionByName("taskexecutions").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getTaskExecutionById":
        return collectionsService.getCollectionByName("taskexecutions").find({"_id": parameters.id }).count();
                            
                case "getTaskExecutionsForTaskId":
        return collectionsService.getCollectionByName("taskexecutions").find({"taskId": parameters.id }).count();
                            
                case "getRecentExecutions":
        return collectionsService.getCollectionByName("taskexecutions").find({}).count();
                            
                case "getAllTasks":
        return collectionsService.getCollectionByName("tasks").find({}).count();
                            
                case "getTaskByIdentifier":
        return collectionsService.getCollectionByName("tasks").find({"identifier": parameters.identifier }).count();
                            
                case "getTaskById":
        return collectionsService.getCollectionByName("tasks").find({"_id": parameters.id }).count();
                            
                case "getTasksByIds":
        return collectionsService.getCollectionByName("tasks").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getUsersByIds":
        return collectionsService.getCollectionByName("users").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getUserById":
        return collectionsService.getCollectionByName("users").find({"_id": parameters.id }).count();
                            
                case "getAllUsers":
        return collectionsService.getCollectionByName("users").find({}).count();
                            
                case "getFullUsers":
        return collectionsService.getCollectionByName("users").find({}).count();
                            
                case "getMyUser":
        return collectionsService.getCollectionByName("users").find({"_id":this.userId}).count();
                            
                case "getAllWorkflowActions":
        return collectionsService.getCollectionByName("workflowactions").find({}).count();
                            
                case "getWorkflowActionById":
        return collectionsService.getCollectionByName("workflowactions").find({"_id": parameters.id }).count();
                            
                case "getWorkflowActionsByIds":
        return collectionsService.getCollectionByName("workflowactions").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllWorkflowConditions":
        return collectionsService.getCollectionByName("workflowconditions").find({}).count();
                            
                case "getWorkflowConditionById":
        return collectionsService.getCollectionByName("workflowconditions").find({"_id": parameters.id }).count();
                            
                case "getWorkflowConditionsByIds":
        return collectionsService.getCollectionByName("workflowconditions").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllWorkflowEvents":
        return collectionsService.getCollectionByName("workflowevents").find({}).count();
                            
                case "getWorkflowEventById":
        return collectionsService.getCollectionByName("workflowevents").find({"_id": parameters.id }).count();
                            
                case "getWorkflowEventsByIds":
        return collectionsService.getCollectionByName("workflowevents").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllWorkflows":
        return collectionsService.getCollectionByName("workflows").find({}).count();
                            
                case "getWorkflowById":
        return collectionsService.getCollectionByName("workflows").find({"_id": parameters.id }).count();
                            
                case "getWorkflowsByIds":
        return collectionsService.getCollectionByName("workflows").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getMediaFormatByName":
        return collectionsService.getCollectionByName("mediaformats").find({"name": parameters.name }).count();
                            
                case "getAllMediaFormats":
        return collectionsService.getCollectionByName("mediaformats").find({}).count();
                            
                case "getMediaFormatsByIds":
        return collectionsService.getCollectionByName("mediaformats").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getMediaFormatById":
        return collectionsService.getCollectionByName("mediaformats").find({"_id": parameters.id }).count();
                            
                case "getMediaByIds":
        return collectionsService.getCollectionByName("medias").find({"_id":{"$in": parameters.ids },"ownerId":this.userId}).count();
                            
                case "getMediaById":
        return collectionsService.getCollectionByName("medias").find({"_id": parameters.id }).count();
                            
                case "getAllMedias":
        return collectionsService.getCollectionByName("medias").find({}).count();
                            
                case "getMediasByTag":
        return collectionsService.getCollectionByName("medias").find({"tags": parameters.tag }).count();
                            
                case "getBetgroupsByIds":
        return collectionsService.getCollectionByName("betgroups").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getBetById":
        return collectionsService.getCollectionByName("bets").find({"_id": parameters.id }).count();
                            
                case "getBetsByIds":
        return collectionsService.getCollectionByName("bets").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getBetsForCompetitionId":
        return collectionsService.getCollectionByName("bets").find({"competitionId": parameters.competitionId }).count();
                            
                case "getBetsForCompetitionAndUserId":
        return collectionsService.getCollectionByName("bets").find({"competitionId": parameters.competitionId ,"ownerId": parameters.userId }).count();
                            
                case "getBetsForMatchAndUserId":
        return collectionsService.getCollectionByName("bets").find({"matchId": parameters.matchId ,"ownerId": parameters.userId }).count();
                            
                case "getBetsForMatchId":
        return collectionsService.getCollectionByName("bets").find({"matchId": parameters.matchId }).count();
                            
                case "getCompetitionMatchesByIds":
        return collectionsService.getCollectionByName("competitionMatches").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getCompetitionMatchById":
        return collectionsService.getCollectionByName("competitionMatches").find({"_id": parameters.id }).count();
                            
                case "getCompetitionMatchByIndex":
        return collectionsService.getCollectionByName("competitionMatches").find({"index": parameters.index }).count();
                            
                case "getMatchesForCompetitionId":
        return collectionsService.getCollectionByName("competitionMatches").find({"competitionId": parameters.competitionId }).count();
                            
                case "getMatchesForCompetitionAndRound":
        return collectionsService.getCollectionByName("competitionMatches").find({"competitionId": parameters.competitionId ,"roundId": parameters.roundId }).count();
                            
                case "getMatchesForTeam":
        return collectionsService.getCollectionByName("competitionMatches").find({"teamIds":{"$in":[ parameters.competitionTeamId ]}}).count();
                            
                case "getMatchesForCompetitionAndTeam":
        return collectionsService.getCollectionByName("competitionMatches").find({"teamIds":{"$in":[ parameters.competitionTeamId ]},"competitionId": parameters.competitionId }).count();
                            
                case "getMatchesForCompetitionAndTeamsAndDate":
        return collectionsService.getCollectionByName("competitionMatches").find({"teamIds":{"$all":[ parameters.teamAId , parameters.teamBId ]},"date": parameters.date ,"competitionId": parameters.competitionId }).count();
                            
                case "getCompetitionRoundById":
        return collectionsService.getCollectionByName("competitionRounds").find({"_id": parameters.id }).count();
                            
                case "getCompetitionRoundsByIds":
        return collectionsService.getCollectionByName("competitionRounds").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllRoundsForCompetitionId":
        return collectionsService.getCollectionByName("competitionRounds").find({"competitionId": parameters.competitionId }).count();
                            
                case "getCompetitionTeamById":
        return collectionsService.getCollectionByName("competitionTeams").find({"_id": parameters.id }).count();
                            
                case "getCompetitionTeamsByIds":
        return collectionsService.getCollectionByName("competitionTeams").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllCompetitionTeams":
        return collectionsService.getCollectionByName("competitionTeams").find({}).count();
                            
                case "getAllHumanTeams":
        return collectionsService.getCollectionByName("competitionTeams").find({"linkedUserIds.0":{"$exists":true}}).count();
                            
                case "getTeamByName":
        return collectionsService.getCollectionByName("competitionTeams").find({"name": parameters.teamName }).count();
                            
                case "getCompetitionById":
        return collectionsService.getCollectionByName("competitions").find({"_id": parameters.id }).count();
                            
                case "getCompetitionsByIds":
        return collectionsService.getCollectionByName("competitions").find({"_id":{"$in": parameters.ids }}).count();
                            
                case "getAllCompetitions":
        return collectionsService.getCollectionByName("competitions").find({}).count();
                            
                case "getCompetitionByName":
        return collectionsService.getCollectionByName("competitions").find({"name": parameters.name }).count();
                            
                case "getMyCompetitions":
        return collectionsService.getCollectionByName("competitions").find({"ownerId":this.userId}).count();
                            
                case "getDeviceById":
        return collectionsService.getCollectionByName("devices").find({"_id": parameters.id ,"ownerId":this.userId}).count();
                            
                case "getDevicesByIds":
        return collectionsService.getCollectionByName("devices").find({"_id":{"$in": parameters.ids },"ownerId":this.userId}).count();
                            
                case "getDeviceByDeviceId":
        return collectionsService.getCollectionByName("devices").find({"deviceId": parameters.deviceId ,"ownerId":this.userId}).count();
                            
                case "getMyDevices":
        return collectionsService.getCollectionByName("devices").find({"ownerId":this.userId}).count();
                            
                
                default:
                    throw new Error("Could not find server count method for query name : " + data.queryName);
            }
        }
    });
});
