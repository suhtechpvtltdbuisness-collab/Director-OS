import React, { useState } from "react";
import { Shield, BadgeCheck } from "lucide-react";
import { C, FONT_DISPLAY, FONT_BODY } from "../constants/theme";
import Panel from "../components/common/Panel";
import Field from "../components/common/Field";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import PrimaryBtn from "../components/common/PrimaryBtn";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("director@suhtech.top");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("director");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ background: C.bg, fontFamily: FONT_BODY }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="rounded-lg p-2" style={{ background: `${C.gold}22` }}>
            <Shield size={20} style={{ color: C.gold }} />
          </div>
          <div className="text-center">
            <div
              className="text-base font-semibold tracking-tight"
              style={{ color: C.text, fontFamily: FONT_DISPLAY }}
            >
              SUH Director OS
            </div>
            <div className="text-xs" style={{ color: C.muted }}>SUH TECH PRIVATE LIMITED</div>
          </div>
        </div>

        <Panel className="p-5">
          {step === 1 ? (
            <div className="flex flex-col gap-3">
              <Field label="Work email">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@suhtech.top"
                />
              </Field>
              <Field label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Sign in as">
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="director">Director — full access</option>
                  <option value="manager">Manager — view only</option>
                </Select>
              </Field>
              <PrimaryBtn onClick={() => setStep(2)}>Continue</PrimaryBtn>
              <p className="text-xs text-center" style={{ color: C.faint }}>
                Demo build — any credentials proceed to OTP step.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: C.muted }}>
                <BadgeCheck size={14} style={{ color: C.green }} />
                Two-factor verification sent to {email}
              </div>
              <Field label="Enter 6-digit code">
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
              </Field>
              <PrimaryBtn onClick={() => onLogin({ email, role })}>Verify & Sign in</PrimaryBtn>
              <button
                onClick={() => setStep(1)}
                className="text-xs"
                style={{ color: C.muted }}
              >
                Back
              </button>
            </div>
          )}
        </Panel>

        <p className="text-xs text-center mt-4" style={{ color: C.faint }}>
          Role-based access · Session encrypted · Audit logged
        </p>
      </div>
    </div>
  );
}
