import React, { useState, useContext, useEffect } from 'react';
import styled from '@emotion/styled';

import Message from '@/components/common/Message';

import { greyLine } from '@/static/style/common';
import { ProductContext } from '@/hooks/context';
import ModalPortal from '@/utils/portal';
import { requireLoginMsg, showErrorMsgTime } from '@/static/constants';

type LikeModeType = 'notlogin' | 'add' | 'remove';
const addLikeMsg = '관심목록에 추가하였습니다.';
const removeLikeMsg = '관심목록에서 제거하였습니다.';

const Like = () => {
  const { info } = useContext(ProductContext);
  const [isIconActive, setIsIconActive] = useState(false);
  const [message, setMessage] = useState<Message>({
    showMessage: false,
    messageContent: '',
    messageMode: 'fail',
  });
  let timer: number = 0;

  useEffect(() => {
    // setIsIconActive(info.userLiked)
    return () => clearTimeout(timer);
  }, []);

  const createMsg = (mode: MessageModeType, title: string) => {
    setMessage({ showMessage: true, messageContent: title, messageMode: mode });

    timer = setTimeout(() => {
      setMessage({ ...message, showMessage: false });
    }, showErrorMsgTime);
  };

  const viewMsgByUserStatus = (mode: LikeModeType) => {
    if (mode === 'notlogin') {
      createMsg('fail', requireLoginMsg);
    } else if (mode === 'add') {
      createMsg('success', addLikeMsg);
    } else if (mode === 'remove') {
      createMsg('success', removeLikeMsg);
    }
  };

  /**
   * TODO:
   * 로그인했다면 2번으로 넘어가서 post 혹은 delete하며 setState 해줍니다 (반환값 필요X)
   * 그 후 관심상품으로 등록하였다는 메시지를 보여줍니다.
   * 로그인이 안됐다면 1번에서 끝납니다.
   *
   * 여기서 분기문 쓰면 됩니다.
   */
  const handleClickBtn = () => {
    // 로그인 안했을때 먼저 처리
    if (isIconActive) {
      viewMsgByUserStatus('remove');
      setIsIconActive(false);
    } else if (!isIconActive) {
      viewMsgByUserStatus('add');
      setIsIconActive(true);
    }
  };

  return (
    <LikeContainer>
      <i className={`${isIconActive ? 'fas' : 'far'} fa-heart`} onClick={handleClickBtn}></i>
      {message.showMessage && (
        <ModalPortal>
          <Message text={message.messageContent} mode={message.messageMode} />
        </ModalPortal>
      )}
    </LikeContainer>
  );
};

export default Like;

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
