import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'jacobi-auth-flow',
  templateUrl: './auth-flow.page.html',
  styleUrls: ['./auth-flow.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthFlowPage implements OnInit {
  @Input() signInButtonTemplateRef: TemplateRef<any>;

  pageName = 'Auth Flow';
  constructor(private _authService: AuthService) { }

  ngOnInit() {}

}
