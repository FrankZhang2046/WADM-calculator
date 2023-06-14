import { Routes } from "@angular/router";
import { CustomHtmlTableComponent } from "./components/custom-html-table/custom-html-table.component";
import { DraggableTableComponent } from "./components/draggable-table/draggable-table.component";

export const routes: Routes = [
  {
    path: "deprecated",
    component: DraggableTableComponent,
  },
  {
    path: "",
    component: CustomHtmlTableComponent,
  },
];
