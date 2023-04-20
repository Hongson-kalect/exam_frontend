import { Button } from "antd";
import * as React from "react";
import useExamState from "../../../stores/examStates";
import { useNavigate } from "react-router-dom";

export interface ISeeHistoryProps {
  history: any;
}

export function SeeHistory({ history }: ISeeHistoryProps) {
  console.log("history", history);
  const navigate = useNavigate();
  const examState = useExamState();
  const handleCheckResult = (id: string) => {
    if (history.allowSeeResult) {
      examState.setHistoryId(id);
      examState.setState("check");
      navigate("/exam");
    } else alert("See Result Is Not Allowed");
  };
  return (
    <div className="text-center flex flex-col gap-y-4">
      {history.score.total && (
        <div className="flex flex-col gap-y-2">
          <p className="text-2xl text-blue-500">Your score</p>
          <div className="text-7xl text-red-500">
            {(
              (Number(history.score.correct) / Number(history.score.total)) *
              10
            ).toFixed(2)}
          </div>
          <div className="text-lg text-yellow-400">{`${history.score.correct}/${history.score.total}`}</div>
        </div>
      )}
      {history.allowSeeResult && (
        <div onClick={() => handleCheckResult(history.id)}>
          <Button
            size="large"
            className="bg-primary text-lg text-white font-semibold hover:!bg-blue-900 hover:scale-110 duration-150"
          >
            See Result
          </Button>
        </div>
      )}
      <div>Sumitted at: {history.createdAt}</div>
    </div>
  );
}
