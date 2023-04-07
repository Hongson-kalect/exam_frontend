import { Add, PlusOneOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
import { Modal, Button, Transfer } from "antd";
import * as React from "react";
import { AddItemToTestModal } from "./AddItemToTest";
import parser from "html-react-parser";
import { fetchData } from "../../../utils/fetchFunction";
import { TransferDirection } from "antd/es/transfer";
import { v4 } from "uuid";
import { getCookie } from "../../../utils/cookie";
import { getLocalStorage } from "../../../utils/localStorage";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";
import { useAppState } from "../../../stores/appState";

export interface IAddSubjectModalProps {
  editInfo: string;
  isEdit: boolean;
  loadTest: () => void;
  onCancel: () => void;
}
interface IQuestion {
  code: string | number;
  type: string;
  level: string;
  question: string;
}
interface QuestionType {
  id: string | number;
  type: string;
  // title: string;
  level: string;
  question: any;
}

export function AddSubjectTestModal(props: IAddSubjectModalProps) {
  const appState = useAppState();
  const examState = useExamState();
  const userState = useUserState();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [id, setId] = React.useState("");
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [mockData, setMockData] = React.useState<QuestionType[]>([]);
  const [targetKeys, setTargetKeys] = React.useState<any[]>([]);

  const [addQuestionModal, setAddQuestionModal] =
    React.useState<boolean>(false);

  const handleAddTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fetchBody = {
      name,
      code: code || v4(),
      description,
      questions: targetKeys,
      subjectId: examState.subjectId,
      userId: userState.userId,
    };
    appState.setIsLoading(true);
    await fetchData("test", "post", fetchBody);
    appState.setIsLoading(false);
    props.onCancel();
    props.loadTest();
    ClearForm();
  };
  const handleEditTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fetchBody = {
      id,
      name,
      code: code || v4(),
      description,
      questions: targetKeys,
      subjectId: examState.subjectId,
      userId: userState.userId,
    };
    appState.setIsLoading(true);
    await fetchData("test/edit", "put", fetchBody);
    appState.setIsLoading(false);
    props.onCancel();
    props.loadTest();
    ClearForm();
  };
  const getMock = async () => {
    // const tempTargetKeys = [];
    const tempMockData = [];
    appState.setIsLoading(true);
    const fetchQuestions = await fetchData(
      `question/get?subjectId=${examState.subjectId}&userId=${
        userState.userId || null
      }`,
      "get"
    );
    appState.setIsLoading(false);
    const data = fetchQuestions.data;
    for (let i = 0; i < data.length; i++) {
      data[i].key = data[i].id;
      // data[i].title = data[i].type;
      // tempTargetKeys.push(data[i].id);
      tempMockData.push(data[i]);
    }
    setMockData(tempMockData);
    // setTargetKeys(tempTargetKeys);
  };
  const handleChange = (
    nextTargetKeys: string[],
    direction: TransferDirection,
    moveKeys: string[]
  ) => {
    setTargetKeys(nextTargetKeys);
  };
  const filterOption = (inputValue: string, option: QuestionType) =>
    option.type.indexOf(inputValue) > -1 ||
    option.question.indexOf(inputValue) > -1 ||
    option.id.toString().indexOf(inputValue) > -1 ||
    option.level.indexOf(inputValue) > -1;

  const ClearForm = () => {
    setCode("");
    setName("");
    setDescription("");
    setTargetKeys([]);
  };

  React.useEffect(() => {
    getMock();
    if (!props.isEdit) {
      ClearForm();
    }
  }, [props.isEdit]);
  React.useEffect(() => {
    if (props.isEdit) {
      const subjectInfo = JSON.parse(props.editInfo);
      setId(subjectInfo.id);
      setCode(subjectInfo.code);
      setName(subjectInfo.name);
      setDescription(subjectInfo.description);
      const questionArr = subjectInfo.question.split("|");
      for (let index = 0; index < questionArr.length; index++) {
        if (questionArr[index])
          setTargetKeys((prev) => {
            return [...prev, Number(questionArr[index].split("-")[0])];
          });
      }
    }
    return () => {
      setCode("");
      setName("");
      setDescription("");
      setTargetKeys([]);
    };
  }, [props.isEdit, props.editInfo]);

  return (
    <div>
      <form
        onSubmit={props.isEdit ? handleEditTest : handleAddTest}
        className="flex flex-col add-question-form gap-y-4"
      >
        <div className="flex justify-evenly gap-2">
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            size="small"
            className=" px-1 border border-gray-400 rounded-md w-1/2"
          />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            size="small"
            className=" px-1 border border-gray-400 rounded-md w-1/2"
          />
        </div>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          size="small"
          className=" px-1 border border-gray-400 rounded-md"
        />
        <div className="w-full">
          <Transfer
            dataSource={mockData}
            titles={["Data", "Choosen"]}
            showSearch
            filterOption={filterOption}
            targetKeys={targetKeys}
            onChange={handleChange}
            // onSearch={handleSearch}
            render={(item) => {
              return (
                <div className="flex">
                  <span>{`${item.id || ""}-${item.type || ""}-${
                    item.level || ""
                  } : `}</span>
                  {parser(item.question)}
                </div>
              );
              // return `${item.type || ""} - ${item.level || ""} : ${
              //   item.question ? parseHTML(item.question) : ""
              // }`;
            }}
            listStyle={{ width: 600, height: 350 }}
          />
        </div>
        <Button type="primary" htmlType="submit" size="large">
          {props.isEdit ? "Edit Test" : "Add Test"}
        </Button>
      </form>
    </div>
  );
}
