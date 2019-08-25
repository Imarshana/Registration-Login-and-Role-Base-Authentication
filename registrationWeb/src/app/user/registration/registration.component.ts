import { UserService } from './../../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {

  constructor(public service:UserService,
              private toast:ToastrService) { }

  ngOnInit() {
    this.service.formModel.reset();
  }


  onSubmit(){
    this.service.Register().subscribe(
    (res:any)=>{
        if(res.succeeded){
          this.service.formModel.reset();
          this.toast.success('New User Created','Registerion Success');
        }else{
          res.errors.forEach(element => {
            switch (element.code){
              case 'DuplicateUserName':
              this.toast.error('Username is already taken','Registerion faild');
              break;

              default:
              this.toast.error(element.description,'Registerion faild');

              break;
            }
          });
        }
      },
      err=>{
        console.log(err);
      }
    )
  }
}
