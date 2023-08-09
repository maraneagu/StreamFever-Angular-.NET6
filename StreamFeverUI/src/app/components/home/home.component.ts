import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public users: any = [];
  
  constructor(private authentification: AuthentificationService,
    private api: ApiService) {}

  ngOnInit() {
    this.api.getUsers()
    .subscribe(response => {
      this.users = response;
    })
  }

  signOut() {
    this.authentification.signOut();
  }
}
