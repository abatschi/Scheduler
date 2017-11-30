import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getUsers() {
    return this._http.get("/api/users")
      .map(result => this.result = result.json().data);
  }

  newGroup(users) {
    return this._http.post("/api/newGroup", users)
      .map(result => this.result = result);
  }

  newConflicts(groupId, email, conflicts) {
    return this._http.post("/api/newConflicts", {groupId:groupId, email:email, conflicts:conflicts})
    .map(result => this.result = result);
  }

}
