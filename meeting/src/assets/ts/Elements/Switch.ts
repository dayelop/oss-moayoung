import { App } from "../app";

declare var Vue: any;

export class Switch {
    app: App;
    switchVueObject: any; 

    faceDetect: HTMLElement;
    faceDetectOn: boolean = false;
    subtitleExtract: HTMLElement;
    subtitleExtractOn: boolean = false;
    libMagnify: HTMLElement;
    libMagnifyOn: boolean = false;
    participantAlarm: HTMLElement;
    participantAlarmOn: boolean = false;


    constructor(app: App){
        this.app = app;
        this.initialElements();
    }

    initialElements(){
        let cla = this;
        const app = this.app;

        this.switchVueObject = new Vue({
            data: {
                faceDetect: document.getElementById("faceDetect"),  
                subtitleExtract: document.getElementById("subtitleExtract"),
                libMagnify: document.getElementById("libMagnify"),
                participantAlarm: document.getElementById("participantAlarm"),
            },
            methods: {
                toggleFaceDetect: function() {
                    $(this.faceDetect).prop('checked', !($(this.faceDetect).prop('checked')));
                },
                toggleSubtitleExtract: function() {
                    $(this.subtitleExtract).prop('checked', !($(this.subtitleExtract).prop('checked')));
                },
                toggleLibMagnify: function() {
                    $(this.libMagnify).prop('checked', !($(this.libMagnify).prop('checked')));
                },
                toggleParticipantAlarm: function() {
                    $(this.participantAlarm).prop('checked', !($(this.participantAlarm).prop('checked')));
                },
            }
        });
    }
}
