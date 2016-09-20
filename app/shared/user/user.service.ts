import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {User} from "./user";
import {Config} from "../config";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

@Injectable()
export class UserService {
  constructor(private _http: Http) {}

  register(user: User) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "signup",
      JSON.stringify({
        email: user.email,
        password: user.password
      }),
      { headers: headers }
    )
    .catch(this.handleErrors);
  }

  login(user: User) {
    //console.log("login service do login...");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.post(
        Config.apiUrl + "login",
        JSON.stringify({
          email: user.email,
          password: user.password
        }),
        { headers: headers }
    )
    .map(response => response.json())
    .do(data => {
      //console.log("data", data);
      Config.token = data._id;
      Config.userEmail = data.local.email;
      Config.userId = data._id;
    })
    .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    return Observable.throw(error);
  }
}