import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Item} from "./item";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class ItemService {
  constructor(private _http: Http) {}

  load(listId: string) {
    return this._http.get(
      Config.apiUrl + "list/" + listId + "/item"
    )
    .map(res => res.json())
    .map(data => {
      let itemList = [];
      data.result.forEach((item) => {
        itemList.push(new Item(item._id, item.name, item.done));
      });
      return {name: data.name, items: itemList};
    })
    .catch(this.handleErrors);
  }

  add(name: string, listId: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    //console.log("add...", name, listId);

    return this._http.post(
      Config.apiUrl + "list/" + listId + "/item",
      JSON.stringify({
        name: name
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      //console.log("add map", data.id, name);
      return new Item(data.id, name, false);
    })
    .catch(this.handleErrors);
  }

  done(id: string, listId: string, done: boolean) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.put(
      Config.apiUrl + "list/" + listId + "/item/" + id,
      JSON.stringify({
        done: done
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  delete(id: string, listId: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.delete(
      Config.apiUrl + "list/" + listId + "/item/" + id,
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  handleErrors(error) {
    //console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}