import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {
  numMembers=1;
  numMembersArray=[1];
  members=["organizer",""];

  date;
  numHours="1";
  numMinutes="0";

  hoursArray=[];
  minutesArray=[];

  today;

  

  constructor(private _dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.today = new Date();
    for(var i=0;i<24;i++){
      this.hoursArray.push(i);
    }

    for(var i=0;i<60;i+=15){
      this.minutesArray.push(i);
    }
  }

  addMember(){
    this.numMembers++;
    this.numMembersArray.push(this.numMembers);
    this.members.push("");
  }

  remove(num){
    this.numMembers--;
    this.members.splice(num,1);
    this.numMembersArray.splice(num-1,1);
    for(let i=num-1; i<this.numMembersArray.length; i++){
      this.numMembersArray[i]=this.numMembersArray[i]-1;
    }
  }

  emailChange(event,num){
    this.members[num]=event.target.value;
  }

  email(){
    this._dataService.newGroup(this.members,this.date,this.numHours,this.numMinutes)
      .subscribe((res) => {
        let groupId =  res['_body'];
        groupId = groupId.substring(1,groupId.length-1);
        //console.log(res['_body']);
        this.router.navigate(['/conflicts', groupId, 'organizer']);
      });

     
  }

  

}
