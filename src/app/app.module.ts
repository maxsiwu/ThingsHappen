import { IntroPage } from './../pages/intro/intro';
import { TutorialBtn } from './../components/tutorial-btn/tutorial-btn';
import { EditPage } from './../pages/edit/edit';
import { DetailPage } from './../pages/detail/detail';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CreatePage } from '../pages/create/create';
import { CompletedListPage } from '../pages/completed-list/completed-list';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    CreatePage,
    CompletedListPage,
    HomePage,
    TabsPage,
    DetailPage,
    EditPage,
    TutorialBtn,
    IntroPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
        name: '__mydb',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
   })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CreatePage,
    CompletedListPage,
    HomePage,
    TabsPage,
    DetailPage,
    EditPage,
    IntroPage,
    TutorialBtn
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
