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
          this.group = JSON.parse(res["_body"]);
          console.log(this.group);
          this.members = this.group.members;
          this.selDate = this.group.date;
        });
    });
  }

  getChangedValue(newDate) {
    for(let i=1;i<25;i++){
      document.getElementById("block"+i).style.background = "#FFFFFF";
    }
    this.selDate = newDate;
    for(let member of this.members){
      for(let conflict of member.conflicts){
        let myConflictDate = new Date(conflict.date).toDateString();
        let newDateString = newDate.toDateString();
        if(myConflictDate==newDateString){
          console.log(conflict.fromTime);
          console.log(conflict.toTime);
          let numStart="0";
          if(conflict.fromTime[0]=="0"){
            numStart=conflict.fromTime.substring(1,2);
          }
          else{
            numStart=conflict.fromTime.substring(0,2);
          }

          numStart=""+(Number(numStart)+1);
          if(numStart=="0"){
            numStart="12";
          }
          if(conflict.fromTime.substring(3)=="30"){
            document.getElementById("block"+numStart).style.background = "linear-gradient(90deg, #FFFFFF 50%, #000000 50%)";
          }
          else if(conflict.fromTime.substring(3)=="00"){
            
            document.getElementById("block"+numStart).style.background = "#000000";
          }

          let numEnd="0";
          if(conflict.toTime[0]=="0"){
            numEnd=conflict.toTime.substring(1,2);
          }
          else{
            numEnd=conflict.toTime.substring(0,2);
          }

          numEnd=""+(Number(numEnd)+1);
          if(numEnd=="0"){
            numEnd="12";
          }
          if(conflict.toTime.substring(3)=="30"){
            document.getElementById("block"+numEnd).style.background = "linear-gradient(90deg, #000000 50%, #FFFFFF 50%)";
          }
          else if(conflict.toTime.substring(3)=="00"){
            document.getElementById("block"+numEnd).style.background = "#000000";
          }

          for(let start = Number(numStart)+1; start<Number(numEnd);start++){
            console.log(start);
            document.getElementById("block"+start).style.background = "#000000";
          }
        }
      }
    }
    // document.getElementById("block4").style.background = "linear-gradient(90deg, #FFC0CB 50%, #00FFFF 50%)";
    
    // document.getElementById("block5").style.background = "linear-gradient(90deg, #FFC0CB 50%, #00FFFF 50%)";
  }



}
