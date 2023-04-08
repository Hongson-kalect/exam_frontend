import { Input } from "@mui/material";
import { Empty, Modal } from "antd";
import { useState, useEffect } from "react";
import { useAppState } from "../../../stores/appState";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";
import { getCookie } from "../../../utils/cookie";
import { fetchData } from "../../../utils/fetchFunction";
import { getLocalStorage } from "../../../utils/localStorage";
import { getSession } from "../../../utils/session";
import { SeeHistory } from "./SeeHistory";

export interface ICheckAllAttemptProps {}

export function CheckAllAttempt(props: ICheckAllAttemptProps) {
  const appState = useAppState();
  const examState = useExamState();
  const userState = useUserState();

  const [isSeeHistory, setIsSeeHistory] = useState(false);
  const [historyDetail, setHistoryDetail] = useState({});
  const [freeTest, setFreeTest] = useState(false);
  const [search, setSearch] = useState("");
  const [attempts, setAttempts] = useState([]);
  const getAllAttempt = async () => {
    appState.setIsLoading(true);
    const fetchAllAttenmpt: any = await fetchData(
      "history/get?roomId=" +
        examState.roomId +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId +
        "&search=" +
        search +
        "&isFree=" +
        (freeTest ? "1" : "0") +
        "&getAll=1",
      "get"
    );
    appState.setIsLoading(false);
    console.log(fetchAllAttenmpt);
    if (fetchAllAttenmpt.status === 1) setAttempts(fetchAllAttenmpt.data);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllAttempt();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, freeTest]);
  useEffect(() => {
    getAllAttempt();
  }, []);
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-evenly">
        <input
          placeholder="Search..."
          className="px-4 rounded-2xl text-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <div className="flex items-center gap-x-2">
          <input
            className="w-6 h-6 ml-4"
            type="checkbox"
            checked={freeTest}
            onChange={() => setFreeTest(!freeTest)}
          />{" "}
          Show Free test
        </div>
      </div>
      {attempts ? (
        attempts.map((item: any, index) => {
          return (
            <div
              key={index}
              data-id={JSON.stringify(item)}
              className="history-item flex w-full gap-x-2 bg-blue-200 hover:bg-blue-300 rounded-sm px-2 py-1 cursor-pointer"
              onClick={(e) => getHistoryDetail(e)}
            >
              <div className="flex-1 text-base font-semibold">
                <b className="text-lg font-bold">Email:</b> {item.userId}
              </div>
              <div className="w-1/5 text-right font-semibold text-green-700 flex gap-x-2">
                <div className="font-semibold text-black">{`${
                  item.score.correct || 0
                }/${item.score.total || 0} =`}</div>
                <div className="font-bold text-red-700">{`${(
                  (item.score.correct / item.score.total) *
                  10
                ).toFixed(2)}`}</div>
              </div>
              <div className="w-1/5 text-right font-semibold text-green-700">
                Test Id: {item.testId}
              </div>
              <div className="w-1/5 text-right font-semibold text-red-500">
                Attempt: {item.timeAttemp || "Free Test"}
              </div>
            </div>
          );
        })
      ) : (
        <Empty />
      )}
      <Modal
        open={isSeeHistory}
        onCancel={() => {
          setIsSeeHistory(false);
        }}
        width={400}
        closable={false}
        footer={false}
      >
        <SeeHistory history={historyDetail} />
      </Modal>
    </div>
  );
}
