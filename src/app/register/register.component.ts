import {Component} from "@angular/core";
import {Router} from "@angular/router";

import {AlertService} from "../alert.service";
import {AccountService} from "../account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  model: any = {};
  loading = false;

  constructor(private router: Router,
              private accountService: AccountService,
              private alertService: AlertService) {
  }

  register() {
    this.loading = true;
    this.accountService.create(this.model)
      .subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
