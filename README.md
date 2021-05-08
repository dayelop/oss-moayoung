# Team-Yaho

1. node.js 설치하기
2. npm install -g ngrok
3. npm install -g grunt-cli
4. 크롬 앱 "web server for chrome"을 실행하기
5. 레포지토리 클로한 폴더를 "web server for chrome"에서 Choose Folder에 지정해주기
6. 127.0.0.1~ 이걸로 들어가서 dist 폴더 들어가기 --> 방 만드는 창이 뜸 : 방 만들기
7. 방 만들면 127.0.0.1:8887/dist/#(방이름)으로 주소 나오는데 이 로컬 주소를 다른 사람이랑 공유하려면
8. cmd 창에서 ngrok http 8887 실행
9. 실행하면 주소 2개 나오는데 https~주소 긁어서 그 뒤에 /dist/#(방이름) 붙여서 공유하면 영통 가능


ngrok 
- ngrok 홈페이지 들어가서 로그인 하고 authtoken 받아야함
- cmd에서 ngrok auth~어쩌구 홈페이지에 나와있는거 긁어서 하면 인증 끝남
