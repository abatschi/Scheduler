import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.css']
})
export class ConflictsComponent implements OnInit {

  groupId;
  email;

  timesArray = [];

  numConflicts = 1;
  numConflictsArray = [1];
  conflicts = [{ date: "", fromTime: "9:00", toTime: "10:00", repeat:false }];

  repeatOn = false;

  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dueDate;
  today;

  constructor(private route: ActivatedRoute, private _dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.today = new Date();
    for (let i = 0; i < 24; i++) {
      var tempi = i;
      if (tempi == 0) {
        tempi = 12;
      }
      if (tempi > 12) {
        tempi -= 12;
        this.timesArray.push({ value: i + ":00", view: tempi + ":00 PM" });
        this.timesArray.push({ value: i + ":15", view: tempi + ":15 PM" });
        this.timesArray.push({ value: i + ":30", view: tempi + ":30 PM" });
        this.timesArray.push({ value: i + ":45", view: tempi + ":45 PM" });
      }
      else {
        this.timesArray.push({ value: tempi + ":00", view: tempi + ":00 AM" });
        this.timesArray.push({ value: tempi + ":15", view: tempi + ":15 AM" });
        this.timesArray.push({ value: tempi + ":30", view: tempi + ":30 AM" });
        this.timesArray.push({ value: tempi + ":45", view: tempi + ":45 AM" });
      }
    }
    this.route.params.subscribe(params => {
      this.groupId = params['groupId'];
      this.email = params['email'];
      this._dataService.getMembers(this.groupId)
        .subscribe((res) => {
          var group = JSON.parse(res["_body"]);
          this.dueDate = new Date(group.date);
        });
    });
  }

  addConflict() {
    this.numConflicts++;
    this.numConflictsArray.push(this.numConflicts);
    this.conflicts.push({ date: "", fromTime: "9:00", toTime: "10:00", repeat:false });
  }

  // dateChange(event,num){
  //   this.conflicts[num-1]['date']=event.target.value;
  // }

  // fromTimeChange(event,num){
  //   console.log("change");
  //   this.conflicts[num-1]['fromTime']=event.target.value;
  // }

  // toTimeChange(event,num){
  //   this.conflicts[num-1]['toTime']=event.target.value;
  // }

  submit() {
    for (let conflict of this.conflicts) {
      if (conflict.repeat && conflict.date.includes("day")) {
        var tempDate = new Date();
        var i=1;
        var dayAfterDueDate = new Date(this.dueDate.getTime() + 24  * 60 * 60 * 1000);
        while(!this.dateEquals(tempDate,dayAfterDueDate)){
          if(conflict.date.includes(this.dayNames[tempDate.getDay()])){
            this.conflicts.push({ date: tempDate.toDateString(), fromTime: conflict.fromTime, toTime: conflict.toTime, repeat:false });
          }
          tempDate = new Date(new Date().getTime() + 24 * i * 60 * 60 * 1000);
          i++;
        }
        let index = this.conflicts.indexOf(conflict);
        this.conflicts.splice(index,1);
      }
    }
    this._dataService.newConflicts(this.groupId, this.email, this.conflicts)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/results', this.groupId]);
      });


  }

  remove(num) {
    this.numConflicts--;
    this.conflicts.splice(num - 1, 1);
    this.numConflictsArray.splice(num - 1, 1);
    for (let i = num - 1; i < this.numConflictsArray.length; i++) {
      this.numConflictsArray[i] = this.numConflictsArray[i] - 1;
    }
  }

  repeatToggle(num, day) {
    let index = this.conflicts[num - 1].date.indexOf(day);
    console.log(index);
    if (index != -1) {
      this.conflicts[num - 1].date =
        (this.conflicts[num - 1].date.substring(0, index) +
          this.conflicts[num - 1].date.substring(index + day.length));
    }
    else {
      this.conflicts[num - 1].date += day;
    }
    console.log(this.conflicts);
  }

  dateEquals(date1, date2) {
    return date1.getYear() == date2.getYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate();
  }

}
