import * as React from "react";
import { Button } from "./Button";

export interface IModalProps {
  isVisible: boolean;
  hide?: boolean;
  title?: string;
  setTitle?: boolean;
  okText?: string;
  cancelText?: string;
  onOK: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  customFooter?: React.ReactNode;
}

export function Modal({
  hide,
  isVisible,
  title,
  setTitle,
  okText,
  onOK,
  onCancel,
  cancelText,
  children,
  customFooter,
}: IModalProps) {
  if (isVisible)
    return (
      <div
        className={`${
          hide ? "opacity-0" : ""
        } flex flex-col justify-between border-2 border-gray-800 w-full h-full bg-white rounded-lg overflow-hidden`}
      >
        <div className="flex-1" style={{ maxHeight: "90%" }}>
          {(title || setTitle) && (
            <div className="modal-title border-b-2 border-primary text-2xl pb-1 text-center bg-primary text-white font-semibold">
              {title}
            </div>
          )}
          <div
            className="modal-content px-2 pb-1 flex-1 overflow-y-auto w-full"
            style={
              title ? { height: "calc( 100% - 40px )" } : { height: "100%" }
            }
          >
            {children}
          </div>
        </div>
        <div className="modal-option">
          <div className="flex items-center justify-end gap-4 justify-self-end pr-4 py-2 bg-gray-200">
            {customFooter || (
              <>
                <Button title={okText ? okText : "OK"} onClick={onOK} />
                <Button
                  title={cancelText ? cancelText : "Cancel"}
                  onClick={onCancel}
                  background="bg-red-600"
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  else return <></>;
}
