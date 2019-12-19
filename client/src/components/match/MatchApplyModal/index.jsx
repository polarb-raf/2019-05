import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { MatchActionCreator, MatchContext } from '../../../contexts/Match';
import { UserContext } from '../../../contexts/User';
import { post } from '../../../util/requestOptionCreator';
import './index.scss';

const GET_SUBSCRIPTION_REQUEST_URL = `${process.env.REACT_APP_API_SERVER_ADDRESS}/notification/findSubscription`;
const SEND_NOTIFICATION_REQUEST_URL = `${process.env.REACT_APP_API_SERVER_ADDRESS}/notification/sendNotification`;

const ModalHeader = () => {
  const { matchDispatch } = useContext(MatchContext);
  const handleCloseBtn = () => {
    matchDispatch(MatchActionCreator.toggleViewMatchApplyModal());
    matchDispatch(MatchActionCreator.deselectMatchInfo());
  };

  return (
    <div className="modal-header">
      <div className="title">
        <p>매치 신청</p>
      </div>
      <div className="close-btn">
        <button type="button" onClick={handleCloseBtn}>
          <FontAwesomeIcon icon={faTimesCircle} size="2x" />
        </button>
      </div>
    </div>
  );
};

const MatchTeamInfoSection = () => {
  const { matchState } = useContext(MatchContext);
  const [matchInfo, setMatchInfo] = useState(null);
  const [hostInfo, setHostInfo] = useState(null);

  useEffect(() => {
    if (!matchState.selectedMatchInfo) return;
    setMatchInfo(matchState.selectedMatchInfo);
    setHostInfo(matchState.selectedMatchInfo.host);
  }, [matchState.selectedMatchInfo]);

  if (!hostInfo) return null;
  return (
    <div className="modal-main-section">
      <div className="host-name-container">
        <div className="modal-host-info">
          <span className="host-info__title">간단한 소개</span>
          <h3 className="host-name">{hostInfo.name}</h3>
          <p className="host-info__txt">{hostInfo.introduction}</p>
        </div>
        <div className="modal-match-information">
          <span className="modal-info__title">매치 정보</span>
          <p className="match-info__datetime">{`${matchInfo.date}, ${matchInfo.startTime} - ${matchInfo.endTime}`}</p>
          <p className="match-info__location">{`${matchInfo.address} ${matchInfo.stadium}`}</p>
          <p className="modal-info__txt">{matchInfo.description}</p>
        </div>
      </div>
    </div>
  );
};

const getSubscription = async (userId) => {
  const subscription = await axios(
    post(GET_SUBSCRIPTION_REQUEST_URL, {
      userId,
    })
  );
  return subscription.data.subscription;
};

const ApplyButton = (props) => {
  const { userState } = useContext(UserContext);
  const { playerInfo } = userState;
  // eslint-disable-next-line react/prop-types
  const { matchInfo } = props;

  const handleApplyBtn = async () => {
    try {
      if (!userState.playerInfo) {
        alert('로그인을 해야 신청을 할 수 있습니다!');
        return;
      }

      if (!userState.playerInfo.team) {
        alert('팀에 등록이 되어있어야 신청을 할 수 있습니다!');
        return;
      }
      const applicantId = userState.playerInfo.playerId;
      const applicantSub = await getSubscription(applicantId);
      // eslint-disable-next-line react/prop-types
      const hostId = matchInfo.author.playerId;
      const hostSub = await getSubscription(hostId);
      if (!applicantSub || !hostSub) {
        alert(
          '푸시 알람을 보내는데 있어 에러가 났습니다. 새로고침을 해주세요 :('
        );
        return;
      }

      await axios(
        post(SEND_NOTIFICATION_REQUEST_URL, {
          matchInfo,
          subscription: hostSub,
          playerInfo,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleApplyBtn}>
        신청 하기
      </button>
    </div>
  );
};

const MatchApplyModal = () => {
  const { matchState } = useContext(MatchContext);
  const toggleModalVisible = () => {
    return matchState.isViewApplyModal ? 'visible' : '';
  };
  return (
    <div className={`match-apply-modal ${toggleModalVisible()}`}>
      <div className="modal-container">
        <ModalHeader />
        <MatchTeamInfoSection />
        <ApplyButton matchInfo={matchState.selectedMatchInfo} />
      </div>
      <div className="modal-background" />
    </div>
  );
};

export default MatchApplyModal;
