import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function Header(props) {
  return <header><h1><a href="/" onClick={(evt) => {
    evt.preventDefault();
    props.onSelect();
  }}>Web</a></h1></header>
}

function Nav(props) {
  const liTags = props.data.map((e) => {
    return <li key={e.id}><a href={'/read/'+e.id} onClick={(evt) => {
      evt.preventDefault(); // 클릭 시 a태그 발동하지 않도록
      props.onSelect(e.id); // e는 클로저로 인해 사용? e는 map함수로 정의되어 접근 가능(클로저)
    }}>{e.title}</a></li>
  });
  return (
    <nav>
      <ol>
        {liTags}
      </ol>
    </nav>
  );
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME'); // 새로 만들어진 상태의 default value
  const [id, setId] = useState(null);
  const topics = [
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'},
  ];
  let content = null;
  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB!"></Article>;
  } else if(mode === 'READ') {
    const topic = topics.filter(e => {
      if(e.id === id) {
        return true;
      } else {
        return false;
      }
    })[0];
    content = <Article title={topic.title} body={topic.body}></Article>;
  }
  return (
    <div>
      <Header onSelect={() => {
        setMode('WELCOME');
      }}></Header>
      <Nav data={topics} onSelect={(id) => {
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <ButtonGroup>
        <Button variant="outlined" onClick={() => {
          alert('create!');
        }}>Create</Button>
        <Button variant="outlined">Update</Button>
      </ButtonGroup>
      <Button variant="outlined">Delete</Button>
    </div>
  );
}

export default App;
