import { Button } from "antd";
import * as React from "react";
import { Link } from "react-router-dom";

export interface ICheckScoreProps {
  setCheckResult: React.Dispatch<React.SetStateAction<boolean>>;
  result: any;
}

export function CheckScore({ setCheckResult, result }: ICheckScoreProps) {
  return (
    <div>
      <div className="text-center flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-2">
          <p className="text-primary text-2xl font-bold">
            Your attemp has been recorded
          </p>
          <p className="text-4xl text-blue-500">Score</p>
          <div className="text-9xl text-red-500">
            {((result.score.correct / result.score.total) * 10).toFixed(2)}
          </div>
          <div className="text-lg text-yellow-600">{`Your result is ${result.score.correct}/ ${result.score.total}`}</div>
        </div>

        <Link
          to="/"
          className="italic underline text-blue-500 hover:text-blue-800"
        >
          Return to home page
        </Link>

        <Button
          type="primary"
          onClick={() => setCheckResult(true)}
          size="large"
          className="bg-primary text-lg text-white font-semibold hover:!bg-blue-900 hover:scale-110 duration-150"
        >
          Check retsult
        </Button>
      </div>
    </div>
  );
}
