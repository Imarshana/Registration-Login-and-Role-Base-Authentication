import { UserService } from './../shared/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   *
   */
  constructor(private route:Router,
              private service:UserService) {
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(localStorage.getItem('token')!=null){
        let roles = next.data['permittedRoles'] as Array<string>;
        if(roles){
         if( this.service.roleMatch(roles)) return true;
         else{
           this.route.navigate(['/forbidden']);
           return false;
         }
          
        }
        return true;
      }
      else{
      this.route.navigate(['/user/login']);
      return false;
      }

  }
}
