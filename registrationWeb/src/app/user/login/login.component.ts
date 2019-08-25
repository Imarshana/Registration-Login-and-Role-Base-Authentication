import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  formModel = {
    UserName:'',
    Password:''
  }

  constructor( private service:UserService,
               private route:Router,
               private toastr:ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('token')!=null)
    this.route.navigateByUrl('/home');
  }

  onSubmit(form:NgForm){
    this.service.Login(form.value).subscribe(
      (res:any)=>{
        localStorage.setItem('token',res.token);
        this.route.navigateByUrl('/home');

      },
      err=>{
        if(err.status==400)
        this.toastr.error('User Name or Password is incorrect.','Authontication Faild');
        else
        console.log(err);
        
      }

    );


  }

}
