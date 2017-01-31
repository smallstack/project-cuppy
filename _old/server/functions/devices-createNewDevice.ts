/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"devices-createNewDevice": function (params: { deviceId: string }) {
		Utils.check(params.deviceId, String, "deviceId");

		if (!this.userId)
			throw new Meteor.Error("403", "User is not logged in!");

		let device: Device = DevicesCollection.getMongoCollection().findOne({ deviceId: params.deviceId });
		if (device)
			throw new Meteor.Error("501", "This deviceId is already used by another device!");

		device = new Device();
		device.deviceId = params.deviceId;
		device.ownerId = this.userId;
		device.save();
	}
});
