import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from 'styled-components';

function Header(props) {
  return <header><h1><a href="/" onClick={(evt) => {
    evt.preventDefault();
    props.onSelect();
  }}>Web</a></h1></header>
}

const HeaderStyled = styled(Header)`
  border-bottom: 1px solid grey;
`;

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

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={(evt) => {
      evt.preventDefault(); // 페이지 리프레시 방지
      const title = evt.target.title.value;
      const body = evt.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"></input></p>
      <p><textarea name="body" placeholder="body"></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>;
}

function App() {
  const [mode, setMode] = useState('WELCOME'); // 새로 만들어진 상태의 default value
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'},
  ]);
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
  } else if(mode ==='CREATE') {
    content = <Create onCreate={(title, body) => {
      const newTopic = {id:nextId, title, body};
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setNextId(nextId + 1);
    }}></Create>;
  }
  return (
    <div>
      <HeaderStyled onSelect={() => {
        setMode('WELCOME');
      }}></HeaderStyled>
      <Nav data={topics} onSelect={(id) => {
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <ButtonGroup>
        <Button variant="outlined" onClick={() => {
          setMode('CREATE');
        }}>Create</Button>
        <Button variant="outlined">Update</Button>
      </ButtonGroup>
      <Button variant="outlined" onClick={() => {
        const newTopics = topics.filter((e) => {
          if(e.id === id) {
            return false;
          } else {
            return true;
          }
        });
        setMode('WELCOME'); // 삭제한 글의 내용을 읽을 수 없기 때문에 mode 변경
        setTopics(newTopics);
      }}>Delete</Button>
    </div>
  );
}

export default App;
