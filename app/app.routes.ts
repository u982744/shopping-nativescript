import {RouterConfig} from "@angular/router";
import {nsProvideRouter} from "nativescript-angular/router"
import {LoginPage} from "./pages/login/login.component";
import {ListPage} from "./pages/list/list.component";
import {ItemsPage} from "./pages/items/items.component";

export const routes: RouterConfig = [
  { path: "", component: LoginPage },
  { path: "list", component: ListPage },
  { path: "list/:listId/items", component: ItemsPage }
];

export const APP_ROUTER_PROVIDERS = [
  nsProvideRouter(routes, {})
];