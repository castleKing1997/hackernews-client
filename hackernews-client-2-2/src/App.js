import React, { useState, useEffect, useRef, useReducer, useCallback, Fragment} from 'react';
import axios from 'axios'
import styles from "./App.module.css"

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
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
    </div>
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
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      <input id={id} type={type} onChange={onInputChange} ref={inputRef} value={value} className={styles.input}/>
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
  <div className={styles.item}>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '50%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>
    <button
      type="button"
      onClick={() => onRemoveItem(item)}
      className={`${styles.button} ${styles.buttonSmall}`}
    >
      Dismiss
    </button>
    </span>
  </div>
);

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
    <strong>Search:</strong>
    </InputWithLabel>
    <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`}>
      Submit
    </button>
  </form>
);

export default App;