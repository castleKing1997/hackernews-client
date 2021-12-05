import React, { useState } from 'react';
import './App.css';

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://facebook.github.io/react/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://github.com/reactjs/redux',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  // A
  const handleSearch = event => {
    // C
    console.log(event.target.value);
  };

  return (
    <div className="App">
      <Search onSearch={handleSearch} />
      <hr/>
      <List list={stories}/>
    </div>
  );
};

const Search = props => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = event => {
    setSearchTerm(event.target.value);
    props.onSearch(event);
  };

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={handleChange}/>
      <p>
      Searching for <strong>{searchTerm}</strong>.
      </p>
    </div>
  )
}

const List = props => {
  return props.list.map(item =>
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  )
};

export default App;