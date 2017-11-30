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

  

  constructor(private _dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  addMember(){
    this.numMembers++;
    this.numMembersArray.push(this.numMembers);
    this.members.push("");
  }

  emailChange(event,num){
    this.members[num]=event.target.value;
  }

  email(){
    this._dataService.newGroup(this.members)
      .subscribe((res) => {
        let groupId =  res['_body'];
        groupId = groupId.substring(1,groupId.length-1);
        //console.log(res['_body']);
        this.router.navigate(['/conflicts', groupId, 'organizer']);
      });

     
  }

  

}
