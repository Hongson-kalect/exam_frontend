import * as React from "react";
import { Link } from "react-router-dom";
import useExamState from "../../../stores/examStates";
import { checkValidTime } from "../../../utils/functions";
import { getLocalStorage, setLocalStorage } from "../../../utils/localStorage";

export interface IExamRoomProps {
  id: string;
  name: string;
  date: string;
  time: string;
  description?: string;
  onClick: () => void;
}
const date = new Date();
const DEFAULT_CLASS =
  "bg-gradient-to-r from-blue-400 w-3/4 cursor-pointer my-1";

export function ExamRoom(props: IExamRoomProps) {
  const examState = useExamState();
  const [examable, setExamable] = React.useState(false);

  React.useEffect(() => {
    let interval: any;
    checkValidTime(props.date, props.time)
      ? setExamable(true)
      : setExamable(false);
    if (props.date === new Date().toISOString().slice(0, 10)) {
      interval = setInterval(() => {
        checkValidTime(props.date, props.time)
          ? setExamable(true)
          : setExamable(false);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [props.date, props.time]);

  // bg-gradient-to-r from-slate-400  w-3/4 cursor-pointer for linked
  return (
    <Link
      onClick={props.onClick}
      to={"/" + examState.subjectId + "/" + props.id + "/detail"}
    >
      <div
        onClick={() => examState.setroomId(props.id)}
        className={`bg-gradient-to-r ${
          examable ? "from-blue-500" : "from-slate-300"
        } w-3/4 cursor-pointer my-1 rounded-md opacity-80 hover:opacity-100`}
      >
        <div className="flex items-center justify-between pt-0.5 gap-2">
          <p
            className={`text-lg ml-2 font-semibold ${
              examable ? "text-gray-100 text-xl" : "text-gray-800"
            }`}
          >
            {props.name}
          </p>
          <p className="text-xs text-slate-600 mr-1 font-bold">
            Time start: {`${props.time}${props.date ? " " + props.date : ""}`}
          </p>
        </div>
        {props.description && (
          <div
            className={`whitespace-nowrap text-ellipsis text-sm ${
              examable ? "text-slate-200" : "text-gray-700"
            } pl-4 pr-1 py-1`}
          >
            {props.description}
          </div>
        )}
      </div>
    </Link>
  );
}
