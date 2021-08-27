import React from 'react';
import styled from '@emotion/styled';

import GIFT1 from '@/static/assets/img/giftSection1.png';
import GIFT2 from '@/static/assets/img/giftSection2.png';
import { baeminFont, normalContainerWidth } from '@/static/style/common';

const GiftSection = () => {
  return (
    <GiftContainer>
      <Title>선물하기 딱 좋아요!</Title>
      <GiftBlock>
        <ImgContainer>
          <Img src={GIFT1} alt="first-gift-image" />
        </ImgContainer>

        <GiftInfo>
          <h3>한 상 가득</h3>
          <span>캬~ 좋다. 을지로 쟁반</span>
        </GiftInfo>
      </GiftBlock>
      <GiftBlock>
        <ImgContainer>
          <Img src={GIFT2} alt="second-gift-image" />
        </ImgContainer>

        <GiftInfo>
          <h3>쉿 비밀펜</h3>
          <span>진짜진짜 아무한테도 말하지마</span>
        </GiftInfo>
      </GiftBlock>
    </GiftContainer>
  );
};

export default GiftSection;

const ImgContainer = styled.div`
  overflow: hidden;
  width: 900px;
  height: 330px;
  border-radius: 18px;
`;

const GiftContainer = styled.div`
  width: ${normalContainerWidth};
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px;
`;

const Img = styled.img`
  cursor: pointer;
  transition: transform 0.2s ease;
  height: 100%;
  &:hover {
    transform: scale(1.1);
  }
`;

const Title = styled.span`
  font-family: ${baeminFont};
  font-size: 26px;
`;

const GiftBlock = styled.div`
  display: flex;
  gap: 70px;
`;

const GiftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;

  h3 {
    font-family: ${baeminFont};
    font-size: 30px;
    font-weight: normal;
    cursor: pointer;
  }
  span {
    font-size: 16px;
    color: #333333;
    font-family: ${baeminFont};
  }
`;
