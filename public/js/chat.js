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
  room : "",
  /**
  * 소켓 서버로 메세지 전송
  *
  * @param String message 전송할 메세지
  */
  send : function(message, userNm) {
    const data = {
      userNm : userNm,
      message : message,
    };
    socket.emit("chat", data);
  },
};

/**
* 메세지 수신 부분
*
*/
socket.on('chat', (data) => {
  //console.log(data);
  let html = $("#chat_template").html();
  html = html.replace(/<%=message%>/g, data.message);
  $(".chat .contents").append(html);
});

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
