import React, { useState, useEffect, useRef, useReducer, useCallback, Fragment} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ReactComponent as Search } from './search.svg';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const StyledContainer = styled.div`
  height: 100vw;
  padding: 20px;
  background: #83a4d4;
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;
const StyledHeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;
const StyledItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;
const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  a {
  color: inherit;
  }
  width: ${props => props.width};
`;
const StyledButton = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  &:hover {
  background: #171212;
  color: #ffffff;
  }
  &:hover > svg > g {
    fill: #ffffff;
    stroke: #ffffff;
  }
`;
const StyledButtonSmall = styled(StyledButton)`
  padding: 5px;
`;
const StyledButtonLarge = styled(StyledButton)`
  padding: 10px;
`;
const StyledSearchForm = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;
const StyledLabel = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;
const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;

// return data
// const getAsyncStories = () =>
//   new Promise(resolve =>
//     setTimeout(
//       () => resolve({ data: { stories: initialStories } }),
//       2000
//     )
// );

// return timeout error
// const getAsyncStories = () =>
//   new Promise((resolve, reject) => setTimeout(reject, 2000));

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
    // eslint-disable-next-line
  }, [value]); 

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
  case 'STORIES_FETCH_INIT':
    return {
      ...state,
      isLoading: true,
      isError: false,
    };
  case 'STORIES_FETCH_SUCCESS':
    return {
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload,
    };
  case 'STORIES_FETCH_FAILURE':
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  case 'REMOVE_STORY':
    return {
      ...state,
      data: state.data.filter(
      story => action.payload.objectID !== story.objectID
      ),
    };
  default:
    throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [url, setUrl] = useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = useCallback( () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    axios
      .get(url)
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        });
      })
      .catch(() =>
        dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
      );
  }, [url]);

  // const handleFetchStories = useCallback(async () => {
  //   dispatchStories({ type: 'STORIES_FETCH_INIT' });
  //   try {
  //     const result = await axios.get(url);
  //     dispatchStories({
  //       type: 'STORIES_FETCH_SUCCESS',
  //       payload: result.data.hits,
  //     });
  //   } catch {
  //     dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
  //   }
  // }, [url]);
  
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <StyledContainer>
      <StyledHeadlinePrimary>My Hacker Stories</StyledHeadlinePrimary>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
        ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </StyledContainer>
  );
};

const InputWithLabel = ({id, value, onInputChange, type="text", children, isFocused}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <Fragment>
      <StyledLabel htmlFor={id}>{children}</StyledLabel>
      &nbsp;
      <StyledInput id={id} type={type} onChange={onInputChange} ref={inputRef} value={value}/>
    </Fragment>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
));

const Item = ({ item, onRemoveItem }) => (
  <StyledItem>
    <StyledColumn width='40%' >
      <a href={item.url}>{item.title}</a>
    </StyledColumn>
    <StyledColumn width='50%'>{item.author}</StyledColumn>
    <StyledColumn width='10%'>
    <StyledButtonSmall
      type="button"
      onClick={() => onRemoveItem(item)}
    >
      Dismiss
    </StyledButtonSmall>
    </StyledColumn>
  </StyledItem>
);

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  }) => (
  <StyledSearchForm onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
    <strong>Search:</strong>
    </InputWithLabel>
    <StyledButtonLarge type="submit" disabled={!searchTerm}>
      <Search height="18px" width="18px" />
    </StyledButtonLarge>
  </StyledSearchForm>
);

export default App;