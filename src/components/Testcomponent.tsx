import React, { useRef, useState } from "react";
import type { TransferDirection } from "antd/es/transfer";
import { Button, Input, TextField } from "@mui/material";
import useExamState from "../stores/examStates";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/fetchFunction";
import axios from "axios";

const TestLayout: React.FC = () => {
  const [fileVal, setFileVal] = useState<any>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  console.log(fileVal);
  const uploadFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let file;
    if (fileRef.current) {
      file = fileRef.current.files?.[0] || "qq";
      console.log(fileRef.current.files?.[0] || "qq");
    }

    // e.preventDefault();
    const form = document.forms[0];
    const data = new FormData();
    if (file) data.append("upload_file", fileRef?.current?.files?.[0] || "qq");
    // console.log(fetchTest);
    axios.post("http://localhost:3001/api/testlink", data);
    // const fetchTest = await fetchData("testlink", "post", data);
  };
  // console.log(testRes);
  return (
    <div>
      <form
        className="form"
        onSubmit={uploadFile}
        // action="http://localhost:3001/api/testlink"
        method="post"
        encType="multipart/form-data"
      >
        <label htmlFor="File">Click here to upload File</label>
        <input
          ref={fileRef}
          type="file"
          value={fileVal}
          onChange={(e) => setFileVal(e.target.value)}
          name="upload_file"
          id="File"
        />
        <button type="submit">click here to submit</button>
      </form>
    </div>
  );
};

export default TestLayout;
