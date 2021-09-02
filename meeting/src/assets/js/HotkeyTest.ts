import { App } from '../ts/app';
import { Switch } from '../ts/Elements/Switch';

declare var Vue: any;

export class HotkeyTest{
    app: App;
    hotkeyVueObject: any; 


    constructor(app: App){
        this.app = app;
        this.initialElements();
        this.testMethod();
    }

    initialElements(){
        let cla = this;
        const app = this.app;

        this.hotkeyVueObject = new Vue({
            el: '#hotkey',
            method: {

            }
        });
    }

    testMethod(){
        var cla = this;
        const app = this.app;
        $(window).on("load",  function () {
            var isCtrl = false;

            document.onkeyup = function (e) {
                if (e.which == 17) isCtrl = false;
            };

            document.onkeydown = function (e) {
                if (e.which == 17) isCtrl = true;

                if (e.which == 77 && isCtrl == true) {
                    //mic
                    console.log('mic');
                    app.controls.controlsVueObject.toogleMicrophone();
                    return false;
                }

                if (e.which == 67 && isCtrl == true) {
                    //cam
                    console.log('cam');
                    app.controls.controlsVueObject.toogleCamera();
                    return false;
                }

                if (e.which == 83 && isCtrl == true) {
                    //share
                    console.log('share');
                    app.controls.controlsVueObject.toogleScreen();
                    return false;
                }

                if (e.which == 79 && isCtrl == true) {
                    //option
                    console.log('option');
                    app.controls.controlsVueObject.toogleOption();
                    return false;
                }

                if (e.which == 69 && isCtrl == true) {
                    //exit
                    console.log('exit');
                    return false;
                }

                if (e.which == 70 && isCtrl == true) {
                    //face
                    console.log('face');
                    app.switch_.switchVueObject.toggleFaceDetect();
                    return false;
                }

                if (e.which == 66 && isCtrl == true) {
                    //su[b]title
                    console.log('subtitle');
                    app.switch_.switchVueObject.toggleSubtitleExtract();
                    return false;
                }

                if (e.which == 76 && isCtrl == true) {
                    //lib
                    console.log('lib');
                    app.switch_.switchVueObject.toggleLibMagnify();
                    return false;
                }

                if (e.which == 65 && isCtrl == true) {
                    //alarm
                    console.log('alarm');
                    app.switch_.switchVueObject.toggleParticipantAlarm();
                    return false;
                }
        };
});
    }
}