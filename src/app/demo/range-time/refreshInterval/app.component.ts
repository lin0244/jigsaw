import {Component, Renderer2, ViewContainerRef} from "@angular/core";


@Component({
  templateUrl: './app.component.html'
})
export class RangeTimeRefreshIntervalComponent {
    beginDate = "now-1d";
    endDate = "now";
    constructor(public viewContainerRef: ViewContainerRef,
                public renderer: Renderer2) {
    }
}

