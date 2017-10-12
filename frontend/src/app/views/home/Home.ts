import { Component, OnInit } from "@angular/core";
import { Logger } from "@smallstack/common";
import { BaseComponent } from "@smallstack/components";

@Component({
    selector: "Home",
    templateUrl: "./Home.html",
    styleUrls: ["./Home.scss"]
})
export class HomeComponent extends BaseComponent implements OnInit {

    public ngOnInit() {
        Logger.info("HomeComponent", "YEAH");
    }
}
