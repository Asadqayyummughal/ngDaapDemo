import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTheme, ThemeService } from '@lib/services/theme';
import { NavBarComponent } from '@pages/layout/nav-bar/nav-bar.component';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, NavBarComponent],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    currentTheme!: AppTheme | null;
    private readonly _themeService = inject(ThemeService);
    private readonly _destroy$ = new Subject();
    networkName: string = 'Not Connected';
    private subs: Subscription[] = [];
    ngOnInit(): void {
        this._themeService.currentTheme$
            .pipe(takeUntil(this._destroy$))
            .subscribe((theme) => (this.currentTheme = theme));

        this.subs.push();
    }

    handleThemeChange(theme: AppTheme): void {
        this._themeService.setTheme(theme);
    }
    ngOnDestroy(): void {
        this._destroy$.complete();
        this._destroy$.unsubscribe();
    }
}
