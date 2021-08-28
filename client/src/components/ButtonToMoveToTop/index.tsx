import React, { useState } from 'react';
import guguStyled from '@emotion/styled';

import { baemin } from '@/static/style/common';

const ButtonToMoveToTop = () => {
  const [isActive, setIsActive] = useState(false);

  const standardHeight = 800;

  document.addEventListener('scroll', () => {
    if (isActive && window.scrollY < standardHeight) setIsActive(false);
    else if (!isActive && window.scrollY > standardHeight) setIsActive(true);
  });

  const handleClickButton = (e: React.MouseEvent) => {
    const { currentTarget } = e;
    currentTarget.closest('.arrow-button') && window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button className="arrow-button" onClick={handleClickButton} active={isActive}>
      <i className="fas fa-arrow-up"></i>
    </Button>
  );
};

type ButtonProps = {
  active: boolean;
};

const Button = guguStyled.button<ButtonProps>`
  position: fixed;
  bottom: 50px;
  right: 300px;
  width: 60px;
  height: 60px;
  font-size: 40px;
  background-color: ${baemin};
  color: white;
  border-radius: 10px;
  opacity: ${(props) => (props.active ? 1 : 0)};
  pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
  transition: all 0.5s ease-in;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
`;

export default ButtonToMoveToTop;
