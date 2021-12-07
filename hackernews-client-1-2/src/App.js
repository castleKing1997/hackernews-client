import React, { useState } from 'react';
import './App.css';

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://facebook.github.io/react/',
      author: 'Jordan Walke',
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://github.com/reactjs/redux',
      author: 'Dan Abramov, Andrew Clark',
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("React");

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story => story.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <Search search={searchTerm} onSearch={handleSearch} />
      <hr/>
      <List list={searchedStories}/>
    </div>
  );
};

const Search = props => (
  <div>
    <label htmlFor="search">Search:</label>
    <input id="search" type="text" onChange={props.onSearch} value={props.search}/>
  </div>
);

const List = props => props.list.map(item =>
  <div key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>:
    </span>
    <span>{item.author}</span>
  </div>
);

export default App;