import {Component, Renderer2, ViewContainerRef} from "@angular/core";
import {Http} from "@angular/http";
import {TableData} from "jigsaw/core/data/table-data";
import {ColumnDefine} from "jigsaw/component/table/table-api";

@Component({
  templateUrl: './app.component.html'
})
export class TableColumnSetVisibleDemoComponent {
    tableData: TableData;

    click(){
        this._columns = [
            {target: 'name',
            visible: true}]
    }

    constructor(public viewContainerRef: ViewContainerRef,
                public renderer: Renderer2, http: Http) {
        this.tableData = new TableData();
        this.tableData.http = http;
        this.tableData.fromAjax('mock-data/table/data.json');
    }

     _columns: ColumnDefine[] = [
        {
            target: 'name',
            visible: false
        }];

}

