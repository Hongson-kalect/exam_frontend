import { TextField } from "@mui/material";
import {
  Button,
  Checkbox,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Transfer,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { TransferDirection } from "antd/es/transfer";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "../../stores/appState";
import useExamState from "../../stores/examStates";
import useTestingState from "../../stores/testingState";
import useUserState from "../../stores/userState";
import { getCookie } from "../../utils/cookie";
import { fetchData } from "../../utils/fetchFunction";
import { checkExamStarted, checkValidTime } from "../../utils/functions";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorage";
import { getSession } from "../../utils/session";
import { CheckAllAttempt } from "./SubjectComponent/CheckAllAttempt";
import EditTestRoom from "./SubjectComponent/EditTestRoom";
import { SeeHistory } from "./SubjectComponent/SeeHistory";

import "../../scss/ExamDetail.scss";

const { Option } = Select;
const options = [
  { value: "Easy", label: "Easy" },
  { value: "Normal", label: "Normal" },
  { value: "Hard", label: "Hard" },
  { value: "Extreme", label: "Extreme" },
];
export interface ICreateNewTestProps {}

interface testRoomDetail {
  name: string;
  description: string;
  limitTime: string | number;
  day: string;
  time: string;
}

export default function TestRoomDetail(props: ICreateNewTestProps) {
  const navigate = useNavigate();
  const appState = useAppState();
  const examState = useExamState();
  const userState = useUserState();
  const testingState = useTestingState();
  const params = useParams();
  const [isSeeHistory, setIsSeeHistory] = React.useState(false);
  const [historyDetail, setHistoryDetail] = React.useState(false);
  const [checkAllHistory, setCheckAllHistory] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState<boolean>(false);
  const [history, setHistory] = React.useState<any[]>([]);
  const [isExamStarted, setIsExamStarted] = React.useState(true);
  const [isValidTime, setIsValidTime] = React.useState(false);
  const [showFreeHistoty, setShowFreeHistory] = React.useState(false);
  const [testRoomDetail, setTestRoomDetail] = React.useState<testRoomDetail>({
    name: "",
    description: "",
    limitTime: "",
    day: "",
    time: "",
  });
  const getDetail = async () => {
    appState.setIsLoading(true);
    const fetchRes = await fetchData(
      "test-room/get?subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId +
        "&userId=" +
        userState.userId,
      "get"
    );
    appState.setIsLoading(false);
    setTestRoomDetail(fetchRes.data);
  };
  const getHistory = async () => {
    appState.setIsLoading(true);
    const fetchRes = await fetchData(
      "history/get?subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId +
        "&userId=" +
        userState.userId +
        "&isFree=" +
        (showFreeHistoty ? "1" : "0"),
      "get"
    );
    appState.setIsLoading(false);
    setHistory(fetchRes.data);
  };
  const startExam = async () => {
    appState.setIsLoading(true);
    const timeAttempt = await fetchData(
      "get-attempt?userId=" +
        userState.userId +
        "&subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId
    );
    appState.setIsLoading(false);
    if (timeAttempt.status === 1) {
      if (timeAttempt.freeTest) {
        if (window.confirm("Are you wanna do free test?")) {
          testingState.setTimeAttempt(timeAttempt.timeAttemp);
          examState.setroomId(examState.roomId || "");
          navigate("/exam");
        }
      } else if (
        isValidTime &&
        window.confirm(
          `Do you wanna do the ${
            timeAttempt.timeAttemp === 1
              ? "first"
              : timeAttempt.timeAttemp === 2
              ? "second"
              : timeAttempt.timeAttemp === 3
              ? "third"
              : timeAttempt.timeAttemp + "th"
          } attempt?`
        )
      ) {
        testingState.setTimeAttempt(timeAttempt.timeAttemp);
        examState.setroomId(examState.roomId || "");
        navigate("/exam");
      }
    } else {
      toast.error(timeAttempt.message);
    }
  };
  const deleteRoom = async () => {
    const yes = window.confirm("Are you wanna delete this room?");
    if (yes) {
      appState.setIsLoading(true);
      const deleteRes = await fetchData(
        "test-room/del?id=" +
          examState.roomId +
          "&subjectId=" +
          examState.subjectId +
          "&userId=" +
          userState.userId,
        "delete"
      );
      appState.setIsLoading(false);
      if (deleteRes.status === 1) {
        toast.success("Delete completed");
        navigate(`/${examState.subjectId}`);
      } else toast.error(deleteRes.message);
    }
  };
  const checkUnSubmit = async () => {
    appState.setIsLoading(true);
    const getUnsubmit = await fetchData(
      "history/unsubmit?roomId=" +
        examState.roomId +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
    appState.setIsLoading(false);
    if (getUnsubmit.status === 1) {
      if (getUnsubmit.data) {
        if (window.confirm("You still have test not submit, wanna continue?")) {
          navigate("/exam");
        } else {
          const fetchBody = {
            userId: userState.userId,
            subjectId: examState.subjectId,
            roomId: examState.roomId,
            testId: getUnsubmit.data.testId,
            timeAttemp: getUnsubmit.data.timeAttemp,
          };
          appState.setIsLoading(true);
          const getSubmitTheForget = await fetchData(
            "exam/submit-current",
            "post",
            fetchBody
          );
          appState.setIsLoading(false);
        }
      }
    } else toast.error(getUnsubmit.message);
  };
  const getHistoryDetail = async (e: any) => {
    const data = JSON.parse(e.target.closest(".history-item").dataset.id);
    appState.setIsLoading(true);
    const getData = await fetchData(
      "history/get?id=" +
        data.id +
        "&userId=" +
        userState.userId +
        "&subjectId=" +
        examState.subjectId +
        "&roomId=" +
        data.testRoomId +
        "&testId=" +
        data.testId +
        "&userAnser=" +
        data.userAnser,
      "get"
    );
    appState.setIsLoading(false);
    setHistoryDetail(getData.data);
    setIsSeeHistory(true);
  };

  React.useEffect(() => {
    examState.setState("exam");
    getDetail();
    checkUnSubmit();
  }, []);

  React.useEffect(() => {
    getHistory();
  }, [showFreeHistoty]);

  React.useEffect(() => {
    setIsExamStarted(checkExamStarted(testRoomDetail.day, testRoomDetail.time));
    setIsValidTime(checkValidTime(testRoomDetail.day, testRoomDetail.time));
    let interval: any;
    interval = setInterval(() => {
      setIsExamStarted(
        checkExamStarted(testRoomDetail.day, testRoomDetail.time)
      );
      setIsValidTime(checkValidTime(testRoomDetail.day, testRoomDetail.time));
    }, 5000);
    return () => clearInterval(interval);
  }, [testRoomDetail]);
  console.log(isValidTime, isExamStarted);
  return (
    <div className="exam-detail-comp">
      <p className="header">{testRoomDetail.name}</p>
      <div className="info">
        <div className="time">
          {/* <div> */}
          <p>Day: {testRoomDetail.day}</p>
          <p>Shift: {testRoomDetail.time}</p>
          <p>Limit Time: {testRoomDetail.limitTime}</p>
          {/* </div> */}
        </div>
        <div className="desc">
          <p className="font-semibold">Description: </p>
          {testRoomDetail.description || "Không có mô tả"}
        </div>
      </div>

      <div className="history-title">
        <h2 className="title">History:</h2>
        <input
          className="w-6 h-6 ml-4"
          id="freeTestCheck"
          type="checkbox"
          checked={showFreeHistoty}
          onChange={() => setShowFreeHistory(!showFreeHistoty)}
        />{" "}
        <label htmlFor="freeTestCheck">Show Free test</label>
      </div>

      {/* Render history here */}
      <div className="flex-1 ">
        {history.length === 0 ? (
          <Empty />
        ) : (
          <div className="history-wrap">
            {history.map((item, index) => {
              return (
                <div
                  key={index}
                  className="history-item "
                  data-id={JSON.stringify(item)}
                  onClick={(e) => getHistoryDetail(e)}
                >
                  <p>Attempt {index + 1}</p>
                </div>
              );
            })}
            <div className="grow shrink"></div>
          </div>
        )}
      </div>
      <div className="text-lg px-2 py-1 flex justify-evenly items-end">
        {getSession("permission") !== "member" && (
          <Button
            type="primary"
            className=" bg-yellow-500 hover:!bg-yellow-600 hover:scale-110 transition-all duration-300"
            onClick={() => setIsEdit(true)}
          >
            Edit Info
          </Button>
        )}
        <button
          className={`text-2xl px-4 py-2 border-none rounded-lg cursor-pointer text-white ${
            isValidTime
              ? "bg-cyan-500 hover:bg-cyan-600 hover:scale-110 transition-all duration-300"
              : "bg-gray-500"
          }`}
          onClick={
            isExamStarted
              ? startExam
              : () => window.alert("Please wait to time come")
          }
        >
          Start Attempt
        </button>

        {getSession("permission") !== "member" ? (
          isExamStarted ? (
            <Button
              type="primary"
              className="bg-green-500 hover:!bg-green-600 hover:scale-110 transition-all duration-300"
              onClick={() => setCheckAllHistory(true)}
            >
              Check Result
            </Button>
          ) : (
            <Button
              type="primary"
              className="bg-red-400 hover:!bg-red-600 hover:scale-110 transition-all duration-300"
              onClick={deleteRoom}
            >
              Delete Test Room
            </Button>
          )
        ) : (
          ""
        )}
      </div>
      <Modal
        open={isEdit || isSeeHistory || checkAllHistory}
        onCancel={() => {
          setIsEdit(false);
          setIsSeeHistory(false);
          setCheckAllHistory(false);
        }}
        width={1000}
        closable={false}
        footer={false}
      >
        {checkAllHistory ? (
          <CheckAllAttempt />
        ) : isSeeHistory ? (
          <SeeHistory history={historyDetail} />
        ) : (
          <EditTestRoom
            isExamStart={isExamStarted}
            setIsEdit={setIsEdit}
            getDetail={getDetail}
            editId={examState.roomId || ""}
          />
        )}
      </Modal>
    </div>
  );
}
