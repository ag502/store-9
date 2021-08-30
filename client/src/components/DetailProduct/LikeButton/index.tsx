import React, { useState } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';

import Message from '@/components/common/Message';

import ModalPortal from '@/utils/portal';
import { showErrorMsgTime } from '@/static/constants';
import DetailProductStore from '@/stores/DetailProductStore';
import UserApi from '@/apis/UserApi';
import AuthStore from '@/stores/AuthStore';
import { greyLine } from '@/static/style/common';
import { alertMsg } from '@/utils/errorMessage';

type LikeModeType = 'notlogin' | 'add' | 'remove';
let timer: number = 0;

const Like = () => {
  const [message, setMessage] = useState<Message>({
    showMessage: false,
    messageContent: '',
    messageMode: 'fail',
  });

  const createMsg = (mode: MessageModeType, title: string) => {
    setMessage({ showMessage: true, messageContent: title, messageMode: mode });

    timer = setTimeout(() => {
      setMessage({ ...message, showMessage: false });
    }, showErrorMsgTime);
  };

  const viewMsgByUserStatus = (mode: LikeModeType) => {
    if (mode === 'notlogin') {
      createMsg('fail', alertMsg['REQUIRED_LOGIN']);
    } else if (mode === 'add') {
      createMsg('success', alertMsg['SUCCESS_ADD_LIKE']);
    } else if (mode === 'remove') {
      createMsg('success', alertMsg['SUCCESS_REMOVE_LIKE']);
    }
  };

  const handleClickBtn = async () => {
    if (!AuthStore.isLogined) return viewMsgByUserStatus('notlogin');

    try {
      const result = await UserApi.toggleLike({ productId: DetailProductStore.product.productId });
      if (result.ok) {
        DetailProductStore.product.isLike
          ? viewMsgByUserStatus('remove')
          : viewMsgByUserStatus('add');
      }
    } catch (e) {
      viewMsgByUserStatus('notlogin');
    }
  };

  return (
    <LikeContainer>
      <i
        className={`${DetailProductStore.product.isLike ? 'fas' : 'far'} fa-heart`}
        onClick={handleClickBtn}
      ></i>
      {message.showMessage && (
        <ModalPortal>
          <Message text={message.messageContent} mode={message.messageMode} />
        </ModalPortal>
      )}
    </LikeContainer>
  );
};

export default observer(Like);

const LikeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid ${greyLine};
  i {
    cursor: pointer;
    font-size: 25px;
  }
`;
