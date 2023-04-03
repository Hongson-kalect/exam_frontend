import React, { useState } from "react";
import type { TransferDirection } from "antd/es/transfer";
import { Input, TextField } from "@mui/material";
import useExamState from "../stores/examStates";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const TestLayout2: React.FC = () => {
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useExamState((state) => [
    state.subjectId,
    state.setSubjectId,
  ]);

  console.log(subjectId, setSubjectId);
  return (
    <div>
      <TextField
        title="Subject ID"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      />
      <TextField />
      <TextField />
      <Button onClick={() => navigate("/test-layout")}>
        Click to go test 1
      </Button>
    </div>
  );
};

export default TestLayout2;
