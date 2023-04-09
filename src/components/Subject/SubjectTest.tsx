import { AddSubjectTestModal } from "./SubjectComponent/AddSubjectModal";
import SubjectTestItem from "./SubjectComponent/SubjectTestItem";
import { Button, Modal } from "antd";
import * as React from "react";
import { fetchData } from "../../utils/fetchFunction";
import { getLocalStorage } from "../../utils/localStorage";
import { getCookie } from "../../utils/cookie";
import { getSession } from "../../utils/session";
import useExamState from "../../stores/examStates";
import useUserState from "../../stores/userState";
import { useAppState } from "../../stores/appState";

export interface ISubjectTestProps {}

export default function SubjectTest(props: ISubjectTestProps) {
  const appState = useAppState();
  const examState = useExamState();
  const userState = useUserState();

  const [isEdit, setIsEdit] = React.useState(false);
  const [editInfo, setEditInfo] = React.useState("");
  const [searchVal, setSearchVal] = React.useState("");
  const [tests, setTests] = React.useState([]);
  const tableBodyRef = React.useRef<HTMLTableSectionElement | null>(null);

  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const loadTest = async () => {
    appState.setIsLoading(true);
    const fetchRes: any = await fetchData(
      "test/get?input=" +
        searchVal +
        "&subjectId=" +
        examState.subjectId +
        "&userId=" +
        userState.userId,
      "get"
    );
    appState.setIsLoading(false);
    setTests(fetchRes.data);
  };
  React.useEffect(() => {
    const times = setTimeout(() => {
      loadTest();
    }, 300);
    return () => clearTimeout(times);
  }, [searchVal]);
  return (
    <div className="table-wrap">
      <div className="table-content">
        <table border={1}>
          <thead className="sticky top-0 w-full">
            <tr className="thead-row">
              <th colSpan={10}>
                <div
                  className="flex items-center justify-between px-2 py-1 font-normal"
                  style={{ width: "75vw" }}
                >
                  <div className="flex items-center gap-1">
                    <input
                      id="check-box"
                      type="checkbox"
                      // onClick={handleCheckClick}
                      name="check-shot"
                      className="outline-none w-5 h-5"
                      placeholder="search..."
                    />
                    {" One line table "}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <input
                      type="text"
                      className="outline-none border-2 rounded-full px-3 py-1"
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Search..."
                    />
                  </div>
                </div>
              </th>
            </tr>
            <tr className="thead-row">
              {(getSession("permission") === "host" ||
                getSession("permission") === "deputy") && (
                <>
                  <th>ID</th>
                  <th>Options</th>
                </>
              )}
              <th>Code</th>
              <th>Name</th>
              <th>Question Number</th>
              <th>Description</th>
              <th>Updated at</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef} className="text-xs">
            {tests?.map((test: any, index) => {
              return (
                <SubjectTestItem
                  loadTest={loadTest}
                  setIsEdit={setIsEdit}
                  setEditInfo={setEditInfo}
                  key={test.id}
                  question={test}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="options-button">
        {(getSession("permission") === "host" ||
          getSession("permission") === "deputy") && (
          <div className="h-1/12 flex justify-center bottom-2 mb-1">
            <Button
              type="primary"
              size="large"
              onClick={() => setAddModalOpen(true)}
            >
              Add subject test
            </Button>
          </div>
        )}
      </div>
      <Modal
        open={addModalOpen || isEdit}
        onCancel={() => {
          setIsEdit(false);
          setAddModalOpen(false);
        }}
        width={1200}
        closable={false}
        footer={false}
      >
        <AddSubjectTestModal
          editInfo={editInfo}
          isEdit={isEdit}
          onCancel={() => {
            setIsEdit(false);
            setAddModalOpen(false);
          }}
          loadTest={loadTest}
        />
      </Modal>
    </div>
  );
}
