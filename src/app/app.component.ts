import { Component } from '@angular/core';
import { account, ID } from '../lib/appwrite';
import {RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MapComponent} from "./map/map.component";
import {SwUpdate} from "@angular/service-worker";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MapComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedInUser: any = null;
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private swUpdate: SwUpdate) {
    this.swUpdate.versionUpdates.subscribe(event => {
      //if (confirm('New version available. Load New Version?')) {
        //window.location.reload();
      //}
    });
  }

  async login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    this.loggedInUser = await account.get();
  }

  async register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
    await this.login(email, password);
  }

  async logout() {
    await account.deleteSession('current');
    this.loggedInUser = null;
  }
}
