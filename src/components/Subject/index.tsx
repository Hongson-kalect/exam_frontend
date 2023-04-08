import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Login, UploadOutlined } from "@mui/icons-material";
import { Modal, Button, Form, Input, Upload, Image, Spin, Empty } from "antd";
import { getCookie, setCookie } from "../../utils/cookie";
import { fetchData } from "../../utils/fetchFunction";
import { SubjectCard } from "./SubjectComponent/SubjectCard";
import { setLocalStorage } from "../../utils/localStorage";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import useExamState from "../../stores/examStates";
import useUserState from "../../stores/userState";
// import { FormInstance, use`Form } from "antd/es/form/Form";

export interface ISubjectProps {}

window.addEventListener("beforeunload", (ev) => {
  ev.preventDefault();
  return (ev.returnValue = "Are you sure you want to close?");
});

export function Subject(props: ISubjectProps) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const examState = useExamState();
  const userState = useUserState();
  const [name, setName] = useState("");
  const [hash, setHash] = useState("");
  const [decribe, setDecribe] = useState("");
  const [subjects, setSubjects] = useState<any>([]);
  const [image, setImage] = useState("");
  const [previewLink, setpreviewlink] = useState(
    "https://globalcastingresources.com/wp-content/uploads/2022/10/1664482232_How-much-does-the-anime-streaming-service-cost.jpg"
  );
  // const [form]: [FormInstance<any>] = useForm();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [hashJoinModalShow, setHashJoinModalShow] = useState<boolean>(false);

  const getSubjects = async () => {
    if (userState.userId) {
      const items = await fetchData("subject/" + userState.userId, "get");
      setSubjects(items.data);
    }
  };
  const handleFormSubmit = async () => {
    const fetchBody = {
      name: name,
      decribe: decribe,
      upload: image,
      hash: v4(),
      host: userState.userId,
    };
    setIsLoading(true);
    const fetchRes = await fetchData("subject", "POST", fetchBody);
    setIsLoading(false);
    if (fetchRes.status === 1) {
      alert("Add subject success");
      handleFormClose();
      getSubjects();
    }
  };
  const handleHashJoin = async () => {
    setIsLoading(true);
    const JoinResult = await fetchData("subject/join", "post", {
      hash,
      id: userState.userId,
    });
    setIsLoading(false);
    if (JoinResult.status === 1) {
      toast.success("Join subject success");
      getSubjects();
      setHashJoinModalShow(false);
      setHash("");
    } else toast.error(JoinResult.message);
  };
  const handleFormClose = () => {
    setAddModalOpen(false);
    setHashJoinModalShow(false);
  };
  useEffect(() => {
    if (!userState.userId) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="loading flex justify-center items-center fixed top-0 bottom-0 right-0 left-0 z-10">
          <Spin size="large" />
        </div>
      )}
      <main className="flex items-start justify-center h-full w-full">
        <div className="subject-contain items-start flex flex-col h-full w-full overflow-auto hide-scroll">
          <div className="flex w-full justify-center mt-2 mr-2">
            <div
              onClick={() => setAddModalOpen(true)}
              className="add flex items-center py-1 px-2 bg-green-400 rounded-l-full cursor-pointer opacity-80 hover:opacity-100"
              style={{
                border: "1px solid",
                borderColor: "transparent black transparent transparent",
              }}
            >
              <Add /> {"Create new room"}
            </div>
            <div
              onClick={() => setHashJoinModalShow(true)}
              className="add flex items-center py-1 px-2 bg-green-400 rounded-r-full cursor-pointer opacity-80 hover:opacity-100"
            >
              <Login /> {"Join by hash"}
            </div>
          </div>
          <div className="flex flex-wrap items-start px-8 py-2 justify-start w-full">
            {subjects.length > 0 ? (
              subjects?.map((subject: any) => {
                return (
                  <div
                    key={subject.id}
                    className="w-1/6 p-4"
                    onClick={() => {
                      examState.setSubjectId(subject.id);
                      navigate(`/${subject.id}`);
                    }}
                  >
                    <SubjectCard name={subject.name} image={subject.avatar} />
                  </div>
                );
              })
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </main>
      <Modal
        closable={false}
        footer={false}
        open={addModalOpen}
        onCancel={handleFormClose}
      >
        <Form
          // form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleFormSubmit}
        >
          <p className="text-center w-full text-3xl text-primary mb-4">
            Add Room
          </p>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Decribe" name="decribe">
            <Input
              value={decribe}
              onChange={(e) => setDecribe(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="upload" label="Upload">
            <Input
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter URL here"
            />
          </Form.Item>
          <div className="w-full text-center">
            <Image
              width={200}
              height={200}
              alt="preview Image"
              src={
                image ||
                "https://www.cnet.com/a/img/resize/fbed5b83741a0de89c81dd89bbb3ad1c245d1907/hub/2023/02/17/436d6904-b4db-4d5b-8507-2a489ec16f9c/naruto.jpg?auto=webp&fit=crop&height=675&width=1200"
              }
            />
          </div>
          <Button type="primary" htmlType="submit" className="mt-4 w-full">
            Submit
          </Button>
        </Form>
      </Modal>
      <Modal
        closable={false}
        footer={false}
        open={hashJoinModalShow}
        onCancel={handleFormClose}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleHashJoin}
        >
          <p className="text-center w-full text-3xl text-primary mb-4">
            Enter Subject Room Hash
          </p>
          <Form.Item
            label="Subject hash"
            name="hash"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input value={hash} onChange={(e) => setHash(e.target.value)} />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="mt-4 w-full">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
