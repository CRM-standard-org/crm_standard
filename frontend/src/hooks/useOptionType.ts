
import { OptionType } from "@/components/customs/select/select.main.component";

export type useResponseToOptionsFn = <T extends Record<string, any>>(
  data: T[],
  valueKey: keyof T,
  labelKey: keyof T | ((item: T) => string),
  setOptions?: (options: OptionType[]) => void
) => {
  responseObject: { id: string; name: string }[];
  options: OptionType[];
};


//สำหรับแปลงตัว option type ใน dropdown ทืีมีความเกี่ยวข้องกัน
export const useResponseToOptions: useResponseToOptionsFn = (
  data,
  valueKey,
  labelKey
) => {
  const raw = data.map((item) => ({
    id: String(item[valueKey]),
    name: typeof labelKey === "function" ? labelKey(item) : String(item[labelKey]),
  }));

  const options: OptionType[] = raw.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return {
    responseObject: raw,
    options,
  };
};

