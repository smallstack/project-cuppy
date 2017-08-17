import { AngularBaseComponentController, AngularComponent } from "@smallstack/core-client";
import { ComponentSocket, ComponentSocketType } from "@smallstack/core-common";
import template from "./MatchRowEntry.html";
import style from "./MatchRowEntry.scss";

export class MatchRowEntryComponent extends AngularBaseComponentController { }


AngularComponent.new("MatchRowEntry", MatchRowEntryComponent)
    .setTemplate(template)
    .setStyles([style])
    .addSocket(ComponentSocket.createInput("match", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createInput("bet", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createOutput("placeBet", ComponentSocketType.OBJECT))
    .register();
