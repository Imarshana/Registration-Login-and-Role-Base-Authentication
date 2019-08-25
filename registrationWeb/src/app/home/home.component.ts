import { UserService } from './../shared/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  userDetails;

  constructor(private route:Router,
              private service:UserService) { }

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      res=>{
        this.userDetails=res;
      },
      err=>{
        console.log(err)
      }
  );
  }

  OnLogout(){
    localStorage.removeItem('token');
    this.route.navigate(['/user/login']);

  }

}
