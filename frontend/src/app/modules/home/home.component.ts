import { Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Subject, takeUntil } from 'rxjs';
import { AccountModel } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    public homeService: HomeService
  ) {
  }

  // Subject to handle subscription cleanup
  private destroy$: Subject<void> = new Subject<void>();

  data: AccountModel;

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Fetches data from the HomeService
   */
  private fetchData() {
    this.homeService.getData().pipe(
      takeUntil(this.destroy$))
      .subscribe(resp => {
        this.data = resp;
        // console.log(this.data)
      });
  }
}
