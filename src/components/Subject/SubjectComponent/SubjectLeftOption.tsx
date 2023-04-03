import * as React from "react";
import useUserState from "../../../stores/userState";
import { getCookie } from "../../../utils/cookie";
import { fetchData } from "../../../utils/fetchFunction";

export interface ISubjectLeftOptionProps {
  icon?: React.ReactNode;
  title: string;
  onClick?: () => void;
}

export function SubjectLeftOption(props: ISubjectLeftOptionProps) {
  const userState = useUserState();
  const [name, setName] = React.useState("");
  const [decribe, setDecribe] = React.useState("");
  const [subjects, setSubjects] = React.useState<any>([]);
  const [image, setImage] = React.useState("");
  const [previewLink, setpreviewlink] = React.useState(
    "https://globalcastingresources.com/wp-content/uploads/2022/10/1664482232_How-much-does-the-anime-streaming-service-cost.jpg"
  );
  // const [form]: [FormInstance<any>] = useForm();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [addModalOpen, setAddModalOpen] = React.useState<boolean>(false);
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const file = e.target.files[0];
  //     setpreviewlink(URL.createObjectURL(file));
  //   }
  // };
  const handleFormSubmit = async () => {
    const fetchBody = {
      name: name,
      decribe: decribe,
      upload: image,
      host: userState.userId,
    };
    const fetchDate = await fetchData("subject", "POST", fetchBody);
    console.log(fetchDate);
  };
  const handleFormClose = () => {
    setAddModalOpen(false);
  };
  return (
    <div
      onClick={props.onClick}
      className="duration-200 flex items-center gap-2 px-1 my-2 py-2 hover:bg-blue-400 hover:text-white cursor-pointer rounded-md"
    >
      {props.icon}
      <p>{props.title}</p>
    </div>
  );
}
