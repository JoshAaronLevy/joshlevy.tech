import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private _router: Subscription;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(
    public primengConfig: PrimeNGConfig,
    private renderer: Renderer2,
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    private element: ElementRef,
    public location: Location) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    const navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      if (this.location.path() !== '/sections') {
        if (window.outerWidth > 991) {
          window.document.children[0].scrollTop = 0;
        } else {
          window.document.activeElement.scrollTop = 0;
        }
      }
      this.navbar.sidebarClose();

      this.renderer.listen('window', 'scroll', (event) => {
        const number = window.scrollY;
        let _location = this.location.path();
        _location = _location.split('/')[2];
        if (this.location.path().split('#')[0] !== '/sections') {
          if (number > 150 || window.pageYOffset > 150) {
            // add logic
            if (_location !== 'register') {
              navbar.classList.remove('navbar-transparent');
            }
          } else if (_location !== 'addproduct' && _location !== 'login' && _location !== 'register' && this.location.path() !== '/nucleoicons') {
            return;
            // remove logic
            // navbar.classList.add('navbar-transparent');
          }
        }
      });
    });

    const ua = window.navigator.userAgent;
    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      const version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
  }
  removeFooter() {
    let title = this.location.prepareExternalUrl(this.location.path());
    title = title.slice(1);
    if (title === 'signup' || title === 'nucleoicons') {
      return false;
    } else {
      return true;
    }
  }
}
