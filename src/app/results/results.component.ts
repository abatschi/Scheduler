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

  myFormattedDate="";

  dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  numReported=0;
  allReported=false;

  myFormattedSelDate;

  myMinutes;
  myHours;

  constructor(private _dataService: DataService, private route: ActivatedRoute, ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = params['groupId'];
      this._dataService.getMembers(this.groupId)
        .subscribe((res) => {
          this.group = JSON.parse(res["_body"]);

          this.myMinutes=this.group.numMinutes;
          if(!this.myMinutes){
            this.myMinutes="0";
          }

          this.myHours=this.group.numHours;
          if(!this.myHours){
            this.myHours="0";
          }

          let tempDate = new Date(this.group.date);
          this.myFormattedDate = "" + this.dayNames[tempDate.getDay()] + ", "+ this.monthNames[tempDate.getMonth()] + " "+ tempDate.getDate();
          
          this.members = this.group.members;
          this.selDate = this.group.date;
          var selDateDate = new Date(this.selDate);
          this.myFormattedSelDate = "" + this.dayNames[selDateDate.getDay()] + ", "+ this.monthNames[selDateDate.getMonth()] + " "+ selDateDate.getDate();
          this.getChangedValue(selDateDate);
          
          for (let member of this.members) {
            if(member.conflicts.length>0){
              this.numReported++;
            }
          }
          if(this.numReported==this.members.length){
            this.allReported=true;
          }
          //this.getChangedValue(this.selDate);
        });
    });
  }

  getChangedValue(newDate) { 
    let myConflicts = [];
    for (let i = 1; i < 25; i++) {
      document.getElementById("block" + i).style.background = "rgb(255, 255, 255)";
    }
    this.selDate = newDate;
    this.myFormattedSelDate = "" + this.dayNames[this.selDate.getDay()] + ", "+ this.monthNames[this.selDate.getMonth()] + " "+ this.selDate.getDate();
    
    for (let member of this.members) {
      for (let conflict of member.conflicts) {
        let myConflictDate = new Date(conflict.date).toDateString();
        let newDateString = newDate.toDateString();
        if (myConflictDate == newDateString) {
          console.log("from " + conflict.fromTime);
          console.log("to " + conflict.toTime);

          let conflict1=(conflict.fromTime.substring(0, 2) + conflict.fromTime.substring(3, 5));
          if(myConflicts.indexOf(conflict1)==-1){
            myConflicts.push(conflict1);
          }
          let conflict2=(conflict.toTime.substring(0, 2) + conflict.toTime.substring(3, 5));
          if(myConflicts.indexOf(conflict2)==-1){
            myConflicts.push(conflict2);
          }
          myConflicts.sort();

          let numStart = "0";
          if (conflict.fromTime[0] == "0") {
            numStart = conflict.fromTime.substring(1, 2);
          }
          else {
            numStart = conflict.fromTime.substring(0, 2);
          }

          numStart = "" + (Number(numStart) + 1);
          if (numStart == "0") {
            numStart = "12";
          }
          if (conflict.fromTime.substring(3) == "30") {
            this.addTitle(numStart, member.email);
            document.getElementById("block" + numStart).style.background = "linear-gradient(90deg, #FFFFFF 50%, #000000 50%)";
          }
          else if (conflict.fromTime.substring(3) == "15") {
            this.addTitle(numStart, member.email);
            document.getElementById("block" + numStart).style.background = "linear-gradient(90deg, #FFFFFF 25%, #000000 25%)";
          }
          else if (conflict.fromTime.substring(3) == "45") {
            this.addTitle(numStart, member.email);
            document.getElementById("block" + numStart).style.background = "linear-gradient(90deg, #FFFFFF 75%, #000000 25%)";
          }
          else if (conflict.fromTime.substring(3) == "00") {
            this.addTitle(numStart, member.email);
            document.getElementById("block" + numStart).style.background = "rgb(0, 0, 0)";
          }

          let numEnd = "0";
          if (conflict.toTime[0] == "0") {
            numEnd = conflict.toTime.substring(1, 2);
          }
          else {
            numEnd = conflict.toTime.substring(0, 2);
          }

          numEnd = "" + (Number(numEnd) + 1);
          if (numEnd == "0") {
            numEnd = "12";
          }
          if (conflict.toTime.substring(3) == "30") {
            this.addTitle(numEnd, member.email);
            document.getElementById("block" + numEnd).style.background = "linear-gradient(90deg, #000000 50%, #FFFFFF 50%)";
          }
          else if (conflict.toTime.substring(3) == "15") {
            this.addTitle(numEnd, member.email);
            document.getElementById("block" + numEnd).style.background = "linear-gradient(90deg, #000000 25%, #FFFFFF 25%)";
          }
          else if (conflict.toTime.substring(3) == "45") {
            this.addTitle(numEnd, member.email);
            document.getElementById("block" + numEnd).style.background = "linear-gradient(90deg, #000000 75%, #FFFFFF 75%)";
          }
          else if (conflict.toTime.substring(3) == "00" && (Number(numStart) + 1 != Number(numEnd))) {
            let tempNumEnd = "" + (Number(numEnd) - 1);
            this.addTitle(tempNumEnd, member.email);
            document.getElementById("block" + tempNumEnd).style.background = "rgb(0, 0, 0)";
          }

          for (let start = Number(numStart) + 1; start < Number(numEnd); start++) {
            this.addTitle(start, member.email);
            document.getElementById("block" + start).style.background = "rgb(0, 0, 0)";
          }


        }
      }
    }

    let myMinutes = this.group.numMinutes;
    if (myMinutes == '0' || myMinutes=='') {
      myMinutes = '00';
    }
    let length = Number(this.group.numHours + myMinutes);
    for (let i = 1; i < myConflicts.length - 1; i += 2) {
      let diff = Number(myConflicts[i + 1]) - Number(myConflicts[i]);
      if (myConflicts[i + 1].substring(2, 4) < myConflicts[i].substring(2, 4)) {
        diff -= 40;
      }
      console.log(diff);
      console.log(length);
      if (diff > length) {
        console.log(myConflicts);
        myConflicts.splice(i, 2);
        console.log(myConflicts);
      }

    }

    
    for (let i = 1; i < myConflicts.length - 1; i += 2) {
      let numStart = '0';
      if (myConflicts[i][0] == "0") {
        numStart = myConflicts[i].substring(1, 2);
      }
      else {
        numStart = myConflicts[i].substring(0, 2);
      }

      let numEnd = '0';
      if (myConflicts[i + 1][0] == "0") {
        numEnd = myConflicts[i + 1].substring(1, 2);
      }
      else {
        numEnd = myConflicts[i + 1].substring(0, 2);
      }

      numStart = "" + (Number(numStart) + 1);
      numEnd = "" + (Number(numEnd) + 1);

      let newStartStyle = document.getElementById("block" + numStart).style.background.replace('rgb(255, 255, 255)', 'rgb(100, 100, 100)');
      let newEndStyle = document.getElementById("block" + numEnd).style.background.replace('rgb(255, 255, 255)', 'rgb(100, 100, 100)');
      document.getElementById("block" + numStart).style.background = newStartStyle;
      document.getElementById("block" + numEnd).style.background = newEndStyle;

      for (let start = Number(numStart) + 1; start < Number(numEnd); start++) {
        let newEndStyle = document.getElementById("block" + start).style.background.replace('rgb(255, 255, 255)', 'rgb(100, 100, 100)');
        document.getElementById("block" + start).style.background = newEndStyle;
      }


    }


  }

  addTitle(num, email) {
    let myTitle = document.getElementById("block" + num).title;
    if(!myTitle.includes(email)){
      if (myTitle) {
        document.getElementById("block" + num).title += (", " + email);
      }
      else {
        document.getElementById("block" + num).title +=  email;
      }
    }

  }

  refresh(){
    //this.route
    window.location.reload();
  }



}
