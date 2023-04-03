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
    const fetchRes = await fetchData(
      "test-room/get?subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId +
        "&userId=" +
        userState.userId,
      "get"
    );
    setTestRoomDetail(fetchRes.data);
    console.log(fetchRes.data);
  };
  const getHistory = async () => {
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
    setHistory(fetchRes.data);
  };
  const startExam = async () => {
    const timeAttempt = await fetchData(
      "get-attempt?userId=" +
        userState.userId +
        "&subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId
    );
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
      const deleteRes = await fetchData(
        "test-room/del?id=" +
          examState.roomId +
          "&subjectId=" +
          examState.subjectId +
          "&userId=" +
          userState.userId,
        "delete"
      );
      if (deleteRes.status === 1) {
        toast.success("Delete completed");
        navigate(`/${examState.subjectId}`);
      } else toast.error(deleteRes.message);
    }
  };
  const checkUnSubmit = async () => {
    const getUnsubmit = await fetchData(
      "history/unsubmit?roomId=" +
        examState.roomId +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
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
          const getSubmitTheForget = await fetchData(
            "exam/submit-current",
            "post",
            fetchBody
          );
          console.log(getSubmitTheForget);
        }
      }
    } else toast.error(getUnsubmit.message);
  };
  const getHistoryDetail = async (e: any) => {
    const data = JSON.parse(e.target.closest(".history-item").dataset.id);
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
    setHistoryDetail(getData.data);
    setIsSeeHistory(true);
  };

  React.useEffect(() => {
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
    <div className="flex flex-col w-full pb-4">
      <p className="text-3xl uppercase text-primary text-center mb-4">
        {testRoomDetail.name}
      </p>
      <div className="flex flex-col gap-y-4 ">
        <div className="flex items-center justify-evenly">
          {/* <div> */}
          <p>Day: {testRoomDetail.day}</p>
          <p>Shift: {testRoomDetail.time}</p>
          <p>Limit Time: {testRoomDetail.limitTime}</p>
          {/* </div> */}
        </div>
        <div className="px-1/12 flex gap-2">
          <p className="font-semibold">Description: </p>
          {testRoomDetail.description}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-auto px-10 mt-4">
        <div className="flex gap-x-2 items-center">
          <h2 className="underline italic mb-4">History:</h2>
          <input
            className="w-6 h-6 ml-4"
            type="checkbox"
            checked={showFreeHistoty}
            onChange={() => setShowFreeHistory(!showFreeHistoty)}
          />{" "}
          Show Free test
        </div>

        {/* Render history here */}
        <div className="flex-1 ">
          {history.length === 0 ? (
            <Empty />
          ) : (
            <div className="flex flex-wrap gap-x-8 gap-y-4 items-start">
              {history.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="history-item w-1/6 bg-blue-400 h-10 rounded-2xl cursor-pointer"
                    data-id={JSON.stringify(item)}
                    onClick={(e) => getHistoryDetail(e)}
                  >
                    <p className="flex justify-center items-center text-2xl font-blold text-white pt-1">
                      Attempt {index + 1}
                    </p>
                  </div>
                );
              })}
              <div className="grow shrink"></div>
            </div>
          )}
        </div>
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
