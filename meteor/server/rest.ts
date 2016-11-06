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

Meteor.startup(() => {

    HTTP.methods({
        '/api/devices/:deviceId/:command': {
            post: function () {
                let deviceId: string = this.params.deviceId;
                let command: string = this.params.command;

                let response: any = {};
                this.setContentType('application/json');

                let device: Device = DevicesCollection.getMongoCollection().findOne({ deviceId: deviceId });
                if (!device) {
                    this.setStatusCode(404);
                    return JSON.stringify({ message: "device not found!" }, null, 2);
                }
                if (_.keys(device.controls).length === 0 && device.configureMode === undefined) {
                    this.setStatusCode(400);
                    return JSON.stringify({ message: "device not configured!" }, null, 2);
                }
                if (device.configureMode !== undefined && device.configureMode !== null) {
                    let currentDeviceMode: string = device.configureMode;
                    device.controls[currentDeviceMode] = command;
                    device.configureMode = getNextControl(currentDeviceMode);
                    device.update();
                    this.setStatusCode(200);
                    return JSON.stringify({ message: "mapped " + command + " to " + currentDeviceMode }, null, 2);
                }


                this.setStatusCode(200);
                return JSON.stringify({ message: "thanks man!" }, null, 2);
            }
        }
    });
});
