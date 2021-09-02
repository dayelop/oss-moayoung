/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { TopBar } from '../components';

const background = css`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const container = css`
  width: 1000px;
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
  const [flag, setFlag] = useState(0);
  const [placeholder, setPlaceholder] = useState('통화방 링크 입력');
  const [roomUrl, setRoomUrl] = useState('');
  const [toggle, setToggle] = useState(0);

  const createRoom = () => {
    window.location.href = 'http://127.0.0.1:8887/dist/';
  };
  const linkInput = () => {
    const link = document.getElementById('link');

    if (link.value) {
      setPlaceholder('이름 입력');
      setRoomUrl(roomUrl + link.value);
      setToggle(!toggle);
      link.type = 'text';
      link.value = '';
    }
  };
  const nameInput = () => {
    const link = document.getElementById('link');

    if (link.value) {
      setFlag(1);
      setRoomUrl(`${roomUrl}/${link.value}`);
    }
  };

  useEffect(() => {
    window.open(roomUrl);
  }, [flag]);

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
          <form>
            <input
              type="url"
              id="link"
              css={input}
              placeholder={placeholder}
              required
            />
            <input
              type="submit"
              value="참여"
              css={button}
              onClick={!toggle ? linkInput : nameInput}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
