import usePagination from "@mui/material/usePagination/usePagination";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Transfer,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { TransferDirection } from "antd/es/transfer";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";
import { getCookie } from "../../../utils/cookie";
import { fetchData } from "../../../utils/fetchFunction";
import { getLocalStorage } from "../../../utils/localStorage";

export interface IEditTestRoomProps {
  isExamStart: boolean;
  editId: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  getDetail: () => void;
}
interface IEditInfo {
  name: string;
  description: string;
  limitTime: string | number;
  day: string;
  time: string;
  allowSeeExplane: boolean;
  allowSeeResult: boolean;
  allowSeeScore: boolean;
}
interface TestType {
  id: string | number;
  code: string;
  name: string;
}
const dateFormat = "YYYY/MM/DD";
const { Option } = Select;

export default function EditTestRoom({
  isExamStart,
  editId,
  setIsEdit,
  getDetail,
}: IEditTestRoomProps) {
  const navigate = useNavigate();

  const examState = useExamState();
  const userState = useUserState();

  const [form] = useForm();
  const params = useParams();

  const [isExamStarted, setIsExamStarted] = React.useState(true);

  const [date, setDate] = React.useState("");
  const [mockData, setMockData] = React.useState<TestType[]>([]);
  const [targetKeys, setTargetKeys] = React.useState<any[]>([]);
  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [day, setDay] = React.useState<string>("");
  const [time, setTime] = React.useState<string>("");
  const [limitTime, setLimitTime] = React.useState<number>(0);
  const [maxAttempt, setMaxAttempt] = React.useState<number>(0);
  const [allowSeeExplane, setAllowSeeExplane] = React.useState<boolean>(false);
  const [allowSeeResult, setAllowSeeResult] = React.useState<boolean>(false);
  const [allowSeeScore, setAllowSeeScore] = React.useState<boolean>(false);

  const getData = async () => {
    const fetchRes = await fetchData(
      "test-room/get?roomId=" +
        editId +
        "&userId=" +
        userState.userId +
        "&subjectId=" +
        examState.subjectId,
      "get"
    );
    if (fetchRes.status === 1) {
      console.log(fetchRes);
      setName(fetchRes.data.name);
      setDescription(fetchRes.data.description);
      setLimitTime(fetchRes.data.limitTime);
      setDay(fetchRes.data.day);
      setTime(fetchRes.data.time);
      setAllowSeeExplane(fetchRes.data.allowSeeExplane);
      setAllowSeeResult(fetchRes.data.allowSeeResult);
      setAllowSeeScore(fetchRes.data.allowSeeScore);
      setMaxAttempt(fetchRes.data.maxAttemps);
      let testList = fetchRes.data.testId
        .split("|")
        .filter((item: any) => item !== "");
      for (let index = 0; index < testList.length; index++) {
        testList[index] = Number(testList[index]);
      }
      setTargetKeys([...testList]);
    }
  };
  const handleEdit = async () => {
    const fetchBody = {
      name,
      description,
      maxAttempt,
      testId: targetKeys,
      limitTime,
      time,
      allowSeeExplane,
      allowSeeResult,
      allowSeeScore,
      userId: userState.userId,
      subjectId: examState.subjectId,
      testRoomId: examState.roomId,
    };
    const fetchRes = await fetchData("test-room/edit", "put", fetchBody);
    console.log(fetchRes);
    if (fetchRes.status === 1) {
      toast.success("Edit completed");
      setIsEdit(false);
      getDetail();
    } else toast.error(fetchRes.message);
  };
  const getMock = async () => {
    // const tempTargetKeys = [];
    const tempMockData = [];
    const fetchQuestions = await fetchData(
      `test/get/${examState.subjectId || "null"}`,
      "get"
    );
    console.log(fetchQuestions);
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
  const filterOption = (inputValue: string, option: TestType) =>
    option.id.toString().indexOf(inputValue) > -1 ||
    option.code.toString().indexOf(inputValue) > -1 ||
    option.name.indexOf(inputValue) > -1;

  const handleFormSubmit = async (value: any) => {
    const fetchBody = {
      ...form.getFieldsValue(),
      date: date,
      subjectId: examState.subjectId,
    };
    const fetchRes = await fetchData("/test-room", "POST", fetchBody);
    if (fetchRes.status === 0) {
      alert(fetchRes.message);
    }
    if (fetchRes.status === 1) {
      alert("Add test room success");
    }
    clearForm();
  };
  const clearForm = () => {
    setTargetKeys([]);
    form.resetFields();
    navigate(`\\${examState.subjectId}\\home`);
  };
  React.useEffect(() => {
    getMock();
  }, []);
  React.useEffect(() => {
    if (editId) getData();
  }, [editId]);
  return (
    <div className="flex flex-col w-full">
      <p className="text-3xl uppercase text-primary text-center">
        Create a new Exam Room
      </p>
      <Form
        form={form}
        name="create-info"
        onFinish={handleEdit}
        onFinishFailed={() => alert("Submit fail")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        className="flex flex-col py-10 overflow-auto w-full"
        autoComplete="off"
        initialValues={{ attempLimit: 1 }}
      >
        <Form.Item
          label="Name"
          rules={[{ required: true, message: "Please input test exam name!" }]}
        >
          <Input
            disabled={isExamStart}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Decribe">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Exam test"
          rules={[{ required: true, message: "Please choose exam test" }]}
        >
          <Transfer
            dataSource={mockData}
            titles={["Data", "Choosen"]}
            showSearch
            filterOption={filterOption}
            targetKeys={targetKeys}
            onChange={handleChange}
            render={(item) => {
              return (
                <div className="flex flex-col">
                  <span>{`${item.id || ""}-${item.code || ""}: `}</span>
                  {item.name}
                </div>
              );
              // return `${item.type || ""} - ${item.level || ""} : ${
              //   item.question ? parseHTML(item.question) : ""
              // }`;
            }}
            listStyle={{ width: 300, height: 350 }}
          />
        </Form.Item>
        <Form.Item
          label="Limit time"
          rules={[{ required: true, message: "Limit time is requied" }]}
        >
          <InputNumber
            disabled={isExamStart}
            placeholder="Minute"
            className="w-24"
            value={limitTime}
            onChange={(value) => setLimitTime(value || 0)}
            min={15}
            max={600}
          />
        </Form.Item>
        <Form.Item label="Exam date" className=" gap-x-4">
          <Select
            disabled={isExamStart}
            placeholder="Exam shift"
            value={time}
            onChange={(value) => setTime(value)}
          >
            <Option value="0:00-24:00" label="Full day">
              <p>Full day</p>
            </Option>
            <Option value="6:00-8:00" label="Ca 1">
              <p>Shift 1: 6h - 8h</p>
            </Option>
            <Option value="8:00-10:00" label="Ca 2">
              <p>Shift 1: 8h - 10h</p>
            </Option>
            <Option value="10:00-12:00" label="Ca 3">
              <p>Shift 1: 10h - 12h</p>
            </Option>
            <Option value="12:00-14:00" label="Ca 4">
              <p>Shift 1: 12h - 14h</p>
            </Option>
            <Option value="14:00-16:00" label="Ca 5">
              <p>Shift 1: 14h - 16h</p>
            </Option>
            <Option value="16:00-18:00" label="Ca 6">
              <p>Shift 1: 16h - 18h</p>
            </Option>
            <Option value="18:00-20:00" label="Ca 7">
              <p>Shift 1: 18h - 20h</p>
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Options">
          <Form.Item label="See Result" className="w-1/3 inline-block">
            <Checkbox
              checked={allowSeeResult}
              onChange={() => setAllowSeeResult(!allowSeeResult)}
            />
          </Form.Item>
          <Form.Item label="See Explain" className="w-1/3 inline-block">
            <Checkbox
              checked={allowSeeExplane}
              onChange={() => setAllowSeeExplane(!allowSeeExplane)}
            />
          </Form.Item>
          <Form.Item label="See Score" className="w-1/3 inline-block">
            <Checkbox
              checked={allowSeeScore}
              onChange={() => setAllowSeeScore(!allowSeeScore)}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Max attemp">
          <InputNumber
            min={1}
            max={10}
            value={maxAttempt}
            onChange={(value) => setMaxAttempt(value || 0)}
          />
        </Form.Item>
        <div className="text-center">
          <Button type="primary" htmlType="submit" size="large">
            Edit
          </Button>
        </div>
      </Form>
    </div>
  );
}
