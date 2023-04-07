import { Delete, Edit } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import * as React from "react";
import { fetchData } from "../../../utils/fetchFunction";
import { IQuestion } from "../Question";
import parser from "html-react-parser";
import { getSession } from "../../../utils/session";
import { useAppState } from "../../../stores/appState";

export interface ITableQuestionItemProps {
  question: IQuestion;
  loadQuestion: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setEditItem: React.Dispatch<React.SetStateAction<{}>>;
}

export function TableQuestionItem({
  question,
  loadQuestion,
  setIsEdit,
  setEditItem,
}: ITableQuestionItemProps) {
  const appState = useAppState();

  const [wrap, setWrap] = React.useState(true);
  const handleEdit = (e: any) => {
    setIsEdit(true);
    setEditItem(JSON.parse(e.target.closest(".edit").dataset.id));
  };
  const handleDelete = async (e: any) => {
    const id = e.target.closest(".delete").dataset.id;
    const yes = window.confirm("Are you want to delete question " + id);
    if (yes) {
      appState.setIsLoading(true);
      const fetchRes: any = await fetchData("question/del/" + id, "delete");
      appState.setIsLoading(false);
      if (fetchRes.status === 1) {
        alert("delete complete");
        loadQuestion();
      }
    }
  };
  return (
    <tr
      className={wrap ? "td-nowrap" : ""}
      onClick={() => {
        setWrap(!wrap);
      }}
    >
      {(getSession("permission") === "host" ||
        getSession("permission") === "deputy") && (
        <>
          <td>{question.id}</td>

          <td>
            <div className="flex items-center justify-center">
              <Tooltip title="edit">
                <div
                  className="edit"
                  onClick={handleEdit}
                  data-id={JSON.stringify(question)}
                >
                  <Edit data-id="" className="w-5 h-5 text-orange-400" />
                </div>
              </Tooltip>
              <Tooltip title="delete">
                <div
                  className="delete"
                  onClick={handleDelete}
                  data-id={question.id}
                >
                  <Delete className="w-5 h-5 text-red-500" />
                </div>
              </Tooltip>
            </div>
          </td>
        </>
      )}

      <td>{question.type}</td>
      <td>{question.level}</td>
      <td>{parser(question.question)}</td>
      {(getSession("permission") === "host" ||
        getSession("permission") === "deputy") && (
        <>
          <td>{question.anser}</td>
          <td>{question.explain}</td>
        </>
      )}

      <td>{question.updatedAt?.slice(0, 10)}</td>
    </tr>
  );
}
