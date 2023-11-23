import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'react-grid-system';
import { createRoom } from '../reducers/qm/room';
import Logo from './Logo';
import Button from './Button';
import { CenterLoader } from './Loader';

const QMHome = () => {
  const isLoading = useSelector(state => state.loader.active);
  const websocketConnected = useSelector(state => state.websocket.connected);
  const dispatch = useDispatch();

  const connectClick = language => {
    dispatch(createRoom(language));
  };

  let currRoomCode = sessionStorage.getItem("currentRoomCode")
  const scoreboardClick = roomCode => {
    window.open("/scoreboard")
    //dispatch(loginAsScoreboardViewer(roomCode))
  }

  if (websocketConnected) {
    return <Redirect to="/master/teams" />;
  } else if (isLoading) {
    return <CenterLoader />;
  }
  return (
    <Container className="full-screen center">
      <Row className="focus-center">
        <Col className="button-stack">
          <Logo />
          <h2>Host connection</h2>
          <Button
            onClick={() => connectClick('en')}
            style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}
          >
            Connect!
          </Button>
          <Button
            onClick={() => scoreboardClick(currRoomCode)}
            style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}
          >
            Scoreboard
          </Button>
        </Col>
      </Row>
    </Container >
  );
};

export default QMHome;
