import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-grid-system';
import { Redirect } from 'react-router-dom';

import Button from './Button';
import ItemList, { StaticItemList } from './ItemList';
import ItemListHeader from './ItemListHeader';
import {
  approveSelectedApplication,
  rejectSelectedApplication,
  confirmTeamsAndContinue,
} from '../reducers/qm/team';
import Logo from './Logo';

const QMTeams = () => {
  const dispatch = useDispatch();
  const code = useSelector(state => state.quizzMasterApp.roomCode);
  const teamApplications = useSelector(state => state.quizzMasterApp.teamApplications);
  const approvedTeamApplications = useSelector(
    state => state.quizzMasterApp.approvedTeamApplications
  );
  const selectedTeamApplication = useSelector(
    state => state.quizzMasterApp.selectedTeamApplication
  );
  const quizStarted = useSelector(state => state.quizzMasterApp.roomClosed);

  const actionButtonsDisabled = !teamApplications.length || !selectedTeamApplication || quizStarted;
  const middleWidth = 3;

  sessionStorage.setItem("currentRoomCode", code)

  if (!code) {
    console.log("No room code, returning to master")
    return <Redirect to="/master" />;
  } else if (quizStarted) {
    console.log("Room closed? " + quizStarted)
    return <Redirect to="/master/categories" />;
  }

  return (
    <Container className="top-anxiety">
      <Logo center />
      <Row>
        <Col>
          <ItemListHeader>Applied Teams</ItemListHeader>
        </Col>
        <Col>
          <ItemListHeader style={{ textAlign: 'center' }}>Room Code : {code}</ItemListHeader>
        </Col>
        <Col>
          <ItemListHeader>Approved Teams</ItemListHeader>
        </Col>
      </Row>
      <Row style={{ minHeight: '230px' }}>
        <Col>
          <ItemList
            items={teamApplications}
            show="name"
            selectable
            reducer={['quizzMasterApp', 'selectedTeamApplication']}
            dispatchAs="APPLIED"
          />
        </Col>
        <Col xs={middleWidth} className="button-stack">
          <Button
            disabled={actionButtonsDisabled || approvedTeamApplications.length >= 6}
            onClick={() => dispatch(approveSelectedApplication(selectedTeamApplication, code))}
          >
            Approve team
          </Button>
          <Button
            disabled={actionButtonsDisabled}
            onClick={() => dispatch(rejectSelectedApplication(selectedTeamApplication, code))}
          >
            Reject team
          </Button>
          <Button
            disabled={
              approvedTeamApplications.length < 1 ||
              approveSelectedApplication.length >= 6 ||
              quizStarted
            }
            onClick={() => dispatch(confirmTeamsAndContinue(code))}
            className="center-stick-bottom"
          >
            Start Quiz
          </Button>
        </Col>
        <Col>
          <StaticItemList items={approvedTeamApplications} show="name" />
        </Col>
      </Row>
    </Container>
  );
};

export default QMTeams;
