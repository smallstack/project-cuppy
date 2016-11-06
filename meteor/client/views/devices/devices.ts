/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/devices")
    .setIndex(50)
    .setLabel("navigation.devices")
    .setIcon("fa fa-mobile")
    .setRequiresAuthentication(true)
    .setTemplateUrl("client/views/devices/devices.ng.html")
    .setVisible(true)
    .setStateName("website.devices")
    .setType("main")
    .setControllerName("DevicesController")
);


class DevicesController {

    @Autowired
    private notificationService: NotificationService;

    @Autowired
    private devicesService: DevicesService;

    static $inject = ["$scope", "$timeout"];
    constructor(private $scope: any, private $timeout: angular.ITimeoutService) {
        $scope.vm = this;

        this.devicesService.getMyDevices({}, { reactive: true }).subscribe((cursor) => {
            Tracker.autorun(() => {
                let devices: Device[] = cursor.fetch();
                this.$timeout(() => {
                    this.$scope.devices = devices;
                });
            });
        });
    }

    public addDevice(deviceId: string) {
        this.devicesService.createNewDevice(deviceId, this.notificationService.getStandardCallback("Could not add new device!", "Successfully added new device to your account!"));
    }
}

smallstack.angular.app.controller("DevicesController", DevicesController);
