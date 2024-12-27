import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HeroAd } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-marquee-ad',
  templateUrl: './marquee-ad.component.html',
  styleUrls: ['./marquee-ad.component.scss'],
})
export class MarqueeAdComponent implements OnInit {
@Input() heroAd: HeroAd;
@Input() isDemo: boolean = false;
@Input() isCategoryAd: boolean = false;
@ViewChild('slidingAd')
  public slidingAd: ElementRef;
  constructor(private router: Router) {}

  ngOnInit() {}
  
  public goToProfile() {
    this.router.navigateByUrl(this.heroAd.vendor.profilePath);
  }
}
