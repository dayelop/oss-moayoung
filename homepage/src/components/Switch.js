/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

const switchContainer = css`
  display: flex;
  justify-content: end;

  .switch-checkbox {
    display: none;
  }

  .switch-checkbox:checked ~ * .ball {
    transform: translateX(24px);
    background-color: white;
  }

  .switch-checkbox:checked + .switch-label {
    background-color: #0071e3;
  }

  .switch-label {
    background-color: #ebedf0;
    position: absolute;
    height: 26px;
    width: 50px;
    border-radius: 50px;
  }

  .ball {
    position: absolute;
    height: 22px;
    width: 22px;
    border-radius: 50px;
    top: 2px;
    left: 2px;

    transition: transform 0.2s linear;
    background-color: #0071e3;
  }
`;

const Switch = (props) => {
  const { isChecked, handleToggle, id } = props;

  return (
    <div css={switchContainer}>
      <input
        type="checkbox"
        className={'switch-checkbox'}
        checked={isChecked}
        onChange={handleToggle}
        id={`switch-input${id}`}
      />
      <label className={'switch-label'} htmlFor={`switch-input${id}`}>
        <div className="ball" />
      </label>
    </div>
  );
};

export default Switch;
