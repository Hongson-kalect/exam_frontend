import { Button, Tooltip } from "antd";
import * as React from "react";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";
import { getCookie } from "../../../utils/cookie";
import { fetchData } from "../../../utils/fetchFunction";
import { getLocalStorage } from "../../../utils/localStorage";
import { QuestionCheckableItem } from "./QuestionCheckableItem";

export interface IAddItemToTestModalProps {
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
}

export function AddItemToTestModal({
  questions,
  setQuestions,
}: IAddItemToTestModalProps) {
  const examState = useExamState();
  const userState = useUserState();
  const [searchVal, setSearchVal] = React.useState("");
  const [searchType, setSearchType] = React.useState("");
  const [searchLevel, setSearchLevel] = React.useState("");
  const [addQuestions, setAddQuestions] = React.useState<any[]>([]);
  const [types, setTypes] = React.useState<string[]>([]);
  const tableBodyRef = React.useRef<HTMLTableSectionElement | null>(null);

  const formRef = React.useRef<HTMLFormElement | null>(null);

  console.log(questions);
  const loadQuestion = async () => {
    let fetchRes = await fetchData("question/get-type", "get");
    setTypes(fetchRes.data);
    fetchRes = await fetchData(
      `question/get?input=${searchVal}&type=${searchType}&level=${searchLevel}&subjectId=${
        examState.subjectId
      }&userId=${userState.userId || null}`,
      "get"
    );

    const data = fetchRes.data.filter((item: any) => {
      console.log(questions);
      return !questions.includes(JSON.stringify(item));
    });
    if (fetchRes.status === 1) setAddQuestions(data);
  };
  const handleAddTotest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current == null) return;
    const formVal = new FormData(formRef.current);
    setQuestions((pre) => {
      return [...pre, ...formVal.getAll("question[]")];
    });
    loadQuestion();
  };
  const handleAddRamdom = () => {
    const number = window.prompt("How many you want to add?");
    if (Number(number)) console.log(number);
    else alert("please enter a number");
  };
  React.useEffect(() => {
    // loadQuestion();

    const times = setTimeout(() => {
      loadQuestion();
    }, 300);
    return () => clearTimeout(times);
  }, [searchVal, searchLevel, searchType]);
  return (
    <div className="flex flex-col">
      <form
        ref={formRef}
        className="form w-full h-full"
        onSubmit={handleAddTotest}
      >
        <div className="my-2 h-11/12 w-full overflow-auto hide-scroll">
          <table border={1}>
            <thead className="sticky top-0 w-full">
              <tr>
                <th colSpan={10}>
                  <div
                    className="flex items-center justify-between px-2 py-1 font-normal"
                    style={{ width: "700px" }}
                  >
                    <div className="flex items-center gap-1">
                      <input
                        id="check-box"
                        type="checkbox"
                        onClick={() => {}}
                        name="check-shot"
                        className="outline-none w-5 h-5"
                        placeholder="search..."
                      />
                      {" One line table "}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <input
                        type="text"
                        className="outline-none border-2 rounded-full px-3 py-1"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search..."
                      />
                      <select
                        name="type"
                        id=""
                        className="outline-none py-1 rounded-lg"
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
                        id=""
                        className="outline-none  py-1 rounded-lg"
                      >
                        <option value="">Level : All</option>
                        <option value="Easy">Easy</option>
                        <option value="Normal">Normal</option>
                        <option value="Hard">Hard</option>
                        <option value="Extreme">Extreme</option>
                      </select>
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th>
                  <input type="checkbox" className="check-all" id="" />
                </th>
                <th>ID</th>
                <th>Type</th>
                <th>Level</th>
                <th>Question</th>
                {/* <th rowSpan={2}>Correct</th> */}
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="text-xs">
              {addQuestions.map((question, index) => {
                return (
                  <QuestionCheckableItem
                    key={question.id}
                    index={index}
                    question={question}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-1/12 flex justify-center items-center gap-x-4 bottom-2 mb-1">
          <Button type="primary" size="large" htmlType="submit">
            Add question
          </Button>
          <Tooltip title="add ramdom questions in table above ">
            <Button type="primary" size="large" onClick={handleAddRamdom}>
              Add Ramdom
            </Button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
}
