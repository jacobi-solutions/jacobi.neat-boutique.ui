import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
})
export class GetStartedPage implements OnInit {
  public isAuthenticated: boolean;
  constructor(private _authService: AuthService) { }

  async ngOnInit() {
    var isAuthenticated = await this._authService.isAuthenticated();
    if(isAuthenticated) {
      this.isAuthenticated = true;
    }
  }

}
