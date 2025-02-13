import React, { Suspense, useEffect } from 'react';
import { observer } from 'mobx-react';
import guguStyled from '@/core/styled';
import { Router, Route } from './core/Router';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ButtonToMoveToTop from '@/components/ButtonToMoveToTop';
import Loading from './components/common/Loading';
import AuthStore from './stores/AuthStore';
import Redirect from './components/Redirect';
const LoginPage = React.lazy(() => import('@/pages/Login'));
const SignupMethod = React.lazy(() => import('@/pages/SignupMethod'));
const Main = React.lazy(() => import('@/pages/Main'));
const ProductList = React.lazy(() => import('@/pages/ProductList'));
const CartPage = React.lazy(() => import('@/pages/Cart'));
const Order = React.lazy(() => import('@/pages/Order'));
const FinishOrder = React.lazy(() => import('@/pages/FinishOrder'));
const MyPage = React.lazy(() => import('@/pages/MyPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const Signup = React.lazy(() => import('@/pages/Signup'));
const Callback = React.lazy(() => import('@/components/common/Callback'));
const DetailProduct = React.lazy(() => import('@/pages/DetailProduct'));

import { alertMsg } from './utils/errorMessage';

const App = () => {
  useEffect(() => {
    AuthStore.check();
  }, []);
  return (
    <PageContainer>
      <Suspense
        fallback={
          <LoadingContainer>
            <Loading size="big"></Loading>
          </LoadingContainer>
        }
      >
        <Router>
          <Header />
          <Route exact path="/">
            <Main />
          </Route>
          <Route exact path="/login">
            {AuthStore.isLogined ? (
              <Redirect redirectMessage={alertMsg.ALREADY_LOGIN} />
            ) : (
              <LoginPage />
            )}
          </Route>
          <Route exact path="/cart">
            {AuthStore.isLogined ? <CartPage /> : <Redirect />}
          </Route>
          <Route exact path="/order">
            {AuthStore.isLogined ? <Order /> : <Redirect />}
          </Route>
          <Route exact path="/end-order">
            {AuthStore.isLogined ? <FinishOrder /> : <Redirect />}
          </Route>
          <Route path="/mypage">{AuthStore.isLogined ? <MyPage /> : <Redirect />}</Route>
          <Route exact path="/signupMethod">
            {AuthStore.isLogined ? (
              <Redirect redirectMessage={alertMsg.ALREADY_LOGIN} />
            ) : (
              <SignupMethod />
            )}
          </Route>
          <Route exact path="/goods">
            <ProductList />
          </Route>
          <Route exact path="/detail">
            <DetailProduct />
          </Route>
          <Route exact path="/signup">
            {AuthStore.isLogined ? (
              <Redirect redirectMessage={alertMsg.ALREADY_LOGIN} />
            ) : (
              <Signup />
            )}
          </Route>
          <Route exact path="/callback">
            <Callback />
          </Route>
          <Route exact path="/:notfound">
            <NotFound />
          </Route>
        </Router>
        <ButtonToMoveToTop />
        <Footer />
      </Suspense>
    </PageContainer>
  );
};

const PageContainer = guguStyled.div`
  min-width: 1450px;
`;

const LoadingContainer = guguStyled.div`
  position: absolute;
  left: 45%;
  top: 35%;
`;

export default observer(App);
