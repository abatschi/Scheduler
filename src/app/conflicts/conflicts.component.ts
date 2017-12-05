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

  numConflicts=1;
  numConflictsArray=[1];
  conflicts=[{date:"", fromTime:"", toTime:""}];

  constructor(private route: ActivatedRoute, private _dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = params['groupId'];
      this.email = params['email'];
    });
  }

  addConflict(){
    this.numConflicts++;
    this.numConflictsArray.push(this.numConflicts);
    this.conflicts.push({date:"", fromTime:"", toTime:""});
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

  submit(){
    console.log(this.conflicts);
    this._dataService.newConflicts(this.groupId, this.email, this.conflicts)
      .subscribe((res) => {
        console.log(res);
        this.router.navigate(['/results', this.groupId]);
      });

     
  }

  remove(num){
    this.numConflicts--;
    this.conflicts.splice(num-1,1);
    this.numConflictsArray.splice(num-1,1);
    for(let i=num-1; i<this.numConflictsArray.length; i++){
      this.numConflictsArray[i]=this.numConflictsArray[i]-1;
    }
  }

}
