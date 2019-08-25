import { Injectable } from '@angular/core';
import { FormBuilder,Validators,FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb : FormBuilder,
              private http:HttpClient) { }

  readonly BaseUrl='http://localhost:6868/api'            

  formModel=this.fb.group({
    UserName :['', Validators.required],
    Email :['',Validators.email],
    FullName :[''],

    Passwords :this.fb.group({
      Password :['', [Validators.required,Validators.minLength(4)]],
      ComfirmPassword :['', Validators.required]
    },{validator : this.comparePasswords })
   
  });


comparePasswords(fb : FormGroup){
 let comfirmpasswcontrol=fb.get('ComfirmPassword');

 if(comfirmpasswcontrol.errors==null || 'passwordMisMatch' in comfirmpasswcontrol.errors){
   if(fb.get('Password').value!=comfirmpasswcontrol.value)
    comfirmpasswcontrol.setErrors({passwordMisMatch:true});
    else
    comfirmpasswcontrol.setErrors(null); 
 }
}

Register(){
  var body={
    UserName:this.formModel.value.UserName,
    Email:this.formModel.value.Email,
    FullName:this.formModel.value.FullName,
    Password:this.formModel.value.Passwords.Password
  };
   return this.http.post(this.BaseUrl+'/ApplicationUser/Register',body);
}

Login(formData){
  return this.http.post(this.BaseUrl+'/ApplicationUser/Login',formData);
}

getUserProfile(){
  // var tokenHeader = new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
  // return this.http.get(this.BaseUrl+'/UserProfile', { headers : tokenHeader });
  return this.http.get(this.BaseUrl+'/UserProfile');
}

// roleMatch(allowedRoles):boolean{
//   var isMatch = false;
//   var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
//   var userRole = payLoad.role;
//   allowedRoles.forEach(element => {
//     if(userRole==element){
//       isMatch=true;
//       return false;
//     }
//   });
//   return isMatch;
// }

roleMatch(allowedRoles):boolean{
  var isMatch=false;
  var payLoad=JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
  var UserRole=payLoad.role;
  allowedRoles.forEach(element => {
    if(UserRole==element){
    isMatch=true;
    return false;
    }  
  });
  return isMatch;
}

}