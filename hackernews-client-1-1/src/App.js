import React from 'react';
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

  return (
    <div className="App">
      <List list={stories}/>
    </div>
  );
};

const List = props => {
  return props.list.map(item =>
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title}</a>:
      </span>
      <span>{item.author}</span>
    </div>
  )
};

export default App;