import React, { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchFunction";
import ExamQuestion from "./Subject/Exam/ExamQuestion";
import { Button } from "./Button";
import ExamQuestions from "./Subject/Exam/ExamQuestions";
import { CheckScore } from "./Subject/Exam/CheckScore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useExamState from "../stores/examStates";
import useTestingState from "../stores/testingState";
import useUserState from "../stores/userState";

export interface IExamProps {}

export default function Exam(props: IExamProps) {
  const navigate = useNavigate();

  const examState = useExamState();
  const testingState = useTestingState();
  const userState = useUserState();

  const [exam, setExam] = useState<any>("");
  const [result, setResult] = useState<any>("");
  const [userAnser, setUserAnser] = useState<string[]>([]);
  const [isTestSubmit, setIsTestSubmit] = useState(false);
  const [isCheckResult, setIsCheckResult] = useState(false);
  const [anserArr, setAnserArr] = useState<any[]>([]);
  const [isContinue, setIsContinue] = useState(true);
  const [historyId, setHistoryId] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [limitTime, setLimitTime] = useState("");
  const [timeRemain, setTimeRemain] = useState("");

  const onAnserFormChange = (e: any) => {
    const id = e.target.closest(".ansers")?.dataset.id;
    setUserAnser((prev) => {
      prev[id] = e.target.value;
      return [...prev];
    });
  };

  const checkUnSubmit = async () => {
    console.log(timeStart);
    console.log("clmm");
    const getUnsubmit = await fetchData(
      "history/unsubmit?roomId=" +
        examState.roomId +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
    console.log(getUnsubmit);
    if (getUnsubmit.status === 1) {
      if (getUnsubmit.data) {
        setTimeStart(getUnsubmit.data.createdAt);
        const fetchBody = {
          userId: userState.userId,
          subjectId: examState.subjectId,
          testId: getUnsubmit.data.testId,
          roomId: examState.roomId,
          userAnser: getUnsubmit.data.userAnser,
        };
        const getContinue = await fetchData(
          "exam/get-contineu",
          "post",
          fetchBody
        );
        setUserAnser(getUnsubmit.data.userAnser.split("|"));
        testingState.setTimeAttempt(getUnsubmit.data.timeAttemp);
        setHistoryId(getUnsubmit.data.id);
        setLimitTime(getContinue.data.limitTime);
        setExam(getContinue.data);
        setIsContinue(true);
      } else {
        setIsContinue(false);
      }
    } else toast.error(getUnsubmit.message);
  };

  const getExam = async () => {
    const fetchDetail = await fetchData(
      "exam/get?subjectId=" +
        examState.subjectId +
        "&roomId=" +
        examState.roomId +
        "&userId=" +
        userState.userId,
      "get"
    );
    console.log(getExam);
    setTimeStart(new Date().toISOString());
    setLimitTime(fetchDetail.data.limitTime);
    setExam(fetchDetail.data);
  };
  const startExam = async () => {
    const fetchBody = {
      userId: userState.userId,
      subjectId: examState.subjectId,
      roomId: examState.roomId,
      testId: exam.testId,
      timeAttemp: testingState.timeAttempt,
      submited: false,
    };
    const data = await fetchData("start-exam", "post", fetchBody);
    setHistoryId(data?.data?.id || "");
  };

  const handleSumbit = async () => {
    const fetchBody = {
      userId: userState.userId,
      subjectId: examState.subjectId,
      roomId: examState.roomId,
      testId: exam.testId,
      userAnser: userAnser,
      timeAttemp: testingState.timeAttempt,
      allowSeeExplane: exam.allowSeeExplane,
      allowSeeResult: exam.allowSeeResult,
      allowSeeScore: exam.allowSeeScore,
      questions: exam.questions,
      historyId: historyId || null,
    };
    const fetchRes = await fetchData("exam/submit", "post", fetchBody);
    console.log(fetchRes.data);
    setResult(fetchRes.data);
    setIsTestSubmit(true);
  };
  const handleCloseTab = async () => {
    const fetchBody = {
      userId: userState.userId,
      subjectId: examState.subjectId,
      roomId: examState.roomId,
      testId: exam.testId,
      userAnser: userAnser,
      timeAttemp: testingState.timeAttempt,
      historyId: historyId || null,
    };
    console.log(fetchBody);
    const aa = await fetchData("exam/close-tab", "post", fetchBody);
    console.log(aa);
  };
  const GetTimeDiffer = (time1: string, time2: string) => {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    return Math.floor((date1.getTime() - date2.getTime()) / 1000);
  };
  useEffect(() => {
    if (!(examState.subjectId && examState.roomId && userState.userId)) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    let interval: any;
    if (limitTime && timeStart && !result) {
      // run one time before setTimeout
      const date = new Date();
      const differTime = GetTimeDiffer(timeStart, date.toISOString());
      const differTimeNumber = differTime + Number(limitTime) * 60;
      if (differTimeNumber <= 0) handleSumbit();
      setTimeRemain(
        `${Math.floor(differTimeNumber / 3600)}:${Math.floor(
          (differTimeNumber % 3600) / 60
        )}:${Math.floor(differTimeNumber % 60)}`
      );
      interval = setInterval(() => {
        const date = new Date();
        const differTime = GetTimeDiffer(timeStart, date.toISOString());
        const differTimeNumber = differTime + Number(limitTime) * 60;
        if (differTimeNumber <= 0) handleSumbit();
        setTimeRemain(
          `${Math.floor(differTimeNumber / 3600)}:${Math.floor(
            (differTimeNumber % 3600) / 60
          )}:${Math.floor(differTimeNumber % 60)}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [limitTime, timeStart, result]);
  React.useEffect(() => {
    checkUnSubmit();
  }, []);

  useEffect(() => {
    if (!isContinue) getExam();
  }, [isContinue]);

  React.useEffect(() => {
    const tempArr = [];
    if (
      exam?.questions?.length &&
      exam?.questions?.length > 0 &&
      exam.userAnser
    ) {
      console.log(exam);
      for (let index = 0; index < exam?.questions.length; index++) {
        if (userAnser[index] || exam.userAnser[index])
          tempArr[index] = userAnser[index] || exam.userAnser[index];
        else tempArr[index] = "";
      }
    }
    setUserAnser([...tempArr]);
  }, [exam?.questions]);

  useEffect(() => {
    if (result?.anser) setAnserArr([...result?.anser?.split("|")]);
  }, [result?.anser]);

  useEffect(() => {
    if (exam.testId && !isContinue) startExam();
  }, [exam]);

  useEffect(() => {
    const handleTabClose = (event: any) => {
      event.preventDefault();
      handleCloseTab();
      return (event.returnValue = "Are you sure you want to exit?");
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [exam, userAnser]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-200 p-4">
      <div className="bg-white right-content lg:basis-2/12 basis-0 shadow-grow h-full  relative ml-4 flex flex-col">
        <h3 className="text-center my-2">
          Time remain: <span className="font-normal">{timeRemain}</span>
        </h3>
        <div
          className="flex-1 overflow-auto hide-scroll"
          style={{ maxHeight: "85%" }}
        >
          <div className="flex flex-wrap gap-2 p-4 pt-0">
            {result?.anser && result?.userAnser && anserArr.length > 0
              ? userAnser &&
                userAnser.map((item: any, index: any) => {
                  const anserCorrect =
                    (anserArr[index]?.split("-").indexOf("0") || 1) - 1;
                  console.log(anserArr[index]);
                  console.log(anserCorrect);
                  console.log(result.userAnser[index]);
                  return (
                    <div key={index} className="flex flex-col gap-y-1 ">
                      <div
                        className={`inline-block w-5 h-5 ${
                          anserCorrect === Number(result.userAnser[index])
                            ? "bg-green-300"
                            : "bg-red-400"
                        } text-center`}
                      >
                        {item?.toUpperCase() || "?"}
                      </div>
                      <p className="text-center font-normal text-sm">
                        {index + 1}
                      </p>
                    </div>
                  );
                })
              : userAnser &&
                userAnser.map((item: any, index: any) => {
                  return (
                    <div key={index} className="flex flex-col gap-y-1 ">
                      <div
                        className={`inline-block w-5 h-5 ${
                          item ? "bg-blue-300" : "bg-gray-200"
                        } text-center`}
                      >
                        {item?.toUpperCase() || "?"}
                      </div>
                      <p className="text-center font-normal text-sm">
                        {index + 1}
                      </p>
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="absolute bottom-2 w-full">
          <Button
            background="bg-primary"
            color="text-white"
            title={result ? "Return to Home" : "Submit"}
            size="large"
            // className="bg-primary w-full !rounded-none"
            onClick={
              result ? () => navigate(`/${examState.subjectId}`) : handleSumbit
            }
          />
        </div>
      </div>
      <div className="left-content flex-1  overflow-auto hide-scroll">
        {isCheckResult ? (
          <ExamQuestions
            checkResult={isCheckResult}
            result={result}
            onAnserChange={onAnserFormChange}
            setUserAnser={setUserAnser}
          />
        ) : isTestSubmit ? (
          <CheckScore setCheckResult={setIsCheckResult} result={result} />
        ) : (
          <ExamQuestions
            userAnser={userAnser}
            exam={exam}
            onAnserChange={onAnserFormChange}
            setUserAnser={setUserAnser}
          />
        )}
      </div>
    </div>
  );
}
