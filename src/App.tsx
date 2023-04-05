import React, { useState } from "react";
import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { Subject as SubjectLayout } from "./layout/SubjectLayout";
import { Subject } from "./components/Subject";
import Home from "./components/Subject/Home";
import Question from "./components/Subject/Question";
import SubjectTest from "./components/Subject/SubjectTest";
import TestRoomDetail from "./components/Subject/ExamDetail";
import Test from "./components/Testcomponent";
import { StyledEngineProvider } from "@mui/material";
import CreateExam from "./components/Subject/CreateExam";
import SignUp from "./components/SignUp";
import Exam from "./components/Exam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubjectInfo from "./components/Subject/SubjectInfo";
import TestLayout from "./components/Testcomponent";
import TestLayout2 from "./components/Testcomponent2";
import { Spin } from "antd";
import { useAppState } from "./stores/appState";

function App() {
  const appState = useAppState();
  return (
    <StyledEngineProvider injectFirst>
      <ToastContainer />
      <BrowserRouter>
        {appState.isLoading && (
          <div className="loading flex justify-center items-center fixed top-0 bottom-0 right-0 left-0 z-10">
            <Spin size="large" />
          </div>
        )}
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/test-layout" element={<TestLayout />} />
          <Route path="/test-layout-2" element={<TestLayout2 />} />
          <Route path="/login" element={<Login appState={appState} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Subject />} />
          <Route
            path="/:subject"
            element={<SubjectLayout appState={appState} />}
          >
            <Route index element={<Home appState={appState} />} />
            <Route path="info" element={<SubjectInfo />} />
            <Route path="question" element={<Question appState={appState} />} />
            <Route path="subject_test" element={<SubjectTest />} />
            <Route path="create_exam" element={<CreateExam />} />
            <Route path=":room/detail" element={<TestRoomDetail />} />
            <Route path="*" element={<Home appState={appState} />} />
          </Route>
          <Route path="/exam" element={<Exam appState={appState} />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  );
}

export default App;
