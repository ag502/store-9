import React, { useMemo, useState } from 'react';
import guguStyled from '@/core/styled';

import ModalPortal from '@/utils/portal';
import PostModal from '../common/PostModal';
import ListTable from '../common/ListTable';
import Cell from '../common/Cell';
import EmptyPannel from '../common/EmptyPannel';

import useHistory from '@/hooks/customHooks/useHistory';
import { getDateFormat } from '@/utils/dateParse';
import { greyButton } from '@/static/style/common';

type OrderContentProps = {
  orderProducts: any;
};

const tableHeader = [
  { id: 'orderDate', name: '주문 날짜', width: '10%' },
  { id: 'productName', name: '상품명', width: '60%' },
  { id: 'price', name: '상품금액/수량', width: '15%' },
  { id: 'review', name: '리뷰작성', width: '15%' },
];

const ProductInfoCell = ({ thumbNail, name }) => {
  return (
    <Cell textAlign="left">
      <ProdcutImg referrerPolicy="no-referrer" src={thumbNail} />
      <span>{name}</span>
    </Cell>
  );
};

const ReviewButton = ({ isReviewed, onEnroll, onModify }) => {
  const buttonName = isReviewed ? '리뷰수정' : '리뷰작성';
  return (
    <Cell>
      <Button isReview={isReviewed} onClick={isReviewed ? onModify : onEnroll}>
        {buttonName}
      </Button>
    </Cell>
  );
};

const OrderContent = ({ orderProducts }: OrderContentProps) => {
  const [activeModal, setActiveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const history = useHistory();

  const handleClickModifyReviewBtn = (e) => {
    e.stopPropagation();
    history.push('/mypage/review');
  };

  const handleClickReviewBtn = (idx) => (e) => {
    e.stopPropagation();
    const [parentIdx, childIdx] = idx.split('_');
    const { orderItems } = orderProducts[parentIdx];
    const { productId, thumbnail, productName } = orderItems[childIdx];
    setSelectedProduct({ product: { id: productId, thumbnail, name: productName } });
    handleOpenModal();
  };

  const handleCloseModal = () => {
    setActiveModal(false);
  };

  const handleOpenModal = () => {
    setActiveModal(true);
  };

  const handleClickRow = (idx) => {
    const [parentIdx, childIdx] = idx.split('_');
    const { orderItems } = orderProducts[parentIdx];
    const { productId } = orderItems[childIdx];
    history.push(`/detail?id=${productId}`);
  };

  const tableBody = useMemo(() => {
    const result = [];
    orderProducts.forEach((orderProduct, idx) => {
      const { id, updatedAt, orderItems } = orderProduct;
      orderItems.forEach((orderItem, sub_idx) => {
        const { productName, thumbnail, price, isReviewed, amount } = orderItem;
        result.push({
          id: `${idx}_${sub_idx}`,
          cells: [
            { c: <Cell>{getDateFormat(updatedAt)}</Cell>, colSpan: 1 },
            { c: <ProductInfoCell thumbNail={thumbnail} name={productName} />, colSpan: 1 },
            {
              c: (
                <Cell>
                  {Number(price).toLocaleString()}원/{amount}개
                </Cell>
              ),
              colSpan: 1,
            },
            {
              c: (
                <ReviewButton
                  isReviewed={isReviewed}
                  onModify={handleClickModifyReviewBtn}
                  onEnroll={handleClickReviewBtn(`${idx}_${sub_idx}`)}
                />
              ),
              colSpan: 1,
            },
          ],
        });
      });
    });
    return result;
  }, [orderProducts]);

  return (
    <OrderContentContainer>
      {orderProducts.length === 0 ? (
        <EmptyPannel />
      ) : (
        <ListTable header={tableHeader} body={tableBody} onClickRow={handleClickRow} />
      )}
      {activeModal && (
        <ModalPortal>
          <PostModal
            title="상품 후기"
            item={selectedProduct}
            onClose={handleCloseModal}
            formType={{ form: 'REVIEW', mode: 'ENROLL' }}
          />
        </ModalPortal>
      )}
    </OrderContentContainer>
  );
};

const OrderContentContainer = guguStyled.div``;

const ProdcutImg = guguStyled.img`
  width: 50px;
  margin-right: 10px;
`;

const Button = guguStyled.button`
  padding: 5px;
  border-radius: 5px;
  border: ${({ isReview }) => (isReview ? `1px solid ${greyButton};` : `1px solid black;`)}
  color: ${({ isReview }) => (isReview ? greyButton : 'black')}
`;

export default OrderContent;
