# <div align="center">oss-moayoung</div><br>

<br>

<div align="center">

![license](https://img.shields.io/crates/l/ap?color=white)
![contributors](https://img.shields.io/github/contributors/daaaayeah/oss-moayoung?color=white)
![last-commit](https://img.shields.io/github/last-commit/daaaayeah/oss-moayoung?color=white)

</div>

![home](https://user-images.githubusercontent.com/52737532/140634543-7fad0d92-ff95-46fa-a5f2-6f78bc6dc7e4.png)

Video calling service that encompasses everyone (hereinafter referred to as "moayoung") is a web-based service that anyone can conveniently use regardless of vision or hearing impairment. moayoung's users can participate in video calls only by accessing the website without a separate software installation process, and various convenience features can relieve visual, hearing, and functional discomfort.

## Features

- Detecting that it's out of frame
- Zoom in on the speaker's mouth
- Automatic subtitle generation
- Participant notification.

## Browser support

<img src="https://img.shields.io/badge/chrome-4285F4?style=flat-square&logo=Google Chrome&logoColor=white" width="100" height="32"/> <img src="https://img.shields.io/badge/Microsoft Edge-0078D7?style=flat-square&logo=Microsoft Edge&logoColor=white" width="150" height="32"/>

## Using moayoung

<a href="https://moayoung-call.web.app/">🏠 Go to moayoung !</a>

<a href="https://github.com/daaaayeah/oss-moayoung/wiki">🔍 moayoung wiki</a>

## Contributing to moayoung

[CONTRIBUTING.md](CONTRIBUTING.md)

## Directory Structure

### homepage

<details>
  <summary>Click to toggle</summary>
  <pre>📦src
┣ 📂components
┃ ┣ 📜index.js
┃ ┗ 📜TopBar.js
┣ 📂pages
┃ ┣ 📜Home.js
┃ ┣ 📜Hotkey.js
┃ ┗ 📜index.js
┣ 📜App.css
┣ 📜App.js
┗ 📜index.js</pre>
</details>

### meeting

<details>
  <summary>Click to toggle</summary>
  <pre>📦src
 ┣ 📂assets
 ┃ ┣ 📂images
 ┃ ┃ ┗ 📜chat.png
 ┃ ┣ 📂sass
 ┃ ┃ ┣ 📂lib
 ┃ ┃ ┃ ┣ 📂alert
 ┃ ┃ ┃ ┃ ┗ 📜alert.scss
 ┃ ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┃ ┗ 📜_chat.scss
 ┃ ┃ ┃ ┣ 📂common
 ┃ ┃ ┃ ┃ ┣ 📜_common.scss
 ┃ ┃ ┃ ┃ ┣ 📜_footer.scss
 ┃ ┃ ┃ ┃ ┣ 📜_main.scss
 ┃ ┃ ┃ ┃ ┗ 📜_sidebar.scss
 ┃ ┃ ┃ ┣ 📂create-room
 ┃ ┃ ┃ ┃ ┣ 📜create-room.scss
 ┃ ┃ ┃ ┃ ┣ 📜setname.scss
 ┃ ┃ ┃ ┃ ┗ 📜waitroom.scss
 ┃ ┃ ┃ ┣ 📂grid
 ┃ ┃ ┃ ┃ ┣ 📂mixins
 ┃ ┃ ┃ ┃ ┃ ┣ 📜main.scss
 ┃ ┃ ┃ ┃ ┃ ┣ 📜_grid-mixins.scss
 ┃ ┃ ┃ ┃ ┃ ┗ 📜_visibility-mixins.scss
 ┃ ┃ ┃ ┃ ┣ 📂variables
 ┃ ┃ ┃ ┃ ┃ ┣ 📜main.scss
 ┃ ┃ ┃ ┃ ┃ ┗ 📜_grid-variables.scss
 ┃ ┃ ┃ ┃ ┣ 📜_grid.scss
 ┃ ┃ ┃ ┃ ┣ 📜_main.scss
 ┃ ┃ ┃ ┃ ┗ 📜_visibility.scss
 ┃ ┃ ┃ ┣ 📂invite
 ┃ ┃ ┃ ┃ ┗ 📜_invite.scss
 ┃ ┃ ┃ ┣ 📂lightbox
 ┃ ┃ ┃ ┃ ┗ 📜_lightbox.scss
 ┃ ┃ ┃ ┣ 📂nointernet
 ┃ ┃ ┃ ┃ ┗ 📜nointernet.scss
 ┃ ┃ ┃ ┣ 📂partnerlist
 ┃ ┃ ┃ ┃ ┗ 📜_partnerlist.scss
 ┃ ┃ ┃ ┣ 📂subtitle
 ┃ ┃ ┃ ┃ ┣ 📜subtitles.scss
 ┃ ┃ ┃ ┃ ┗ 📜sutitle-button.scss
 ┃ ┃ ┃ ┣ 📂switch
 ┃ ┃ ┃ ┃ ┗ 📜switch.scss
 ┃ ┃ ┃ ┣ 📂tabs
 ┃ ┃ ┃ ┃ ┗ 📜_tabs.scss
 ┃ ┃ ┃ ┣ 📂videogrid
 ┃ ┃ ┃ ┃ ┗ 📜_videogrid.scss
 ┃ ┃ ┃ ┣ 📂webfont
 ┃ ┃ ┃ ┃ ┣ 📜_animated.scss
 ┃ ┃ ┃ ┃ ┣ 📜_bordered-pulled.scss
 ┃ ┃ ┃ ┃ ┣ 📜_brands.scss
 ┃ ┃ ┃ ┃ ┣ 📜_core.scss
 ┃ ┃ ┃ ┃ ┣ 📜_fixed-width.scss
 ┃ ┃ ┃ ┃ ┣ 📜_fontawesome.scss
 ┃ ┃ ┃ ┃ ┣ 📜_icons.scss
 ┃ ┃ ┃ ┃ ┣ 📜_larger.scss
 ┃ ┃ ┃ ┃ ┣ 📜_list.scss
 ┃ ┃ ┃ ┃ ┣ 📜_mixins.scss
 ┃ ┃ ┃ ┃ ┣ 📜_regular.scss
 ┃ ┃ ┃ ┃ ┣ 📜_rotated-flipped.scss
 ┃ ┃ ┃ ┃ ┣ 📜_screen-reader.scss
 ┃ ┃ ┃ ┃ ┣ 📜_shims.scss
 ┃ ┃ ┃ ┃ ┣ 📜_solid.scss
 ┃ ┃ ┃ ┃ ┣ 📜_stacked.scss
 ┃ ┃ ┃ ┃ ┣ 📜_v4-shims.scss
 ┃ ┃ ┃ ┃ ┗ 📜_variables.scss
 ┃ ┃ ┃ ┗ 📂welcome
 ┃ ┃ ┃ ┃ ┗ 📜_welcome.scss
 ┃ ┃ ┣ 📜main.scss
 ┃ ┃ ┣ 📜_custom.scss
 ┃ ┃ ┣ 📜_custom.tmp.scss
 ┃ ┃ ┗ 📜_settings.scss
 ┃ ┣ 📂sounds
 ┃ ┃ ┣ 📜hangout.mp3
 ┃ ┃ ┣ 📜messagealert.mp3
 ┃ ┃ ┣ 📜newpartner.mp3
 ┃ ┃ ┗ 📜reload.mp3
 ┃ ┣ 📂translations
 ┃ ┃ ┣ 📜lang.de.js
 ┃ ┃ ┗ 📜lang.en.js
 ┃ ┣ 📂ts
 ┃ ┃ ┣ 📂Communication
 ┃ ┃ ┃ ┣ 📜ICommunication.ts
 ┃ ┃ ┃ ┗ 📜WebRTC.ts
 ┃ ┃ ┣ 📂Database
 ┃ ┃ ┃ ┣ 📜IDatabase.ts
 ┃ ┃ ┃ ┗ 📜IndexedDB.ts
 ┃ ┃ ┣ 📂Elements
 ┃ ┃ ┃ ┣ 📜Alert.ts
 ┃ ┃ ┃ ┣ 📜Configuration.ts
 ┃ ┃ ┃ ┣ 📜Controls.ts
 ┃ ┃ ┃ ┣ 📜CreateRoom.ts
 ┃ ┃ ┃ ┣ 📜Devices.ts
 ┃ ┃ ┃ ┣ 📜Hotkey.ts
 ┃ ┃ ┃ ┣ 📜Invite.ts
 ┃ ┃ ┃ ┣ 📜Lightbox.ts
 ┃ ┃ ┃ ┣ 📜NoInternet.ts
 ┃ ┃ ┃ ┣ 📜PartnerListElement.ts
 ┃ ┃ ┃ ┣ 📜Screen.ts
 ┃ ┃ ┃ ┣ 📜Switch.ts
 ┃ ┃ ┃ ┣ 📜SystemInfo.ts
 ┃ ┃ ┃ ┣ 📜Textchat.ts
 ┃ ┃ ┃ ┣ 📜Userinfo.ts
 ┃ ┃ ┃ ┣ 📜Video.ts
 ┃ ┃ ┃ ┣ 📜Videogrid.ts
 ┃ ┃ ┃ ┗ 📜Welcome.ts
 ┃ ┃ ┣ 📂Exchange
 ┃ ┃ ┃ ┣ 📜ChatServer.ts
 ┃ ┃ ┃ ┣ 📜Firebase.ts
 ┃ ┃ ┃ ┗ 📜IExchange.ts
 ┃ ┃ ┣ 📂Partner
 ┃ ┃ ┃ ┣ 📜IPartner.ts
 ┃ ┃ ┃ ┣ 📜IPartners.ts
 ┃ ┃ ┃ ┗ 📜Partner.ts
 ┃ ┃ ┣ 📂Utils
 ┃ ┃ ┃ ┣ 📜Cookie.ts
 ┃ ┃ ┃ ┣ 📜IceServers.ts
 ┃ ┃ ┃ ┣ 📜JQuery.ts
 ┃ ┃ ┃ ┣ 📜Settings.ts
 ┃ ┃ ┃ ┣ 📜Sounds.ts
 ┃ ┃ ┃ ┗ 📜Translator.ts
 ┃ ┃ ┗ 📜app.ts
 ┃ ┗ 📂webfonts
 ┃ ┃ ┣ 📜fa-brands-400.eot
 ┃ ┃ ┣ 📜fa-brands-400.svg
 ┃ ┃ ┣ 📜fa-brands-400.ttf
 ┃ ┃ ┣ 📜fa-brands-400.woff
 ┃ ┃ ┣ 📜fa-brands-400.woff2
 ┃ ┃ ┣ 📜fa-regular-400.eot
 ┃ ┃ ┣ 📜fa-regular-400.svg
 ┃ ┃ ┣ 📜fa-regular-400.ttf
 ┃ ┃ ┣ 📜fa-regular-400.woff
 ┃ ┃ ┣ 📜fa-regular-400.woff2
 ┃ ┃ ┣ 📜fa-solid-900.eot
 ┃ ┃ ┣ 📜fa-solid-900.svg
 ┃ ┃ ┣ 📜fa-solid-900.ttf
 ┃ ┃ ┣ 📜fa-solid-900.woff
 ┃ ┃ ┗ 📜fa-solid-900.woff2
 ┣ 📜config.json
 ┗ 📜index.html</pre>
</details>

## License

<a  href="https://github.com/daaaayeah/oss-moayoung/blob/main/LICENSE">Apache License 2.0</a>
