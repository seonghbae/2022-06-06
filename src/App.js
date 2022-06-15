import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from 'styled-components';
import { Link, Routes, Route, useParams } from 'react-router-dom';

function Header(props) {
  return <header><h1><Link to="/" onClick={(evt) => {
    // evt.preventDefault();
    props.onSelect();
  }}>Web</Link></h1></header>
}

const HeaderStyled = styled(Header)`
  border-bottom: 1px solid gray;
  color: red;
`;

function Nav(props) {
  const liTags = props.data.map((e) => {
    return <li key={e.id}><Link to={'/read/'+e.id} onClick={(evt) => {
      // evt.preventDefault(); // 클릭 시 a태그 발동하지 않도록
      props.onSelect(e.id); // e는 클로저로 인해 사용? e는 map함수로 정의되어 접근 가능(클로저)
    }}>{e.title}</Link></li>
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
  const [mode, setMode] = useState('WELCOME'); // 새로 만들어진 상태의 default value todo 삭제 예정
  const [id, setId] = useState(null); // todo 삭제 예정
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'},
  ]);
  return (
    <div>
      <HeaderStyled onSelect={headerHandler()}></HeaderStyled>
      <Nav data={topics} onSelect={navHandler()}></Nav>
      <Routes>
        <Route path="/" element={<Article title="Welcome" body="Hello, WEB!"></Article>}></Route>
        <Route path="/create" element={<Create onCreate={onCreateHandler()}></Create>}></Route>
        <Route path="/read/:topic_id" element={<Read topics={topics}></Read>}></Route>
      </Routes>
      <ButtonGroup>
        <Button component={Link} to="/create" variant="outlined" onClick={createHandler()}>Create</Button>
        <Button variant="outlined">Update</Button>
      </ButtonGroup>
      <Button variant="outlined" onClick={deleteHandler()}>Delete</Button>
    </div>
  );

  function Read(props) {
    const params = useParams();
    const id = Number(params.topic_id);
    const topic = props.topics.filter(e => {
      if(e.id === id) {
        return true;
      } else {
        return false;
      }
    })[0];
    return <Article title={topic.title} body={topic.body}></Article>;
  }

  function onCreateHandler() {
    return (title, body) => {
      const newTopic = { id: nextId, title, body };
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setNextId(nextId + 1);
    };
  }

  function navHandler() {
    return (id) => {
      setMode('READ');
      setId(id);
    };
  }

  function deleteHandler() {
    return () => {
      const newTopics = topics.filter((e) => {
        if (e.id === id) {
          return false;
        } else {
          return true;
        }
      });
      setMode('WELCOME'); // 삭제한 글의 내용을 읽을 수 없기 때문에 mode 변경
      setTopics(newTopics);
    };
  }

  function createHandler() {
    return () => {
      setMode('CREATE');
    };
  }

  function headerHandler() {
    return () => {
      setMode('WELCOME');
    };
  }
}

export default App;
