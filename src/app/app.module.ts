import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { ConflictsComponent } from './conflicts/conflicts.component';
import { RouterModule, Routes } from '@angular/router';
import { NewGroupComponent } from './new-group/new-group.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
  {
    path: 'conflicts/:groupId/:email',
    component: ConflictsComponent,
  },
  {
    path: 'newGroup',
    component: NewGroupComponent,
  },
  {
    path:'',
    redirectTo: 'newGroup',
    pathMatch: 'full'
  },
  { path: '**',
   component: NewGroupComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    ConflictsComponent,
    NewGroupComponent
  ],
  imports: [
    FormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
