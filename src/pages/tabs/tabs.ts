import { SortPipe } from './../../utility/sort-pipe';
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { CreatePage } from '../create/create';
import { CompletedListPage } from '../completed-list/completed-list';

@Component({
  templateUrl: 'tabs.html',
  providers:[SortPipe]
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = CreatePage;
  tab3Root: any = CompletedListPage;

  constructor() {

  }
}
