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
        className={`room-list-item ${examable ? "active" : ""}`}
      >
        <div className="room-list-item-box">
          <p className="room-list-item-h">{props.name}</p>
          <p className="room-list-item-time">
            Time start: {`${props.time}${props.date ? " " + props.date : ""}`}
          </p>
        </div>
        {props.description && (
          <div className="room-list-item-desc">{props.description}</div>
        )}
      </div>
    </Link>
  );
}
