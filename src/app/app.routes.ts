import { Routes } from "@angular/router";
import { CustomHtmlTableComponent } from "./components/custom-html-table/custom-html-table.component";
import { DraggableTableComponent } from "./components/draggable-table/draggable-table.component";
import { LogInComponent } from "./pages/log-in/log-in.component";
import { WorksComponent } from "./pages/works/works.component";

export const routes: Routes = [
  {
    path: "works",
    component: WorksComponent,
  },
  {
    path: "deprecated",
    component: DraggableTableComponent,
  },
  {
    path: "log-in",
    component: LogInComponent,
  },
  {
    path: "",
    component: CustomHtmlTableComponent,
  },
];
