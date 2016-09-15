/// <reference path="../../../typedefinitions/generated.d.ts" />

declare var SIOPlugin: any;

class SensationRatingController extends AngularBaseComponentController {

    @Autowired
    private configurationService: ConfigurationService;

    static sockets = {
        key: "key",
        tags: "tags",
        allowRating: "allowRating",
        showJams: "showJams",
        showOnboarding: "showOnboarding",
        matchId: "matchId"
    }

    private key: string;
    private tags: string;
    private allowRating: boolean = true;
    private showJams: boolean = true;
    private matchId: string;
    private showOnboarding: boolean = false;

    public onSocketEvent(socketName: string, socketData: any) {
        switch (socketName) {
            case SensationRatingController.sockets.key:
                this.key = socketData;
                this.loadSensationPlugin();
                break;
            case SensationRatingController.sockets.tags:
                this.tags = socketData;
                this.loadSensationPlugin();
                break;
            case SensationRatingController.sockets.allowRating:
                this.allowRating = socketData === true || socketData === "true";
                this.loadSensationPlugin();
                break;
            case SensationRatingController.sockets.showJams:
                this.showJams = socketData;
                this.loadSensationPlugin();
                break;
            case SensationRatingController.sockets.showOnboarding:
                this.showOnboarding = socketData;
                this.loadSensationPlugin();
                break;
            case SensationRatingController.sockets.matchId:
                this.matchId = socketData;
                break;
        }
    }

    private loadSensationPlugin() {
        if (this.key && this.tags) {
            this.$scope.loaded = false;

            // authentication
            // TODO: outsource client/tenantId to configurationService
            var clientId = "";
            var tenantId = "";
            var redirectUri = this.configurationService.get("sensation.oauthurl", Meteor.absoluteUrl("sensation/sioauth.html"));

            // emotion map data
            var pqId = "";

            smallstack.logger.info("SensationComponent", "posting", {
                key: this.key,
                tags: this.tags
            });

            SIOPlugin.init(clientId, tenantId, redirectUri, (token) => {
                this.$timeout(() => {
                    this.$scope.loaded = true;
                    if (token) {
                        this.$scope.key = this.key;
                        SIOPlugin.load(pqId, token, this.key, this.tags, {
                            onBoarding: this.showOnboarding,
                            showJams: this.showJams,
                            onlyShowJamsWithoutRating: !this.allowRating
                        }, (jamError: string, result: string) => {
                            if (jamError)
                                smallstack.logger.error("SensationComponent", jamError);
                            else {
                                smallstack.logger.debug("SensationComponent", "result", result);
                                NotificationService.instance().notification.success("sensation.io says : thanks!");
                                CompetitionMatchesService.instance().rated(this.matchId);
                            }
                        });
                    }
                    else {
                        smallstack.logger.error("SensationComponent", "Could not get token!");
                    }
                });
            });
        }
    }
}


AngularComponent.new("sensationRating")
    .setControllerClass(SensationRatingController)
    .setLabel("Sensation Rating")
    .setDescription("Awesome rating heatmap from sensation.io!")
    .setTemplateUrl("client/components/sensation/sensation.ng.html")
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.tags, ComponentSocketType.STRING_ARRAY))
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.key, ComponentSocketType.STRING))
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.allowRating, ComponentSocketType.STRING))
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.showJams, ComponentSocketType.BOOLEAN))
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.matchId, ComponentSocketType.BOOLEAN))
    .addSocket(ComponentSocket.createInput(SensationRatingController.sockets.showOnboarding, ComponentSocketType.BOOLEAN))
    .create();