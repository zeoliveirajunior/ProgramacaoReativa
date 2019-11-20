import { LoginserviceService } from "./../loginservice.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loginexterno",
  templateUrl: "./loginexterno.component.html",
  styleUrls: ["./loginexterno.component.scss"]
})
export class LoginexternoComponent implements OnInit {
  Login: LoginserviceService;

  constructor(Login: LoginserviceService) {
    this.Login = Login;
  }

  ngOnInit() {}

  Logoff() {
    this.Login.Logoff();
  }
}
