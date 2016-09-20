import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {List} from "./list";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";

@Injectable()
export class ListService {
  constructor(private _http: Http) {}

  load() {
     //console.log("Config", Config);
    return this._http.get(
      Config.apiUrl + "list/" + Config.userId
    )
    .map(res => res.json())
    .map(data => {
      let list = [];
      data.result.forEach((item) => {
        list.push(new List(item._id, item.name));
      });
      return list;
    })
    .catch(this.handleErrors);
  }

  add(name: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "list",
      JSON.stringify({
        name: name,
        userId: Config.userId
      }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
       //console.log("add map", data.id, name);
      return new List(data.id, name);
    })
    .catch(this.handleErrors);
  }

  delete(id: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.delete(
      Config.apiUrl + "list/" + id,
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  share(listId: string, email: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.put(
      Config.apiUrl + "list/" + listId + "/adduser/" + email,
      JSON.stringify({}),
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  handleErrors(error) {
     //console.log("handleErrors", error);
     //console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}