import { Add, PlusOneOutlined, Warning } from "@mui/icons-material";
import { Button, Modal, Form, AutoComplete, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import * as React from "react";
import axios from "axios";
import { Tooltip } from "@mui/material";

export interface IAddQuestionExcelProps {}

export function AddQuestionExcel(props: IAddQuestionExcelProps) {
  const [fileVal, setFileVal] = React.useState<any>("");
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let file;
    if (fileRef.current) {
      file = fileRef.current.files?.[0] || "qq";
      console.log(fileRef.current.files?.[0] || "qq");
    }

    // e.preventDefault();
    const data = new FormData();
    if (file) data.append("upload_file", fileRef?.current?.files?.[0] || "qq");
    // console.log(fetchTest);
    axios.post("http://localhost:3001/api/question/add-excel", data);
    // const fetchTest = await fetchData("testlink", "post", data);
  };
  return (
    <>
      <form
        className="form flex flex-col items-center justify-center relative"
        onSubmit={uploadFile}
        // action="http://localhost:3001/api/testlink"
        method="post"
        encType="multipart/form-data"
      >
        <div className="absolute top-4 right-4 text-red-300 cursor-pointer">
          <Tooltip title="Excel file have to start by A column, and with column is subjectId, question, type, level, anser(correct|wrong|worng|....), explain, anserTimes, correctTimes, createdAt(options), updatedAt(options) some column is nullable, record will be save start from line 2">
            <Warning />
          </Tooltip>
        </div>
        <label
          htmlFor="File"
          className="text-2xl font-bold text-green-400 mb-4"
        >
          Add question by Excel file
        </label>
        <label
          htmlFor="File"
          className="w-40 h-40  cursor-pointer hover:scale-110 duration-300 ease-out"
          style={{
            background:
              "url('https://www.lifewire.com/thmb/TRGYpWa4KzxUt1Fkgr3FqjOd6VQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cloud-upload-a30f385a928e44e199a62210d578375a.jpg') center center no-repeat",
            backgroundSize: "cover",
          }}
        ></label>
        <input
          className="hidden"
          ref={fileRef}
          type="file"
          value={fileVal}
          onChange={(e) => setFileVal(e.target.value || "")}
          name="upload_file"
          id="File"
        />
        <p className="text-lg italic font-semibold underline my-4 text-gray-700">
          {fileVal}
        </p>
        <Button
          htmlType="submit"
          type="primary"
          size="large"
          className="hover:scale-110 duration-300 ease-out"
        >
          click here to submit
        </Button>
      </form>
    </>
  );
}
