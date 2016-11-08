/// <reference path="../../typedefinitions/generated.d.ts" />

/**
 * This method is getting executed on the server only. See http://docs.meteor.com/#/full/meteor_methods
 */

Meteor.methods({
	"devices-removeDevice": function (params: { modelId: string }) {
		Utils.check(params.modelId, String, "modelId");

		if (!this.userId)
			throw new Meteor.Error("403", "User is not logged in!");

		let device: Device = DevicesCollection.getMongoCollection().findOne({ _id: params.modelId, ownerId: this.userId });
		if (!device)
			throw new Meteor.Error("404", "Device not found!");

		return DevicesCollection.getMongoCollection().remove(device.id) === 1;
	}
});
