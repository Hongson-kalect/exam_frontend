import React, { useEffect, useState } from "react";
import ExamQuestion from "./ExamQuestion";

export interface IExamQuestionsProps {
  checkResult?: boolean;
  result?: any;
  exam?: any;
  userAnser?: string[];
  onAnserChange: (e: any) => void;
  setUserAnser: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ExamQuestions({
  checkResult,
  exam,
  result,
  userAnser,
  onAnserChange,
  setUserAnser,
}: IExamQuestionsProps) {
  const [anserArr, setAnserArr] = useState<string[]>([]);

  //   const [exam, setExam] = useState<any>();
  //   const [userAnser, setUserAnser] = useState<string[]>([]);

  //   const onAnserFormChange = (e: any) => {
  //     const id = e.target.closest(".ansers")?.dataset.id;
  //     setUserAnser((prev) => {
  //       prev[id] = e.target.value;
  //       return [...prev];
  //     });
  //   };
  useEffect(() => {
    if (result) {
      const tempArr = result.anser
        .split("|")
        .filter((item: string) => item !== "");
      setAnserArr([...tempArr]);
    }
  }, [result]);
  console.log(exam);
  return (
    <div className="exam-content lg:mx-5 shadow-around bg-white pb-10 px-10">
      <h2 className="header text-center text-2xl font-semibold pt-4">
        {exam?.name}
      </h2>
      <div className="subject text-center text-xl font-medium mt-4">
        Subject: {"Lop Cong trinh va xay dung"}
      </div>
      <form
        id="question-form"
        className="question-content m-2 gap-y-2 flex flex-col"
      >
        {checkResult
          ? result &&
            anserArr.length > 0 &&
            result.questions.map((item: any, index: number) => {
              return (
                <ExamQuestion
                  result={{
                    anser: anserArr[index],
                    userAnser: result.userAnser[index],
                    explain: result?.explain?.[index] || "",
                  }}
                  key={index}
                  index={index}
                  question={item}
                  onClick={onAnserChange}
                />
              );
            })
          : exam &&
            exam.questions.map((item: any, index: number) => {
              return (
                <ExamQuestion
                  userAnser={userAnser ? userAnser[index] : ""}
                  key={index}
                  index={index}
                  question={item}
                  onClick={onAnserChange}
                />
              );
            })}
      </form>
      <h3 className="text-center italic mt-10">end of exam</h3>
    </div>
  );
}
