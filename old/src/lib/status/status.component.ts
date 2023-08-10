import {Component, OnInit} from '@angular/core';
import {Auth, SessionsService} from "../sessions.sevice";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
    public sessions: Auth[];

    constructor(private ss: SessionsService) {
    }


    ngOnInit(): void {
        this.loadSessions();
    }

    loadSessions() {
        this.ss.getSessions().then(sessions => {
            console.log("LOADED SESSIONS", sessions)
            this.sessions = sessions
        });
    }

    keyPrefix(key: string): string {
        return key.substr(0, 5)
    }

    protected readonly DatePipe = DatePipe;

    deleteSession(pubKey: any) {
        this.ss.deleteSession(pubKey)
        this.loadSessions()
    }
}
