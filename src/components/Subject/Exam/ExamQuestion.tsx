import * as React from "react";
import parser from "html-react-parser";
export interface IExamQuestionProps {
  onClick: (e: any) => void;
  result?: any;
  userAnser?: string;
  index: number;
  question: {
    question: string;
    ansers: string[];
  };
}

const getHTML = (tring: string) => {
  return parser(tring);
};

export default function ExamQuestion({
  result,
  onClick,
  index,
  question,
  userAnser,
}: IExamQuestionProps) {
  const [IsCorrect, setIsCorrect] = React.useState(true);

  React.useEffect(() => {
    if (result) {
      const anserArr = result.anser.split("-");
      const userRadio = document.getElementById(
        result.userAnser + "-" + index
      ) as HTMLInputElement;
      const userAnser = userRadio?.closest(".anser-wrap");
      if (anserArr[Number(result.userAnser) + 1] === "0") {
        userAnser?.classList.add("correct");
      } else {
        setIsCorrect(false);
        const indexCorrect = anserArr.indexOf("0");
        const correctAnser = document
          .getElementById(indexCorrect - 1 + "-" + index)
          ?.closest(".anser-wrap");

        userAnser?.classList.add("wrong");
        correctAnser?.classList.add("correct");
      }
    }
  }, []);
  return (
    <div>
      <div className="question flex gap-x-1 items-center" id={index.toString()}>
        <div className="question-number text-lg font-medium text-gray-700">
          <b>Question {index + 1}:</b> {parser(question.question)}
        </div>

        {/* <p className="text-lg font-medium text-gray-700">Question {(index+1)}:</p>
        {parser(question.question)} */}
      </div>
      <div
        className="ansers flex mt-1 items-start gap-x-2 px-2 text-sm"
        data-id={index}
      >
        {result ? (
          <>
            {question.ansers[0] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"0-" + index}
                  value="a"
                  disabled
                  checked={result.userAnser === "0"}
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"0-" + index}>{question.ansers[0]}</label>
              </div>
            )}
            {question.ansers[1] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"1-" + index}
                  value="b"
                  checked={result.userAnser === "1"}
                  disabled
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"1-" + index}>{question.ansers[1]}</label>
              </div>
            )}
            {question.ansers[2] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"2-" + index}
                  value="c"
                  checked={result.userAnser === "2"}
                  disabled
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"2-" + index}>{question.ansers[2]}</label>
              </div>
            )}
            {question.ansers[3] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"3-" + index}
                  value="d"
                  checked={result.userAnser === "3"}
                  disabled
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"3-" + index}>{question.ansers[3]}</label>
              </div>
            )}
          </>
        ) : (
          <>
            {question.ansers[0] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"0-" + index}
                  value="a"
                  checked={userAnser === "a"}
                  onChange={(e) => onClick(e)}
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"0-" + index}>{question.ansers[0]}</label>
              </div>
            )}
            {question.ansers[1] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"1-" + index}
                  value="b"
                  checked={userAnser === "b"}
                  onChange={(e) => onClick(e)}
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"1-" + index}>{question.ansers[1]}</label>
              </div>
            )}
            {question.ansers[2] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"2-" + index}
                  value="c"
                  checked={userAnser === "c"}
                  onChange={(e) => onClick(e)}
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"2-" + index}>{question.ansers[2]}</label>
              </div>
            )}
            {question.ansers[3] && (
              <div className="anser-wrap basis-1/4 flex items-center justify-start">
                <input
                  type="radio"
                  name={`anser-${index}`}
                  id={"3-" + index}
                  value="d"
                  checked={userAnser === "d"}
                  onChange={(e) => onClick(e)}
                  className="basis-1/6 mr-2  h-5"
                />
                <label htmlFor={"3-" + index}>{question.ansers[3]}</label>
              </div>
            )}
          </>
        )}
      </div>
      {result?.explain && !IsCorrect && (
        <div className="mt-2 ml-4 text-red-400">Explain: {result.explain}</div>
      )}
    </div>
  );
}
