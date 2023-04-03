import { Delete, Edit } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import * as React from "react";

export interface ISubjectItemProps {
  testSubject: {
    code: string | number;
    name: string;
    creator: string;
    createAt: string;
    description: string;
  };
}

export function SubjectItem({ testSubject }: ISubjectItemProps) {
  return (
    <tr>
      <td>
        <div className="flex items-center justify-center">
          <Tooltip title="edit">
            <div data-id={testSubject.code}>
              <Edit data-id="" className="w-5 h-5 text-orange-400" />
            </div>
          </Tooltip>
          <Tooltip title="delete">
            <div data-id={testSubject.code}>
              <Delete className="w-5 h-5 text-red-500" />
            </div>
          </Tooltip>
        </div>
      </td>
      <td>{testSubject.code}</td>
      <td>{testSubject.name}</td>
      <td>{testSubject.creator}</td>
      <td>{testSubject.createAt}</td>
      <td>{testSubject.description}</td>
    </tr>
  );
}
