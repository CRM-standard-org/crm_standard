import React, { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState, useRef } from "react";
import { TextArea as RadixTextArea, Button } from "@radix-ui/themes";
import { Mic, MicOff } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface TextAreaProps {
  onAction?: () => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  value: string;
  labelOrientation?: "horizontal" | "vertical";
  defaultValue?: string;
  id?: string;
  nextFields?: { left?: string; right?: string; up?: string; down?: string };
  className?: string;
  classNameInput?: string;
  classNameLabel?: string;
  require?: string;
  isError?: boolean;
  disabled?: boolean;
  maxLength?: number;
  errorMessage?: string;
  rows?: number;
  onMicrophone?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  onAction,
  onChange,
  placeholder = "Enter text...",
  label = "",
  labelOrientation = "vertical",
  value = "",
  defaultValue = "",
  id = "",
  nextFields = {},
  className = "",
  classNameInput = "",
  classNameLabel = "",
  require = "",
  isError,
  disabled = false,
  maxLength,
  errorMessage,
  rows = 4,
  onMicrophone,
}) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [language, setLanguage] = useState<"th-TH" | "en-US">("th-TH");
  const lastTranscript = useRef("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isError && textAreaRef.current) {
      textAreaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      textAreaRef.current.focus();
    }
  }, [isError]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const keycode = e.key;
    const nextFieldId =
      keycode === "ArrowUp"
        ? nextFields.up
        : keycode === "ArrowDown"
          ? nextFields.down
          : keycode === "ArrowLeft"
            ? nextFields.left
            : keycode === "ArrowRight"
              ? nextFields.right
              : null;

    if (keycode === "Enter" && onAction) {
      e.preventDefault();
      onAction();
    } else if (nextFieldId) {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        (nextField as HTMLInputElement).focus();
        (nextField as HTMLInputElement).select();
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language,
      });
    }
  };

  // เติมคำที่พูดเข้าไปใน TextArea
  useEffect(() => {
    if (transcript && onChange) {
      const newText = transcript.replace(lastTranscript.current, "").trim();
      if (newText) {
        const text = {
          target: { value: value + (value ? " " : "") + newText },
        } as ChangeEvent<HTMLTextAreaElement>;
        onChange(text);
      }
      lastTranscript.current = transcript; // เก็บไว้ใช้เทียบรอบหน้า
    }
  }, [transcript]);

  return (
    <div
      className={`${className || ""}  flex flex-col sm:flex-row items-start sm:items-center gap-2`}
    >
      {label && (
        <label htmlFor={id} className={classNameLabel || ""}>
          {label}
          {require && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-col gap-2 w-full">
        {/* กล่อง TextArea แบบไม่ล้น */}
        <div className="flex-1 min-w-0">
          <RadixTextArea
            ref={textAreaRef}
            className={`${classNameInput} w-full ${isError ? "ring-2 ring-red-500 animate-shake" : ""}`}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            id={id}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
          />
        </div>

        {onMicrophone && (
          <div className="flex flex-col items-end gap-1">
            <Button
              type="button"
              onClick={toggleListening}
              size="1"
              variant={listening ? "soft" : "outline"}
              color={listening ? "red" : "gray"}
              highContrast
              title={listening ? "กำลังฟัง..." : "เริ่มพูด"}
              className="rounded-full"
            >
              {listening ? <Mic size={15} /> : <MicOff size={15} />}
            </Button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "th-TH" | "en-US")}
              className="text-xs border rounded"
            >
              <option value="th-TH">ไทย</option>
              <option value="en-US">English</option>
            </select>
          </div>
        )}
      </div>


      {errorMessage && (
        <div className="text-red-600 pt-1 text-sm">{errorMessage}</div>
      )}
    </div>

  );
};

export default TextArea;
