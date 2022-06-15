import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import styled from 'styled-components';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';

function Header(props) {
  return <header><h1><Link to="/" onClick={(evt) => {
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

function Control(props) {
  const params = useParams();
  const id = Number(params.topic_id);
  let contextUI = null;
  if(id) {
    contextUI = <>
      <Button variant="outlined">Update</Button>
      <Button variant="outlined" onClick={() => {props.onDelete(id);}}>Delete</Button>
    </>
  }
  return <>
    <Button component={Link} to="/create" variant="outlined">Create</Button>
    {contextUI}
  </>
}

function App() {
  const [mode, setMode] = useState('WELCOME'); // 새로 만들어진 상태의 default value todo 삭제 예정
  const [id, setId] = useState(null); // todo 삭제 예정
  const [nextId, setNextId] = useState(3);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
  ]);
  useEffect(() => {
    // side effect 작업
    (async () => {
      const response = await fetch('http://localhost:3333/topics');
      const data = await response.json();
      setTopics(data);
    })();
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <HeaderStyled onSelect={headerHandler()}></HeaderStyled>
      <Nav data={topics} onSelect={navHandler()}></Nav>
      <Routes>
        <Route path="/" element={<Article title="Welcome" body="Hello, WEB!"></Article>}></Route>
        <Route path="/create" element={<Create onCreate={onCreateHandler}></Create>}></Route>
        <Route path="/read/:topic_id" element={<Read topics={topics}></Read>}></Route>
      </Routes>
      <Routes>
        {['/', '/read/:topic_id', '/update/:topic_id'].map(path => {
          return <Route key={path} path={path} element={<Control onDelete={(id) => {
            deleteHandler(id);
          }}></Control>}></Route>
        })}
      </Routes>
    </div>
  );

  async function onCreateHandler(title, body) {
    const response = await fetch('http://localhost:3333/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({title, body})
    });
    const data = await response.json(); // id를 반환하기 때문에 nextId 필요 없어짐
    navigate(`/read/${data.id}`);
  }

  function navHandler() {
    return (id) => {
      setMode('READ');
      setId(id);
    };
  }

  function deleteHandler(id) { 
    const newTopics = topics.filter((e) => {
      if (e.id === id) {
        return false;
      } else {
        return true;
      }
    });
    setTopics(newTopics);
    navigate('/'); // 해당 주소로 리프레시없이 보내줌
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
