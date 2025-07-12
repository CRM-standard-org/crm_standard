import React, { useState } from "react";
import { LuPencil } from "react-icons/lu";
import Buttons from "../button/button.main.component";
import InputAction from "../input/input.main.component";

// ==== ประเภทข้อมูล ====
type RowType = {
  label: string;
  values: (string | number)[];
};

type HeaderConfig = {
  key: string;
  year: string;
  title: any;
  quartile: string[];
  months: string[];
};

type SalesForecastTableProps = {
  header: HeaderConfig;
  rows: RowType[];
};

function isGroupHeader(label: string): boolean {
  const lower = label.toLowerCase();
  return !lower.includes("ยอดขาย") &&
    !lower.includes("%") &&
    !lower.includes("ยอดต่างจากเป้าหมาย") &&
    !/\d/.test(lower);
}

const SalesForecastTable: React.FC<SalesForecastTableProps> = ({ header, rows }) => {
  const [editMode, setEditMode] = useState(false);
  const [editableRows, setEditableRows] = useState<RowType[]>([...rows]);

  const handleChange = (rowIndex: number, valueIndex: number, newValue: string) => {
    const updated = [...editableRows];
    const row = updated[rowIndex];
    const parsedValue = row.label.includes("%")
      ? parseFloat(newValue)
      : parseInt(newValue.replace(/,/g, ""), 10);
    row.values[valueIndex] = isNaN(parsedValue) ? 0 : parsedValue;
    setEditableRows(updated);
  };

  const colSpanPerQuarter = header.months.length / header.quartile.length;

  return (
    <div className="rounded-xl shadow-md mb-8 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{header.title}</h2>
        <Buttons
          btnType="default"
          variant="outline"
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2"
        >
          <LuPencil style={{ fontSize: "18px" }} />
          {editMode ? "บันทึก" : "ปรับ"}
        </Buttons>
      </div>

      <div className="overflow-x-auto relative">
        <table className="min-w-full table-fixed text-sm text-center border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th
                rowSpan={2}
                className="sticky left-0 z-[30] bg-blue-900 p-2 text-left border border-gray-300 w-[100px] min-w-[100px] max-w-[100px] sm:w-[200px] sm:min-w-[200px] sm:max-w-[200px]"
              >
                เป้าหมายยอดขาย
              </th>
              <th
                rowSpan={2}
                className="sticky left-[99px] z-[20] bg-blue-900 p-2 border border-gray-300 w-[90px] min-w-[90px] max-w-[90px] sm:left-[200px] sm:w-[160px] sm:min-w-[160px] sm:max-w-[160px]"
              >
                ทั้งปี {header.year}
              </th>
              {header.quartile.map((q, i) => (
                <th
                  key={i}
                  colSpan={colSpanPerQuarter}
                  className="p-2 border border-gray-300"
                >
                  {q}
                </th>
              ))}
            </tr>
            <tr className="bg-blue-900 text-white">
              {header.months.map((m, i) => (
                <th key={i} className="p-2 border border-gray-300 min-w-[100px]">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editableRows.map((row, rowIndex) => {
              const isHighlight = isGroupHeader(row.label);
              return (
                <tr
                  key={rowIndex}
                  className={
                    editMode
                      ? "bg-white"
                      : isHighlight
                        ? "bg-blue-100"
                        : "bg-white"
                  }
                >
                  {/* col แรก */}
                  <th
                    className="sticky left-0 z-20 bg-white p-2 text-left font-medium border border-gray-300 w-[100px] min-w-[100px] max-w-[100px] sm:w-[200px] sm:min-w-[200px] sm:max-w-[200px]"
                  >
                    <span className="block lg:hidden text-xs font-normal">{row.label}</span>
                    <span className="hidden lg:inline">
                      {editMode && isHighlight && (
                        <span className="mr-1 text-gray-500" title="สามารถแก้ไขได้">✏️</span>
                      )}
                      {row.label}
                    </span>
                  </th>
                  {/* col สอง */}
                  <td
                    className="sticky left-[99px] z-10 bg-white p-2 text-right border border-gray-300 w-[90px] min-w-[90px] max-w-[90px] sm:left-[200px] sm:w-[160px] sm:min-w-[160px] sm:max-w-[160px]"
                  >
                    <span className="text-xs lg:text-sm lg:font-normal">
                      {typeof row.values[0] === "number"
                        ? row.label.includes("%")
                          ? `${(row.values[0] as number).toFixed(2)}%`
                          : (row.values[0] as number).toLocaleString()
                        : row.values[0]}
                    </span>


                  </td>

                  {row.values.slice(1).map((value, valueIndex) => (
                    <td key={valueIndex} className="p-0 h-[35px] border border-gray-300">
                      {editMode && isHighlight ? (
                        <InputAction
                          placeholder=""
                          value={value.toString()}
                          onChange={(e) => handleChange(rowIndex, valueIndex + 1, e.target.value)}
                          classNameInput="w-full h-full border-none shadow-none rounded-none text-right px-2"
                        />
                      ) : (
                        <div className="p-2 text-right text-xs lg:text-sm lg:font-normal">
                          {typeof value === "number"
                            ? row.label.includes("%")
                              ? `${value.toFixed(2)}%`
                              : value.toLocaleString()
                            : value}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesForecastTable;