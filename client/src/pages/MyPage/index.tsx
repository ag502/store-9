import React from 'react';
import guguStyled from '@/core/styled';

const LikePage = React.lazy(() => import('./Like'));
const OrderPage = React.lazy(() => import('./Order'));
const QnAPage = React.lazy(() => import('./QnA'));
const ReviewPage = React.lazy(() => import('./Reivew'));
import { Route } from '@/core/Router';
import { LeftNav } from '@/components/MyPage';

import { normalContainerWidth, baeminThickFont, baeminFont } from '@/static/style/common';

const MyPage = () => {
  return (
    <MyPageContainer>
      <LeftNav />
      <MyPageContentContiner>
        <MyPageHeader>반가워요</MyPageHeader>
        <UserName>OOO 님</UserName>
        <Route path="/mypage/like">
          <LikePage />
        </Route>
        <Route path="/mypage/order">
          <OrderPage />
        </Route>
        <Route path="/mypage/QnA">
          <QnAPage />
        </Route>
        <Route path="/mypage/review">
          <ReviewPage />
        </Route>
      </MyPageContentContiner>
    </MyPageContainer>
  );
};

const MyPageContainer = guguStyled.div`
  display: flex;
  width: ${normalContainerWidth};
  margin: 0 auto;
  padding: 40px 0 0 0;
  justify-content: center;
  
`;

const MyPageContentContiner = guguStyled.div`
  width: 100%;
`;

const MyPageHeader = guguStyled.h2`
  font-family: ${baeminThickFont};
  font-size: 40px;
  margin-bottom: 10px;
`;

const UserName = guguStyled.div`
  font-size: 20px;
  margin-bottom: 35px;
  font-family: ${baeminFont};
`;

export default MyPage;
