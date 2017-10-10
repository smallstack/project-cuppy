import { AngularBaseComponentController, AngularComponent } from "@smallstack/core-client";
import { ComponentSocket, ComponentSocketType } from "@smallstack/core-common";
import template from "./MatchRowEntry.html";
import style from "./MatchRowEntry.scss";
import { CompetitionMatch } from "@smallstack/datalayer";

export class MatchRowEntryComponent extends AngularBaseComponentController {

    // TODO: Let ScoreStrategy decide how to render a result
    public getMatchResult(match: CompetitionMatch): string {
        if (!match || !match.result)
            return "- : -";

        if (match.result instanceof Array) {
            return ((match.result[0] === null || match.result[0] === undefined) ? '-' : match.result[0]) + " : " + ((match.result[1] === null || match.result[1] === undefined) ? '-' : match.result[1]);
        } else
            return "NO RESULT RENDERER"
    }

}


AngularComponent.new("MatchRowEntry", MatchRowEntryComponent)
    .setTemplate(template)
    .setStyles([style])
    .addSocket(ComponentSocket.createInput("match", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createInput("bet", ComponentSocketType.OBJECT))
    .addSocket(ComponentSocket.createOutput("placeBet", ComponentSocketType.OBJECT))
    .register();
