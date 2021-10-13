/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { TopBar } from '../components';

const background = css`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const container = css`
  width: 65%;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;

  & p:first-of-type {
    color: #eee;
    font-family: 'S-CoreDream-5Medium';
    font-size: 32.5px;
  }
  & p:last-of-type {
    font-family: 'S-CoreDream-4Regular';
    font-size: 25px;
  }
`;
const participate = css`
  width: calc(400px + 82.4px);
  display: flex;
`;
const input = css`
  width: 400px;
  height: 50px;
  padding: 15px 25px;
  border: none;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  color: black;
  background-color: whitesmoke;
  font-size: 20px;
  font-family: 'S-CoreDream-5Medium';

  :focus {
    outline: none;
  }
  ::placeholder {
    color: black;
  }
`;
const button = css`
  height: 50px;
  padding: 0px 20px;
  border: solid 2px whitesmoke;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  cursor: pointer;
  background-color: black;
  font-size: 20px;
  font-family: 'S-CoreDream-5Medium';

  :hover {
    background-color: #0071e3;
  }
`;
const menu = css`
  width: calc(400px + 82.4px);
  height: 50px;
  margin-top: 75px;
  margin-bottom: 20px;
  padding: 0px 25px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  background-color: #0071e3;
  font-size: 20px;
  font-family: 'S-CoreDream-5Medium';
  text-align: left;

  :hover {
    background-color: #0058b0;
  }
`;

function Home() {
  const [isValid, setValid] = useState(true);

  const createRoom = () => {
    window.location.href = 'https://moayoung-b2596.web.app/';
  };
  const onChange = () => {
    setValid(true);
  };
  const enterRoom = () => {
    const roomName = document.getElementById('roomName').value;
    const link = 'https://moayoung-b2596.web.app/' + roomName;

    if (roomName) {
      window.location.href = link;
    } else {
      alert('입장할 통화방의 이름을 입력하세요.');
      setValid(false);
    }
  };

  return (
    <div css={background}>
      <TopBar />
      <div css={container}>
        <p>모두를 아우르는 영상 통화 서비스</p>
        <p>
          <br />
          누구에게나 편리한 화상 통화를
          <br />
          언제 어디서든 무료로 이용할 수 있습니다.
        </p>
        <button css={menu} onClick={createRoom}>
          + 새 통화방 생성
        </button>
        <div css={participate}>
          <input
            type="text"
            id="roomName"
            css={input}
            style={{ backgroundColor: isValid ? 'whitesmoke' : 'pink' }}
            placeholder="통화방 이름 입력"
            onChange={onChange}
            autoFocus
            required
          />
          <input type="submit" value="입장" css={button} onClick={enterRoom} />
        </div>
      </div>
    </div>
  );
}

export default Home;
