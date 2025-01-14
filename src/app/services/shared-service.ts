// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private userIdSubject = new BehaviorSubject<string>('');
  private reloadComponentsSource = new Subject<void>();
  reloadComponents$ = this.reloadComponentsSource.asObservable();

  private financeHomeLoaded = new BehaviorSubject<boolean>(false);
  financeHomeLoaded$ = this.financeHomeLoaded.asObservable();

  private initDataLoaded = new BehaviorSubject<boolean>(false);
  initDataLoaded$ = this.initDataLoaded.asObservable();

  constructor(private route: ActivatedRoute) {
    // this.route.queryParams.subscribe((params: Params) => {
    //   const userId = params['userId'] || "0";
    //   this.userIdSubject.next(userId);
    //   sessionStorage.setItem('paramsid',userId)
    // });
  }

  getUserId(): Observable<string> {
     this.route.queryParams.subscribe((params: Params) => {
      const userId = params['userId'] || "0";
      this.userIdSubject.next(userId);
      // sessionStorage.setItem('paramsid',userId)
    });
    return this.userIdSubject.asObservable();
  }

  setFinanceHomeLoaded(isLoaded: boolean) {
    this.financeHomeLoaded.next(isLoaded);
  }

  setinitDataLoaded(isLoaded: boolean) {
    this.initDataLoaded.next(isLoaded);
  }

  reloadComponents() {
    this.reloadComponentsSource.next();
  }
}
