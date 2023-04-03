import * as React from "react";

export interface IAddItemProps {}

export function AddItem(props: IAddItemProps) {
  return (
    <div
      className="add-question-item px-1 pt-1 pb-3 border-b-2 border-b-black text-sm"
      style={{ margin: "0 -8px" }}
    >
      <div className="flex items-center input-wrap gap-2">
        <select
          name="type"
          id="type"
          className="rounded border border-gray-400"
        >
          <option value="1">loc member</option>
          <option value="2">plus to 10</option>
          <option value="3">plus to 100</option>
          <option value="4">qq qq qq</option>
        </select>
        <select
          name="level"
          id="level"
          className="rounded border border-gray-400"
        >
          <option value="1">easy</option>
          <option value="2">normal</option>
          <option value="3">hard</option>
          <option value="4">extreme</option>
        </select>
        <input
          type="text"
          name="question"
          placeholder="enter question..."
          className="flex-1 border border-gray-400 px-2 rounded-lg"
        />
      </div>
      <div className="flex items-center input-wrap gap-2 pt-1">
        <input
          type="text"
          placeholder="correct anser..."
          className="px-1 border border-red-300 rounded-md w-1/4"
        />
        <input
          type="text"
          placeholder="other..."
          className="px-1 border rounded border-gray-400 w-1/4 "
        />
        <input
          type="text"
          placeholder="other..."
          className="px-1 border rounded border-gray-400 w-1/4"
        />
        <input
          type="text"
          placeholder="other..."
          className="px-1 border rounded border-gray-400 w-1/4"
        />
      </div>
      <input
        type="text"
        placeholder="explain question..."
        className="mt-2 w-full border border-gray-400 px-2 rounded-lg"
      />
    </div>
  );
}
