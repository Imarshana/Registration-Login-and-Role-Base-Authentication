import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators'


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private route:Router) {
    }
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if(localStorage.getItem('token')!=null){
            const cloneReq=req.clone({
                headers:req.headers.set('Authorization','Bearer '+ localStorage.getItem('token'))
            });
            return next.handle(cloneReq).pipe(
                tap(
                    succ=>{},
                    err=>{
                        if(err.status==401){
                            localStorage.removeItem('token');
                            this.route.navigateByUrl('/user/login');
                        }
                        else if(err.status==403){
                            this.route.navigateByUrl('/forbidden');


                        }

                   }
                )
            )
        }
        else
        return next.handle(req.clone());
      
    }

}