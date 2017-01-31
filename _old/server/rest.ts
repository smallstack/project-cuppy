/// <reference path="../typedefinitions/generated.d.ts" />

let getApiUser = (thisObj) => {
    if (thisObj.requestHeaders["x-smallstack-apikey"] === undefined)
        throw new Meteor.Error("403", "no x-smallstack-apikey header found!");
    if (!_.isString(thisObj.requestHeaders["x-smallstack-apikey"]))
        throw new Meteor.Error("406", "invalid x-smallstack-apikey header found!");

    // apikey valid?
    var meteorUser: any = Meteor.users.findOne({ "apikey": thisObj.requestHeaders["x-smallstack-apikey"] });
    if (!meteorUser) {
        throw new Meteor.Error("404", "no user found for this apikey!");
    }
    return User.fromDocument(meteorUser);
}


/**
 * neue view für devices
 * pairing mode, erkennt unregistrierte deviceIds
 * konfiguriert teams + up/down knöpfe
 */

let getNextControl = (currentControl: string): string => {
    switch (currentControl) {
        case "0_up": return "0_down";
        case "0_down": return "1_up";
        case "1_up": return "1_down";
        default:
            return null;
    }
}

let getControlName = (deviceControl: any, command: string) => {
    let controlFound: string = undefined;
    _.each(deviceControl, (value: string, key: string) => {
        if (value === command)
            controlFound = key;
    });
    return controlFound;
}

Meteor.startup(() => {

    HTTP.methods({
        '/api/devices/:deviceId/:command': {
            post: function () {
                let deviceId: string = this.params.deviceId;
                let command: string = this.params.command;

                let response: any = {};
                this.setContentType('application/json');

                let device: Device = DevicesCollection.getMongoCollection().findOne({ deviceId: deviceId });

                // check device
                if (!device) {
                    this.setStatusCode(404);
                    return JSON.stringify({ message: "device not found!" }, null, 2);
                }

                // check if device is configured
                if (_.keys(device.controls).length === 0 && device.configureMode === undefined) {
                    this.setStatusCode(400);
                    return JSON.stringify({ message: "device not configured!" }, null, 2);
                }

                // check if device is in configuration mode
                if (device.configureMode !== undefined && device.configureMode !== null) {
                    let currentDeviceMode: string = device.configureMode;
                    device.controls[currentDeviceMode] = command;
                    device.configureMode = getNextControl(currentDeviceMode);
                    device.update();
                    this.setStatusCode(200);
                    return JSON.stringify({ message: "mapped " + command + " to " + currentDeviceMode }, null, 2);
                }

                // get match and apply score 
                if (device.matchId === undefined) {
                    this.setStatusCode(400);
                    return JSON.stringify({ message: "device has no current match configured!" }, null, 2);
                }
                let match: CompetitionMatch = CompetitionMatchesCollection.getMongoCollection().findOne(device.matchId);
                if (!match) {
                    this.setStatusCode(400);
                    return JSON.stringify({ message: "configured match not found!" }, null, 2);
                }
                if (match.isFinished()) {
                    this.setStatusCode(400);
                    return JSON.stringify({ message: "configured match is finished already!" }, null, 2);
                }
                switch (getControlName(device.controls, command)) {
                    case "0_up":
                        match.updateDeltaScore(1, 0);
                        break;
                    case "0_down":
                        match.updateDeltaScore(-1, 0);
                        break;
                    case "1_up":
                        match.updateDeltaScore(0, 1);
                        break;
                    case "1_down":
                        match.updateDeltaScore(0, -1);
                        break;
                }
                match.update();


                // if a match is done, set to finished and set next match in device


                this.setStatusCode(200);
                return JSON.stringify({ message: "thanks man!" }, null, 2);
            }
        }
    });
});
