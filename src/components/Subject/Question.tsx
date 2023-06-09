import { AddQuestionModal } from "./SubjectComponent/AddQuestionModal";
import { TableQuestionItem } from "./SubjectComponent/TableQuestionItem";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { AutoComplete, Empty, Modal } from "antd";
import * as React from "react";
import { fetchData } from "../../utils/fetchFunction";
import { getLocalStorage } from "../../utils/localStorage";
import { getCookie } from "../../utils/cookie";
import { getSession } from "../../utils/session";
import useExamState from "../../stores/examStates";
import useUserState from "../../stores/userState";
import { AddQuestionExcel } from "./SubjectComponent/AddQuestionExcel";
import { IAppState } from "../../stores/appState";

export interface IQuestionProps {
  appState: IAppState;
}

export interface IQuestion {
  id: number;
  type: string;
  level: string;
  question: string;
  anser: string;
  explain?: string;
  anserTimes?: number;
  correctTime?: number;
  updatedAt: string;
}

export default function Question({ appState }: IQuestionProps) {
  const examState = useExamState();
  const userState = useUserState();
  const [searchVal, setSearchVal] = React.useState("");
  const [searchType, setSearchType] = React.useState("");
  const [searchLevel, setSearchLevel] = React.useState("");

  const [questions, setQuestions] = React.useState<IQuestion[]>([]);
  const [isShortItem, setIsShortItem] = React.useState(true);
  const [types, setTypes] = React.useState<string[]>([]);
  const [isAddQuestionModal, setIsAddQuestionModal] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isExcelAdd, setIsExcelAdd] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editItem, setEditItem] = React.useState({});
  const tbodyRef = React.useRef<HTMLTableSectionElement | null>(null);

  const handleCheckClick = () => {
    if (tbodyRef) {
      tbodyRef.current?.classList.toggle("tr-nowrap");
    }
  };
  const loadQuestion = async () => {
    appState.setIsLoading(true);
    let fetchResType = await fetchData("question/get-type", "get");
    let fetchRes = await fetchData(
      `question/get?input=${searchVal}&type=${searchType}&level=${searchLevel}&subjectId=${
        examState.subjectId
      }&userId=${userState.userId || null}`,
      "get"
    );
    appState.setIsLoading(false);
    setTypes(fetchResType.data);
    if (fetchRes.status === 1) setQuestions(fetchRes.data);
  };
  React.useEffect(() => {
    // loadQuestion();

    const times = setTimeout(() => {
      loadQuestion();
    }, 300);
    return () => clearTimeout(times);
  }, [searchVal, searchLevel, searchType]);
  return (
    <div className="table-wrap">
      <div className="table-content">
        <table border={1}>
          <thead className="sticky top-0 w-full">
            <tr className="thead-row">
              <th colSpan={10}>
                <div className="">
                  {/* <div className="flex items-center gap-1">
                    <input
                      id="check-box"
                      type="checkbox"
                      onClick={handleCheckClick}
                      name="check-shot"
                      className="outline-none w-5 h-5"
                    />
                    {" One line table "}
                  </div> */}
                  <div className="table head-option">
                    <input
                      type="text"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search..."
                    />
                    <select
                      name="type"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="">--Type : All--</option>;
                      {types.length > 0 &&
                        types.map((item: any, index) => {
                          return (
                            <option key={index} value={item.type}>
                              {item.type}
                            </option>
                          );
                        })}
                    </select>
                    <select
                      name="level"
                      value={searchLevel}
                      onChange={(e) => setSearchLevel(e.target.value)}
                    >
                      <option value="">Level : All</option>
                      <option value="Easy">Easy</option>
                      <option value="Normal">Normal</option>
                      <option value="Hard">Hard</option>
                      <option value="Extreme">Extreme</option>
                    </select>
                    {/* <SearchOutlined /> */}
                  </div>
                </div>
              </th>
            </tr>
            {questions.length > 0 && (
              <tr className="thead-row">
                {(getSession("permission") === "host" ||
                  getSession("permission") === "deputy") && (
                  <>
                    <th>Index</th>
                    <th>Options</th>
                  </>
                )}
                <th>Type</th>
                <th>Level</th>
                <th>Question</th>
                {(getSession("permission") === "host" ||
                  getSession("permission") === "deputy") && (
                  <>
                    <th>Anser</th>
                    <th>Explain</th>
                  </>
                )}
                <th>Updated at</th>
              </tr>
            )}
          </thead>
          {questions.length > 0 ? (
            <tbody ref={tbodyRef} className="text-xs">
              {questions.map((question: IQuestion) => {
                return (
                  <TableQuestionItem
                    loadQuestion={loadQuestion}
                    setIsEdit={setIsEdit}
                    setEditItem={setEditItem}
                    key={question.id}
                    question={question}
                  />
                );
              })}
            </tbody>
          ) : (
            <Empty />
          )}
        </table>
      </div>
      <div className="options-button">
        {(getSession("permission") === "host" ||
          getSession("permission") === "deputy") && (
          <>
            <Button
              variant="contained"
              className="bg-blue-500"
              onClick={() => setIsModalOpen(true)}
            >
              Add question
            </Button>
            <Button
              variant="contained"
              className="bg-green-500 hover:!bg-green-600"
              onClick={() => setIsExcelAdd(true)}
            >
              Add question by Excel file
            </Button>
          </>
        )}
      </div>
      <Modal
        open={isModalOpen || isEdit || isExcelAdd}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEdit(false);
          setIsExcelAdd(false);
        }}
        width={720}
        closable={false}
        footer={false}
      >
        {isExcelAdd ? (
          <AddQuestionExcel setIsExcelAdd={setIsExcelAdd} />
        ) : (
          <AddQuestionModal
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            editItem={editItem}
            onCancel={() => {
              setIsModalOpen(false);
              setIsEdit(false);
            }}
            types={types}
            loadQuestion={loadQuestion}
          />
        )}
      </Modal>
    </div>
  );
}
