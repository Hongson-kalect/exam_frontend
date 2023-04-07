import { Typography } from "@mui/material";
import { Input, Form, Checkbox, Button, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppState } from "../../stores/appState";
import useExamState from "../../stores/examStates";
import useUserState from "../../stores/userState";
import { getCookie } from "../../utils/cookie";
import { fetchData } from "../../utils/fetchFunction";
import { getLocalStorage } from "../../utils/localStorage";
import { getSession } from "../../utils/session";

export interface ISubjectInfoProps {}

export default function SubjectInfo(props: ISubjectInfoProps) {
  const navigate = useNavigate();
  const appState = useAppState();
  const examState = useExamState();
  const userState = useUserState();

  const [form] = useForm();
  const [subjectInfo, setSubjectInfo] = useState<any>({});
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [allowSeeQuestion, setAllowSeeQuestion] = useState(false);
  const [allowSeeTest, setAllowSeeTest] = useState(false);
  const [subjectAvatar, setSubjectAvatar] = useState<string>("");
  const [isEdit, setIsEdit] = useState(false);

  const handleClick = async (e: any) => {
    if (isEdit) {
      const fetchBody = {
        name,
        description,
        allowSeeQuestion,
        allowSeeTest,
        avatar: subjectAvatar,
        subjectId: examState.subjectId,
        id: userState.userId,
      };
      appState.setIsLoading(true);
      const fetchRes = await fetchData(
        //better use room hash here
        "subject-info",
        "put",
        fetchBody
      );
      appState.setIsLoading(false);
      if (fetchRes.status === 1) {
        toast.success("Change info success");
        navigate("home");
      } else {
        toast.error(fetchRes.message);
      }
    } else setIsEdit(true);
  };
  const getSubjectInfo = async () => {
    appState.setIsLoading(true);
    const fetchRes = await fetchData(
      "subject-info/" + examState.subjectId,
      "get"
    );
    appState.setIsLoading(false);
    const info = fetchRes.data;
    if (info) {
      setName(info.name);
      setDescription(info.description);
      setHash(info.hash);
      setSubjectAvatar(info.avatar);
      setAllowSeeQuestion(info.allowSeeQuestion);
      setAllowSeeTest(info.allowSeeTest);
    }
  };
  useEffect(() => {
    getSubjectInfo();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <p className="text-3xl uppercase text-primary text-center">
        Create a new Exam Room
      </p>
      <Form
        form={form}
        name="create-info"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        className="flex flex-col py-10 overflow-auto w-full"
        autoComplete="off"
        initialValues={{
          name: "qqq",
          description,
          hash,
          allowSeeQuestion,
          allowSeeTest,
          subjectAvatar,
        }}
      >
        <Form.Item
          label="Name"
          rules={[{ required: true, message: "Please input test exam name!" }]}
        >
          {isEdit ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="qq"
            />
          ) : (
            <Typography> {name}</Typography>
          )}
        </Form.Item>
        <Form.Item label="Description">
          {isEdit ? (
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <Typography> {description}</Typography>
          )}
        </Form.Item>
        <Form.Item label="Room hash">
          <Typography> {hash}</Typography>
        </Form.Item>

        <Form.Item label="Allow Member See Questions">
          <Form.Item valuePropName="checked" className="w-1/3 inline-block">
            <Checkbox
              disabled={!isEdit}
              checked={allowSeeQuestion}
              onChange={(e) => {
                setAllowSeeQuestion(!allowSeeQuestion);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Allow Member See Test"
            valuePropName="checked"
            className="w-1/3 inline-block"
          >
            <Checkbox
              disabled={!isEdit}
              checked={allowSeeTest}
              onChange={(e) => {
                setAllowSeeTest(!allowSeeTest);
              }}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Upload">
          {isEdit ? (
            <Input
              value={subjectAvatar}
              onChange={(e) => setSubjectAvatar(e.target.value)}
              placeholder="Enter URL here"
            />
          ) : (
            <Typography className="w-full overflow-hidden whitespace-nowrap">
              {subjectAvatar}
            </Typography>
          )}
        </Form.Item>
        <div className="w-full text-center">
          <Image
            width={200}
            height={200}
            alt="preview Image"
            src={
              subjectAvatar ||
              "https://www.cnet.com/a/img/resize/fbed5b83741a0de89c81dd89bbb3ad1c245d1907/hub/2023/02/17/436d6904-b4db-4d5b-8507-2a489ec16f9c/naruto.jpg?auto=webp&fit=crop&height=675&width=1200"
            }
          />
        </div>
        {/* Only for user with enough permission */}
      </Form>
      {(getSession("permission") === "host" ||
        getSession("permission") === "deputy") && (
        <Button
          type="primary"
          className="fixed bottom-4 right-2/12 left-1/3 text-lg px-2 py-1 "
          onClick={(e) => handleClick(e)}
        >
          {isEdit ? "Confirm Change" : "Edit Info"}
        </Button>
      )}
    </div>
  );
}
