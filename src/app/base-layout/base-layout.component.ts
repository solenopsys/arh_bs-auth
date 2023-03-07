import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {ColorSchemesService} from "@solenopsys/ui-themes";

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class BaseLayoutComponent implements OnInit {
  constructor(private cs: ColorSchemesService,   private elementRef: ElementRef,) {

    console.log("INIT COLORS", this.elementRef.nativeElement.style)
    cs.initColors(this.elementRef.nativeElement.style);
  }

  ngOnInit(): void {}
}
