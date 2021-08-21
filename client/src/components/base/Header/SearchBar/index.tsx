import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { nanoid } from 'nanoid';

import SearchHistoryComponent from '../SearchHistory';

import { getDateFormat } from '@/utils/dateParse';
import useLocalStorage from '@/hooks/customHooks/useLocalStorage';

const SearchBar = () => {
  const [history, setHistory] = useLocalStorage('searchs', []);
  const [nameForSearch, setNameForSearch] = useState('');
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    registerDomClickEvent();
  }, []);

  const handleFocusInput = () => {
    setShowHistory(true);
  };

  /**
   * TODO:
   * target.id === 'content'
   * Text 결과로 새 페이지에 보여줘야함.
   */
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const { target } = e;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === 'close') {
      setShowHistory(false);
    } else if (target.id === 'remove') {
      const idx = Number(target.dataset.idx);
      const idxToRemove = history.length - 1 - idx;
      const newHistory = history.length > 1 ? [...history].splice(idxToRemove, 1) : [];
      setHistory(newHistory);
    } else if (target.id === 'clear') {
      setHistory([]);
    } else if (target.id === 'content') {
      console.log(target.innerText);
    } else return;
  };

  const registerDomClickEvent = () => {
    document.addEventListener('click', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLElement)) return;
      if (!target.closest('#search')) setShowHistory(false);
    });
  };

  const createNewHistory = (value: string) => {
    const newHistory = history.length === 10 ? [...history].slice(0, 9) : [...history];
    setHistory([{ id: nanoid(), content: value, day: getDateFormat('', 'dot') }, ...newHistory]);
    setNameForSearch('');
  };

  const handleClickImg = () => {
    createNewHistory(nameForSearch);
  };

  const handleKeyPressInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') createNewHistory(e.currentTarget.value);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameForSearch(e.currentTarget.value);
  };

  return (
    <SearchContainer id="search">
      <SearchInput
        onFocus={handleFocusInput}
        placeholder="검색어를 입력해 주세요"
        onKeyPress={handleKeyPressInput}
        onChange={handleChangeInput}
        value={nameForSearch}
        required
      />
      <Button>
        <SearchImg src="images/search.png" onClick={handleClickImg} />
      </Button>

      {showHistory && <SearchHistoryComponent handleClick={handleClick} histories={history} />}
    </SearchContainer>
  );
};

export default SearchBar;

const SearchContainer = styled.div`
  position: relative;
  grid-column-start: 7;
  grid-column-end: 9;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  height: 34px;
  font-size: 14px;
  flex-grow: 1;
  border-bottom: 1px solid #000000;
`;

const Button = styled.button`
  width: 34px;
  height: 34px;
`;

const SearchImg = styled.img`
  width: 100%;
`;
