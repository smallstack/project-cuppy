/// <reference path="../../../typedefinitions/generated.d.ts" />

class CompetitionListComponentController extends AngularBaseComponentController implements InitializationAware {

    @Autowired
    private competitionsService: CompetitionsService;

    public afterInitialization() {
        this.$scope.loaded = false;
        this.$scope.showMyCompetitions = Meteor.user() !== null;
        let maxCompetitions: number = this.getData("maxCompetitions");
        console.log("maxCompetitions : ", maxCompetitions);
        if (maxCompetitions === -1)
            this.loadAllCompetitions(this.competitionsService.getAllCompetitions({}));
        else
            this.loadAllCompetitions(this.competitionsService.getAllCompetitions({}, { entriesPerPage: maxCompetitions }));

        this.loadMyCompetitions(maxCompetitions);
    }

    private loadAllCompetitions(queryObject: QueryObject<Competition>) {
        queryObject.subscribe(() => {
            queryObject.expand(["ownerId"], () => {
                this.$timeout(() => {
                    this.$scope.competitions = queryObject.val();
                });
            });
        });
    }

    private loadMyCompetitions(maxCompetitions: number) {
        let queryObject: QueryObject<Competition> = this.competitionsService.getMyCompetitions({}, { entriesPerPage: maxCompetitions });
        queryObject.subscribe(() => {
            queryObject.expand(["ownerId"], () => {
                this.$timeout(() => {
                    this.$scope.myCompetitions = queryObject.val();
                });
            });
        });
    }

}

AngularComponent.new("competitionList")
    .setControllerClass(CompetitionListComponentController)
    .addConfiguration(ComponentConfiguration.createNumberConfiguration("maxCompetitions", -1))
    .setTemplateUrl("client/components/competition-list/competition.list.ng.html")
    .create();
