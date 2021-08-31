import React, { ChangeEvent, FocusEvent } from 'react';
import styled from '@emotion/styled';

import Input from '@/components/common/Input';
import InputLabel from '@/components/common/InputLabel';
import { baeminFont } from '@/static/style/common';

type Stage2Props = {
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  form: { receiverName: string; receiverAddress: string; receiverPhone: string };
  error?: { [key: string]: string };
};

const Stage2 = ({ form, onChange, error }: Stage2Props) => {
  return (
    <StageContainer>
      <InputLabel labelName="받을실 분" />
      <Input
        name="receiverName"
        required={true}
        variant="outlined"
        size="large"
        onChange={onChange}
        value={form.receiverName}
        error={error}
        placeholder="받을실 분을 입력해 주세요."
      />
      <InputLabel labelName="받으실 곳" />
      <Input
        name="receiverAddress"
        required={true}
        variant="outlined"
        size="large"
        onChange={onChange}
        value={form.receiverAddress}
        error={error}
        placeholder="받으실 곳을 입력해 주세요."
      />
      <InputLabel labelName="휴대폰" />
      <Input
        name="receiverPhone"
        required
        variant="outlined"
        size="large"
        onChange={onChange}
        value={form.receiverPhone}
        error={error}
        placeholder="휴대폰 번호를 입력해 주세요."
      />
    </StageContainer>
  );
};

const StageContainer = styled.div`
  & div {
    margin-bottom: 30px;
  }
  Input {
    font-family: ${baeminFont};
  }
  label {
    font-family: ${baeminFont};
  }
`;

export default Stage2;
