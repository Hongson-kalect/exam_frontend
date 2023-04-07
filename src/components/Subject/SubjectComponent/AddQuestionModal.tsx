import { Add, PlusOneOutlined } from "@mui/icons-material";
import { Button, Modal, Form, AutoComplete, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import * as React from "react";
import ReactQuill from "react-quill";
import { useAppState } from "../../../stores/appState";
import useExamState from "../../../stores/examStates";

import { fetchData } from "../../../utils/fetchFunction";
import { getLocalStorage } from "../../../utils/localStorage";

export interface IAddQuestionModalProps {
  types?: string[];
  loadQuestion: () => void;
  onCancel: () => void;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editItem: any;
}

export function AddQuestionModal(props: IAddQuestionModalProps) {
  const appState = useAppState();
  const examState = useExamState();

  const [anserInputNumber, setAnserInputNumber] = React.useState<number[]>([]);
  const [type, setType] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [explain, setExplain] = React.useState("");
  const [editAnser, setEditAnser] = React.useState<string[]>([]);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const fetchBody = {
        type: type,
        level: level,
        question: question,
        anser: formData.getAll("anser"),
        explain: explain,
        subjectId: examState.subjectId,
      };
      appState.setIsLoading(true);
      await fetchData("question", "post", fetchBody);
      appState.setIsLoading(false);
      props.loadQuestion();
      alert("Add question success");
      props.onCancel();
      clearInput();
    }
    // console.log(formRef.current.getValue("type"));
  };
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const fetchBody = {
        id: props.editItem.id || "",
        type: type,
        level: level,
        question: question,
        anser: formData.getAll("anser"),
        explain: explain,
      };
      appState.setIsLoading(true);
      await fetchData("question/edit", "put", fetchBody);
      appState.setIsLoading(false);
      props.loadQuestion();
      alert("Edit question success");
      props.onCancel();
      clearInput();
    }
    // console.log(formRef.current.getValue("type"));
  };
  const clearInput = () => {
    setType("");
    setLevel("Easy");
    setQuestion("");
    setExplain("");
  };
  const modules = React.useMemo(
    () => ({
      toolbar: [
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
      ],
      // imageUploader: {
      //   upload: async (file:any) => {
      //     const bodyFormData = new FormData();
      //     bodyFormData.append("image", file);
      //     const response = await axios({
      //       method: "post",
      //       url: `${process.env.REACT_APP_IMG_PORT}`,
      //       data: bodyFormData,
      //       headers: {
      //         "Content-type": "multipart/form-data",
      //       },
      //     });
      //     return response.data.data.url;
      //   },
      // },
    }),

    []
  );
  React.useEffect(() => {
    if (props?.editItem) {
      setType(props?.editItem.type || "");
      setLevel(props?.editItem.level || "");
      setQuestion(props?.editItem.question || "");
      setExplain(props?.editItem.explain || "");
      setEditAnser(props?.editItem?.anser?.split("|") || []);
    }
  }, [props.editItem]);
  return (
    <>
      <form
        ref={formRef}
        onSubmit={props.isEdit ? handleEditSubmit : handleSubmit}
        className="add-question-form flex flex-col gap-y-4"
      >
        <p className="text-center font-bold text-primary text-3xl mb-2">
          {props.isEdit ? "Edit question" : "Add question"}
        </p>
        <div className="flex justify-center gap-4">
          <Input
            list="types"
            value={type}
            placeholder="Question type"
            onChange={(e) => setType(e.target.value)}
            name="type"
          />
          <datalist id="types">
            {props.types?.map((item: any, index: number) => {
              return <option key={index} value={item.type} />;
            })}
          </datalist>
          <select
            name="level"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded border border-gray-400 px-2 py-1 text-center"
          >
            <option value="">---Question Level---</option>
            <option value="Easy">Easy</option>
            <option value="Normal">Normal</option>
            <option value="Hard">Hard</option>
            <option value="Extreme">Extreme</option>
          </select>
        </div>
        {/* <input
          type="text"
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="enter question..."
          className="flex-1 border border-gray-400 px-2 rounded-lg"
        /> */}
        <ReactQuill
          // formats={formats}

          modules={modules}
          theme="snow"
          value={question}
          onChange={(value) => setQuestion(value)}
        />

        {props.isEdit ? (
          editAnser.map((item: any, index: number, list: any) => {
            console.log(index);
            //let anserLength= props.editItem.anser.split('|').length-index+1
            if (index === 0)
              return (
                <div key={index} className="flex justify-evenly gap-2">
                  <input
                    type="text"
                    placeholder="correct anser..."
                    name="anser"
                    value={list[index] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border border-red-300 rounded-md w-1/4 text-primary bg-red-200"
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 1] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 1] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 2] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 2] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 3] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 3] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                </div>
              );
            else if (index % 4 === 0) {
              return (
                <div key={index} className="flex justify-evenly gap-2">
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 1] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 1] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 2] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 2] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    value={list[index + 3] || ""}
                    onChange={(e) =>
                      setEditAnser(() => {
                        const slug = [...editAnser];
                        slug[index + 3] = e.target.value;
                        return slug;
                      })
                    }
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                </div>
              );
            } else return "";
          })
        ) : (
          <>
            <div className="flex justify-evenly gap-2">
              <input
                type="text"
                placeholder="correct anser..."
                name="anser"
                className="px-1 border border-red-300 rounded-md w-1/4 text-primary white bg-red-200"
              />
              <input
                type="text"
                placeholder="other..."
                name="anser"
                className="px-1 border rounded border-gray-400 w-1/4 "
              />
              <input
                type="text"
                placeholder="other..."
                name="anser"
                className="px-1 border rounded border-gray-400 w-1/4 "
              />
              <input
                type="text"
                placeholder="other..."
                name="anser"
                className="px-1 border rounded border-gray-400 w-1/4 "
              />
            </div>
            {anserInputNumber.map((item, index) => {
              return (
                <div key={index} className="flex justify-evenly gap-2">
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                  <input
                    type="text"
                    placeholder="other..."
                    name="anser"
                    className="px-1 border rounded border-gray-400 w-1/4 "
                  />
                </div>
              );
            })}
            <div className="flex justify-center items-center gap-2">
              <div
                onClick={() => setAnserInputNumber([...anserInputNumber, 1])}
              >
                <Add className="cursor-pointer text-4xl" />
              </div>
              Add other anser
            </div>
          </>
        )}

        <input
          type="text"
          name="explain"
          value={explain || ""}
          onChange={(e) => setExplain(e.target.value)}
          placeholder="explain question..."
          className="mt-2 w-full border border-gray-400 px-2 rounded-lg"
        />
        <div className="flex justify-center items-center">
          <Button type="primary" htmlType="submit" size="large">
            {props.isEdit ? "Edit Question" : "Add Question"}
          </Button>
        </div>
      </form>
    </>
  );
}
