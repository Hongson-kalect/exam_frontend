import { TextField } from "@mui/material";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Transfer,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { TransferDirection } from "antd/es/transfer";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../../stores/appState";
import useExamState from "../../stores/examStates";
import useTestingState from "../../stores/testingState";
import useUserState from "../../stores/userState";
import { fetchData } from "../../utils/fetchFunction";
import "../../scss/CreateExam.scss";

const { Option } = Select;
const options = [
  { value: "Easy", label: "Easy" },
  { value: "Normal", label: "Normal" },
  { value: "Hard", label: "Hard" },
  { value: "Extreme", label: "Extreme" },
];
export interface ICreateNewTestProps {}

interface TestType {
  id: string | number;
  code: string;
  name: string;
}

export default function CreateExam(props: ICreateNewTestProps) {
  const navigate = useNavigate();

  const [form] = useForm();
  const [date, setDate] = React.useState("");

  const appState = useAppState();
  const examState = useExamState();
  const testingState = useTestingState();
  const userState = useUserState();

  const [mockData, setMockData] = React.useState<TestType[]>([]);
  const [targetKeys, setTargetKeys] = React.useState<any[]>([]);

  const getMock = async () => {
    // const tempTargetKeys = [];
    const tempMockData = [];
    appState.setIsLoading(true);
    const fetchQuestions = await fetchData(
      `test/get/${examState.subjectId || "null"}`,
      "get"
    );
    appState.setIsLoading(false);
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
      userId: userState.userId,
    };
    appState.setIsLoading(true);
    const fetchRes = await fetchData("test-room", "POST", fetchBody);
    appState.setIsLoading(false);
    if (fetchRes.status === 0) {
      alert(fetchRes.message);
    }
    if (fetchRes.status === 1) {
      alert("Add test room success");
    }
    clearForm();
  };
  const onDatePickerChange = (value: any) => {
    setDate(value.format("YYYY-MM-DD"));
  };
  const clearForm = () => {
    setTargetKeys([]);
    form.resetFields();
    navigate(`\\${examState.subjectId}\\home`);
  };
  React.useEffect(() => {
    getMock();
  }, []);
  return (
    <div className="create-exam hide-scroll">
      <p className="title">Create a new Exam Room</p>
      <Form
        form={form}
        name="create-info"
        onFinish={handleFormSubmit}
        onFinishFailed={() => alert("Submit fail")}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        className="flex flex-col py-10 overflow-auto w-full hide-scroll"
        autoComplete="off"
        initialValues={{ attempLimit: 1 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input test exam name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Decribe" name="description">
          <Input />
        </Form.Item>
        <Form.Item
          label="Exam test"
          name="testSubjectList"
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
                <div className="test-item">
                  <div className="title">
                    <p className="id">id: {item.id}</p>
                    <p className="code">code: {item.code}</p>
                  </div>
                  <p className="name">{item.name}</p>
                </div>
              );
              // return `${item.type || ""} - ${item.level || ""} : ${
              //   item.question ? parseHTML(item.question) : ""
              // }`;
            }}
            listStyle={{ width: 600, height: 350 }}
          />
        </Form.Item>
        <Form.Item
          name="limitTime"
          label="Limit time"
          rules={[{ required: true, message: "Limit time is requied" }]}
        >
          <InputNumber
            placeholder="Minute"
            className="w-24"
            min={15}
            max={600}
          />
        </Form.Item>
        <Form.Item label="Exam date" className=" gap-x-4">
          {/* <Input type="date" /> */}
          <Form.Item
            name="date"
            className="mr-4 inline-block"
            rules={[{ required: true, message: "Please fill this field" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(value) => onDatePickerChange(value)}
            />
          </Form.Item>
          <Form.Item
            name="shift"
            className="w-1/3 inline-block"
            rules={[{ required: true, message: "Please fill this field" }]}
          >
            <Select placeholder="Exam shift">
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
        </Form.Item>
        <Form.Item label="Options">
          <Form.Item
            label="See Result"
            name="seeResult"
            valuePropName="checked"
            className="w-1/3 inline-block"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="See Explain"
            name="seeExplain"
            valuePropName="checked"
            className="w-1/3 inline-block"
          >
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="See Score"
            name="seeScore"
            valuePropName="checked"
            className="w-1/3 inline-block"
          >
            <Checkbox />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Max attemp" name="attempLimit">
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="fixed bottom-4 right-2/12 left-1/3 text-lg px-2 py-1 "
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
