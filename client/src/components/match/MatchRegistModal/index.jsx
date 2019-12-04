import React, { useContext, useState } from 'react';
import moment from 'moment';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import TimePicker from 'react-times';
import 'react-times/css/classic/default.css';
import 'react-dates/lib/css/_datepicker.css';
import { MatchContext } from '../../../contexts/Match/Context';
import './index.scss';

const seoulDistrict = [
  { korName: '종로구', engName: 'CNO' },
  { korName: '중  구', engName: 'CGS' },
  { korName: '용산구', engName: 'YSN' },
  { korName: '성동구', engName: 'SDG' },
  { korName: '광진구', engName: 'KJI' },
  { korName: '동대문구', engName: 'TDM' },
  { korName: '중랑구', engName: 'CNG' },
  { korName: '성북구', engName: 'SBK' },
  { korName: '강북구', engName: 'KBK' },
  { korName: '도봉구', engName: 'TBG' },
  { korName: '노원구', engName: 'NWN' },
  { korName: '은평구', engName: 'UPG' },
  { korName: '서대문구', engName: 'SDM' },
  { korName: '마포구', engName: 'MPO' },
  { korName: '양천구', engName: 'YGC' },
  { korName: '강서구', engName: 'KSS' },
  { korName: '구로구', engName: 'KRO' },
  { korName: '금천구', engName: 'KCN' },
  { korName: '영등포구', engName: 'YDP' },
  { korName: '동작구', engName: 'TJK' },
  { korName: '관악구', engName: 'KNK' },
  { korName: '서초구', engName: 'SCO' },
  { korName: '강남구', engName: 'KNM' },
  { korName: '송파구', engName: 'SPA' },
  { korName: '강동구', engName: 'KDG' },
];

const MatchRegistModal = () => {
  const { matchState } = useContext(MatchContext);

  const toggleModalVisible = () => {
    return matchState.isViewRegistModal ? 'visible' : '';
  };

  return (
    <div className={`match-regist-modal ${toggleModalVisible()}`}>
      <div className="modal-container">
        <ModalHeader />
        <ModalForm />
      </div>
      <div className="modal-background" />
    </div>
  );
};

const ModalHeader = () => {
  const { matchState, dispatch } = useContext(MatchContext);
  const handleCloseBtn = () => {
    dispatch({
      type: 'TOGGLE_VIEW_MATCH_REGIST_MODAL',
      isViewRegistModal: matchState.isViewRegistModal,
    });
  };

  return (
    <div className="modal-header">
      <div className="title">
        <p>매치 등록</p>
      </div>
      <div className="close-btn">
        <button type="button" onClick={handleCloseBtn}>
          X
        </button>
      </div>
    </div>
  );
};

const ModalForm = () => {
  return (
    <form className="modal-form">
      <DistrictSection />
      <DateSection />
      <TimeSection />
      <TextInputSection title="구장" idText="matchStadium" />
      <TextInputSection title="주소" idText="matchAddress" />
      <TextInputSection title="비고" idText="matchEtc" maxlen="50" />
      <button type="submit" className="submit-btn">
        <p>등록하기</p>
      </button>
    </form>
  );
};

const DistrictSection = () => {
  return (
    <div className="district-section input-box">
      <select
        id="matchRegistDistrict"
        name="matchRegistDistrict"
        className="match-register__select"
      >
        {seoulDistrict.map((district) => {
          return (
            <option key={district.engName} value={district.engName}>
              {district.korName}
            </option>
          );
        })}
      </select>
      <label htmlFor="matchRegistDistrict" className="match-register__label">
        지역
      </label>
    </div>
  );
};

const DateSection = () => {
  const [focused, setFocused] = useState(false);
  const [matchDay, setMatchDay] = useState(moment());
  const handleDateChange = (date) => setMatchDay(date);

  return (
    <div className="date-section">
      <SingleDatePicker
        numberOfMonths={1}
        onDateChange={(date) => handleDateChange(date)}
        onFocusChange={() => setFocused(!focused)}
        focused={focused}
        date={matchDay}
        id="matchRegistDate"
      />
      <label htmlFor="matchRegistDate" className="match-register__label">
        날짜
      </label>
    </div>
  );
};

const TimeSection = () => {
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const handleTimeChange = (time, fn) => {
    const { hour, minute } = time;
    fn(`${hour}:${minute}`);
  };
  return (
    <>
      <div className="time-section start-time">
        <p className="match-register__label">시작시간</p>
        <TimePicker
          time={startTime}
          onTimeChange={(time) => handleTimeChange(time, setStartTime)}
          theme="classic"
        />
        <input type="hidden" id="matchRegistStartTime" value={startTime} />
      </div>
      <div className="time-section end-time">
        <p className="match-register__label">종료시간</p>
        <TimePicker
          time={endTime}
          onTimeChange={(time) => handleTimeChange(time, setEndTime)}
          theme="classic"
        />
        <input
          type="hidden"
          id="matchRegistEndTime"
          name="matchRegistEndTime"
          value={endTime}
        />
      </div>
    </>
  );
};
const TextInputSection = ({ title, idText, maxlen }) => {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const handleBlurEvent = () => {
    return value !== '' ? setLabel('active') : setLabel('');
  };
  return (
    <div className="input-box">
      <input
        type="text"
        id={idText}
        name={idText}
        maxLength={maxlen === undefined ? 255 : maxlen}
        className="match-register__input"
        onInput={(e) => setValue(e.target.value)}
        onFocus={() => setLabel('active')}
        onBlur={() => handleBlurEvent()}
      />
      <label htmlFor={idText} className={`match-register__label ${label}`}>
        {title}
      </label>
    </div>
  );
};

export default MatchRegistModal;
