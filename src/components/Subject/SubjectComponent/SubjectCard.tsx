import * as React from "react";

export interface ISubjectCardProps {
  image?: string;
  name: string;
  info?: string;
}

export function SubjectCard({ image, name, info }: ISubjectCardProps) {
  return (
    <div>
      <div className="hover:scale-105 duration-300 h-40 rounded-lg overflow-hidden border-2 border-gray-300 drop-shadow cursor-pointer">
        <div className="flex items-center justify-center h-2/3 bg-slate-300">
          {image ? (
            <div
              className="h-full w-full bg-cover bg-no-repeat bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : (
            <div className="font-semibold text-xl text-gray-700 text-ellipsis whitespace-nowrap">
              {!image && name.slice(0, 10).toUpperCase()}
            </div>
          )}
        </div>
        <div className="px-2 py-0.5 flex items-center justify-center h-1/3">
          <p className="two-line-break">{name}</p>
        </div>
        <div></div>
      </div>
    </div>
  );
}
