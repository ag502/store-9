import React, { useState } from 'react';
import styled from '@emotion/styled';

import ModalPortal from '@/utils/portal';
import ModalWrapper from '../ModalWrapper';

import { baeminFont, greyLine, greySpan, normalRadius } from '@/static/style/common';
import { OptionModal } from '@/components/Cart';

const TableItem = ({ cartProduct }) => {
  const [activeModal, setActiveModal] = useState(false);
  const { name, thumbnail, price } = cartProduct.product;

  const handleOpenModal = () => {
    setActiveModal(true);
  };

  const handleCloseModal = () => {
    setActiveModal(false);
  };

  return (
    <>
      <TableItemContainer>
        <ProductBasicInfo>
          <ProductImg src={thumbnail} />
          <ProductName>{name}</ProductName>
        </ProductBasicInfo>
        {/* 누르면 상세페이지로 이동할수있도록.. */}
        <ProductPriceInfo>
          <ProductPrice>
            {price.toLocaleString()} 원 / <span>{cartProduct.amount} 개</span>
          </ProductPrice>
          <Button onClick={handleOpenModal}>옵션/수량 변경</Button>
        </ProductPriceInfo>
        <ProductTotalPrice>{(cartProduct.amount * price).toLocaleString()} 원</ProductTotalPrice>
      </TableItemContainer>
      {activeModal && (
        <ModalPortal>
          <ModalWrapper onClose={handleCloseModal} title="옵션변경">
            <OptionModal cartProduct={cartProduct} onClose={handleCloseModal} />
          </ModalWrapper>
        </ModalPortal>
      )}
    </>
  );
};

const TableItemContainer = styled.div`
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
`;

const ProductBasicInfo = styled.div`
  grid-column: 1 / 7;
  display: flex;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 40px;
  margin-right: 10px;
`;

const ProductName = styled.span`
  font-size: 14px;
  font-family: ${baeminFont};
`;

const ProductPriceInfo = styled.div`
  grid-column: 8 / 9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & div {
    text-align: center;
  }
`;

const ProductPrice = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
`;

const Button = styled.button`
  border: 1px solid ${greyLine};
  border-radius: ${normalRadius};
  color: ${greySpan};
  padding: 4px;
  font-family: ${baeminFont};
`;

const ProductTotalPrice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;

export default TableItem;
