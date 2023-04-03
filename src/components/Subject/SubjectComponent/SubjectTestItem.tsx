import { Delete, Edit } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import * as React from "react";
import { fetchData } from "../../../utils/fetchFunction";
import { getSession } from "../../../utils/session";

export interface ILineTestSubjectProps {
  loadTest: () => {};
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setEditInfo: React.Dispatch<React.SetStateAction<string>>;
  question: {
    id: string | number;
    code: string | number;
    name: string;
    question: string;
    updatedAt: string;
    description?: string;
  };
}

export default function SubjectTestItem(props: ILineTestSubjectProps) {
  const handleEditButon = (e: any) => {
    const data = e.target.closest(".edit").dataset.info;
    props.setEditInfo(data);
    props.setIsEdit(true);
  };
  const handleDeleteButon = async (e: any) => {
    const id = e.target.closest(".delete").dataset.id;
    const yes = window.confirm("Are you sure about delete test " + id);
    if (yes) {
      await fetchData("test/del/" + id, "delete");
      props.loadTest();
    }
  };
  return (
    <tr>
      {(getSession("permission") === "host" ||
        getSession("permission") === "deputy") && (
        <>
          <td>{props.question.id}</td>
          <td>
            <div className="flex items-center justify-center">
              <Tooltip title="edit">
                <div
                  className="edit cursor-pointer"
                  data-info={JSON.stringify(props.question)}
                  onClick={handleEditButon}
                >
                  <Edit data-id="" className="w-5 h-5 text-orange-400" />
                </div>
              </Tooltip>
              <Tooltip title="delete">
                <div
                  data-id={props.question.id}
                  onClick={handleDeleteButon}
                  className="delete cursor-pointer"
                >
                  <Delete className="w-5 h-5 text-red-500" />
                </div>
              </Tooltip>
            </div>
          </td>
        </>
      )}

      <td>{props.question.code || ""}</td>
      <td>{props.question.name || ""}</td>
      <td>{props.question.question?.split("|").length || ""}</td>
      <td>{props.question.description || ""}</td>
      <td>{props.question.updatedAt.slice(0, 10) || ""}</td>
    </tr>
  );
}
