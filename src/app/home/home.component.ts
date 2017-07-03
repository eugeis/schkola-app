import {Component, OnInit} from "@angular/core";
import {AccountService} from "../account.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  currentAccount: Account;
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {
    this.currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
  }

  ngOnInit() {
    this.loadAllAccounts();
  }

  deleteAccount(id: number) {
    this.accountService.delete(id).subscribe(() => {
      this.loadAllAccounts()
    });
  }

  private loadAllAccounts() {
    this.accountService.getAll().subscribe(accounts => {
      this.accounts = accounts;
    });
  }
}
