/**
* 채팅
*
*/
const socket = io();

/*
socket.emit('chat', '테스트 채팅 메세지');

socket.on('chat', (arg) => {
  console.log(arg);
});
*/

const chat = {
  sessionId : "",
  room : "", // 방이름
  userNm : "", // 사용자 이름

  /**
  * 페이지 접속시 방이름 사용자 이름 설정
  */
  init : function() {
    // location.search
    const uid = new Date().getTime();
    let qs = {};
    location.search.replace("?", '')
                    .split("&")
                    .map((v) => {
                      //console.log(v);
                      v = v.split("=");
                      v[1] = decodeURIComponent(v[1]);
                      qs[v[0]] = v[1];
                    });
                    //console.log(qs);
    this.room = qs.room || 'lobby';
    this.userNm = qs.userNm || uid;
    this.sessionId = "chat_" + uid;

    socket.emit('join', this.room);
  },

  /**
  * 소켓 서버로 메세지 전송
  *
  * @param String message 전송할 메세지
  */
  send : function(message) {
    const data = {
      room : this.room,
      sessionId : this.sessionId,
      userNm : this.userNm,
      message : message,
    };
    socket.emit("chat", data);
  },
  /**
  * 채팅 메세지기 하단으로 고정 되도록 하기
  */
  scrollBottom : function() {
    const $contents = $(".chat .contents");
    $contents[0].scrollTop = $contents[0].scrollHeight;
  },

};

/**
* 메세지 수신 부분
*
*/
socket.on('chat', (data) => {
  //console.log(data);
  let html = $("#chat_template").html();
  let addClass = 'other';
  if (data.userNm == chat.userNm) {
    addClass = 'mine';
  }

  html = html.replace(/<%=addClass%>/g, addClass);
  html = html.replace(/<%=userNm%>/g, data.userNm);
  html = html.replace(/<%=message%>/g, data.message);

  $(".chat .contents").append(html);

  chat.scrollBottom();
});

// 페이지 접속시 초기화
chat.init();

$(function() {
  $(".chat #word").keyup(function(e) {
    // console.log(e.keyCode); 엔터키 찾기 위해서 키코드
    if(e.keyCode == 13) { // 엔터키를 입력한 경우
      const message = $(this).val().trim();
      if (message) { // 전송할 문구가 있는 경우는 서버로 전송 할 것
        chat.send(message);
        $(this).val('');
      }
    }
  });
});
