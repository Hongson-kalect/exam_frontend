import { Add, Delete, Edit, PersonAdd, Search } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import * as React from "react";
import { fetchData } from "../../../utils/fetchFunction";
import { IQuestion } from "../Question";
import parser from "html-react-parser";
import { getSession } from "../../../utils/session";
import { Avatar, Input, InputRef, Select } from "antd";
import { getLocalStorage } from "../../../utils/localStorage";
import { getCookie } from "../../../utils/cookie";
import { toast } from "react-toastify";
import { MemberItem } from "./MemberItem";
import useExamState from "../../../stores/examStates";
import useUserState from "../../../stores/userState";

const { Option } = Select;

export interface IMemberManage {
  //   question: IQuestion;
  //   loadQuestion: () => void;
  //   setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  //   setEditItem: React.Dispatch<React.SetStateAction<{}>>;
}

export function MemberManage({}: IMemberManage) {
  const examState = useExamState();
  const userState = useUserState();

  const [isSearch, setIsSearch] = React.useState(false);
  const searchInputRef = React.useRef<InputRef>(null);
  const [searchVal, setSearchVal] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [addSearch, setAddSearch] = React.useState("");
  const [addVal, setAddVal] = React.useState<string[]>([]);
  const [selectOptions, setSelectOptions] = React.useState([]);

  const addingInputRef = React.useRef<InputRef>(null);
  const [member, setMember] = React.useState<any>();

  const getMember = async () => {
    const fetchBody = {
      subjectId: examState.subjectId,
      userId: userState.userId,
      search: searchVal,
    };
    const memberRes = await fetchData("subject/member", "post", fetchBody);
    if (memberRes.status === 1) {
      memberRes.data.member = memberRes.data.member.filter((item: any) => {
        return (
          item !== memberRes.data.host && !memberRes.data.deputy.includes(item)
        );
      });
      setMember(memberRes.data);
    } else {
      toast.error(memberRes.message);
    }
  };
  const getSelectOption = async () => {
    const fetchBody = {
      subjectId: examState.subjectId,
      userId: userState.userId,
      search: addSearch,
    };
    const optionsRes = await fetchData(
      "subject/member/search",
      "post",
      fetchBody
    );
    if (optionsRes.status === 1) {
      setSelectOptions(optionsRes.data);
    } else {
      toast.error(optionsRes.message);
    }
  };
  const handleAddMember = async (e: any) => {
    const fetchBody = {
      subjectId: examState.subjectId,
      userId: userState.userId,
      member: addVal,
    };
    const optionsRes = await fetchData("subject/member/add", "post", fetchBody);
    if (optionsRes.status === 1) {
      toast.success("Add member completed");
      getMember();
      getSelectOption();
      setAddVal([]);
    } else {
      toast.error(optionsRes.message);
    }
  };
  const handleSelectSearch = (value: string) => {
    setAddSearch(value);
  };
  const handleSelectChange = (value: string[]) => {
    setAddVal([...value]);
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchVal);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchVal]);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      getSelectOption();
    }, 500);
    return () => clearTimeout(timeout);
  }, [addSearch]);

  React.useEffect(() => {
    if (isSearch) searchInputRef.current?.focus();
  }, [isSearch]);
  React.useEffect(() => {
    if (isAdding) addingInputRef.current?.focus();
  }, [isAdding]);
  React.useEffect(() => {
    getMember();
  }, []);
  return (
    <div className="flex flex-col gap-y-4 relative h-full">
      <div className="member-manager-header flex justify-center items-center gap-x-2 sticky top-2 mb-2">
        {isSearch && (
          <Input
            ref={searchInputRef}
            placeholder="Search member..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="flex-1"
          />
        )}
        <div
          className={`px-2 pt-1 rounded-full hover:opacity-80 ${
            isSearch ? "bg-primary text-white" : "bg-gray-400 text-black"
          }`}
          onClick={() => {
            setIsSearch(true);
            setIsAdding(false);
          }}
        >
          <Search />
        </div>
        {getSession("permission") !== "member" && (
          <>
            <div
              className={`px-2 pt-1 rounded-full hover:opacity-80 ${
                isAdding ? "bg-primary text-white" : "bg-gray-400 text-black"
              }`}
              onClick={() => {
                setIsSearch(false);
                setIsAdding(true);
              }}
            >
              <PersonAdd />
            </div>
            {isAdding && (
              <form
                onSubmit={handleAddMember}
                className="flex-1 flex items-center"
              >
                <Select
                  value={addVal}
                  mode="multiple"
                  className="w-10/12"
                  placeholder="Enter email"
                  onChange={handleSelectChange}
                  onSearch={handleSelectSearch}
                  optionLabelProp="label"
                  maxTagCount={1}
                  showArrow={false}
                >
                  {selectOptions &&
                    selectOptions.map((item: any, index) => {
                      return (
                        <Option
                          key={index}
                          label={item.lastName}
                          value={item.email}
                        >
                          <div className="flex gap-x-2 text-xs items-center">
                            <Avatar size={"small"} src={item.avatar}>
                              {item.avatar ||
                                item.lastName.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>{item.lastName + " " + item.firstName}</div>
                          </div>
                        </Option>
                      );
                    })}
                </Select>
                <div
                  className="w-2/12 bg-slate-500 text-white text-center cursor-pointer rounded-full"
                  onClick={handleAddMember}
                >
                  <Add />
                </div>
              </form>
            )}
          </>
        )}
      </div>
      <div className="h-full member-manager-content flex flex-col gap-y-2 overflow-auto hide-scroll">
        {member && (
          <MemberItem
            getMember={getMember}
            search={search}
            email={member.host}
            type="host"
          />
        )}
        {member &&
          member.deputy?.map((item: any, index: number) => {
            return (
              <MemberItem
                getMember={getMember}
                search={search}
                key={item}
                email={item}
                type="deputy"
              />
            );
          })}
        {member &&
          member.member?.map((item: any, index: number) => {
            return (
              <MemberItem
                getMember={getMember}
                search={search}
                key={item}
                email={item}
                type="member"
              />
            );
          })}
      </div>
    </div>
  );
}
