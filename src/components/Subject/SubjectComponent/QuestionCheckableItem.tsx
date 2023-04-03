import * as React from "react";
import parser from "html-react-parser";

export interface IQuestionCheckableItemProps {
  index: string | number;
  question: {
    id: string | number;
    type: string;
    level: string;
    question: string;
  };
}

export function QuestionCheckableItem(props: IQuestionCheckableItemProps) {
  const [wrap, setWrap] = React.useState(true);
  return (
    <tr
      className={wrap ? "td-nowrap" : ""}
      onClick={() => {
        setWrap(!wrap);
      }}
    >
      <td>
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            data-id={props.question.id}
            name="question[]"
            value={"" || JSON.stringify(props.question)}
          />
        </div>
      </td>
      <td>{props.question.id}</td>
      <td>{props.question.type}</td>
      <td>{props.question.level}</td>
      <td>{parser(props.question.question)}</td>
    </tr>
  );
}
