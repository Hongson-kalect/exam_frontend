import { useNavigate } from "react-router-dom";
import * as React from "react";
import SubjectLayout from "../../layout/SubjectLayout";
import { ExamRoom } from "./SubjectComponent/ExamRoom";
import { fetchData } from "../../utils/fetchFunction";
import { getLocalStorage } from "../../utils/localStorage";
import { getCookie } from "../../utils/cookie";
import useExamState from "../../stores/examStates";
import useUserState from "../../stores/userState";

export interface IExamRoomListProps {}

export default function ExamRoomList({}: IExamRoomListProps) {
  const examState = useExamState();
  const userState = useUserState();

  const [testRooms, setTestRooms] = React.useState<any[]>([]);
  const getTestRooms = async () => {
    const fetchRes = await fetchData(
      "test-room/get/?subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
    if (fetchRes.status === 1) setTestRooms(fetchRes.data);
    if (fetchRes.status === 0) alert(fetchRes.message);
    console.log(fetchRes);
  };
  React.useEffect(() => {
    getTestRooms();
  }, []);
  return (
    <div className="w-full">
      {testRooms.map((room) => {
        return (
          <ExamRoom
            onClick={() => examState.setroomId(room.id)}
            key={room.id}
            id={room.id}
            name={room.name}
            time={room.time}
            date={room.day}
            description={room.description}
          />
        );
      })}
    </div>
  );
}
