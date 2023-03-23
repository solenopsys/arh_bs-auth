import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  state: string;
  constructor() {
    //get parametr from url

  }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.state=urlParams.get('state');
  }
}
