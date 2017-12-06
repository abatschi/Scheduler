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
import { ResultsComponent } from './results/results.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule,MatCardModule, MatDatepickerModule,MatNativeDateModule, MatFormFieldModule, MatInputModule} from '@angular/material';

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
    path: 'results/:groupId',
    component: ResultsComponent,
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
    NewGroupComponent,
    ResultsComponent,
  ],
  imports: [
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
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
