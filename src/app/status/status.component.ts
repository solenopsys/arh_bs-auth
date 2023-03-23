import {Component, OnInit} from '@angular/core';
import {Auth, SessionsService} from "../sessions.sevice";

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
    public sessions: any;

    constructor(private ss: SessionsService) {
    }


    ngOnInit(): void {
        this.ss.getSessions().then(sessions => this.sessions = sessions);
    }
}
