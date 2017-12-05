import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

import { MatCalendar } from '@angular/material';

// import 'rxjs'
// import 'rxjs/Rx'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  groupId;
  members: any[] = [];
  selDate;
  group;


  constructor(private _dataService: DataService, private route: ActivatedRoute, ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = params['groupId'];
      this._dataService.getMembers(this.groupId)
        .subscribe((res) => {
          console.log(res);
          this.group=JSON.parse(res["_body"])
          this.members = this.group.members;
          this.selDate = this.group.date;
        });
    });
  }

  getChangedValue(newDate) {
    this.selDate = newDate;
  }



}
