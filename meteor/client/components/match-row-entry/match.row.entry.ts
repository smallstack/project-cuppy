/// <reference path="../../../typedefinitions/generated.d.ts" />


AngularComponent.new("matchRowEntry")
    .addSocket(ComponentSocket.createInput("match", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createInput("bet", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createOutput("placeBet", ComponentSocketType.OBJECT))
    .setTemplateUrl("client/components/match-row-entry/match.row.entry.ng.html")
    .setControllerClass(DefaultAngularComponentController)
    .create();