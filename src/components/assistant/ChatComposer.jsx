import React from "react";
import { Send } from "lucide-react";
import { C } from "../../constants/theme";
import Input from "../common/Input";
import PrimaryBtn from "../common/PrimaryBtn";

export default function ChatComposer({ input, setInput, onSend }) {
  return (
    <div className="flex items-center gap-2 pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask about revenue, risk, team, marketing…"
      />
      <PrimaryBtn icon={Send} onClick={onSend}>Send</PrimaryBtn>
    </div>
  );
}
