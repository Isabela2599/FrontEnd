import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/core/services/auth.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { ChargeMoneyComponent } from "../charge-money/charge-money.component";
import { CreateMoneyChargeService } from "src/app/core/services/create-money-charge.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  isAdmin = false;
  private authListenerSubs: Subscription;
  private userListenerSubs: Subscription;
  currentBalance: number;
  userId: string;
  amount: number;
  userName: string;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private chargeMoneyService: CreateMoneyChargeService
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.userId = this.authService.getUserId();
    }
    this.userListenerSubs = this.authService.getUser()
      .subscribe(user => {
        this.isAdmin = false;
        this.isAdmin = user.roles.admin;
        this.currentBalance = user.balance;
        this.userName = user.name;
      });
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userListenerSubs = this.authService.getUser()
          .subscribe(user => {
            this.isAdmin = false;
            this.isAdmin = user.roles.admin;
            this.currentBalance = user.balance;
            this.userName = user.name;
          });
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.userListenerSubs.unsubscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChargeMoneyComponent, {
      width: "250px",
      data: { money: this.amount }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result > 0) {
        this.amount = result;
        this.chargeMoneyService.createTransaction(this.userId, this.userName, this.amount);
      }
    });
  }
}
