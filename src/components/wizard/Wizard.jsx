import { useState } from "react";
import Stepper from "../shared/Stepper";
import Step1Product from "./Step1Product";
import Step2Persona from "./Step2Persona";
import Step3Whitespace from "./Step3Whitespace";
import Step4Output from "./Step4Output";

const STEP_LABELS = ["Product Concept", "Persona", "Whitespace Map", "Output"];

const INITIAL_DATA = {
  step1: {
    product_name: "Sunrise Oat Protein Shake",
    category: "Functional Beverages",
    target_markets: ["India"],
    concept_description:
      "A ready-to-drink oat-based protein shake designed for time-starved working professionals who want a clean, no-prep breakfast that fits into a 20-minute morning routine.",
    positioning_angle: "Honest, fast, no-compromise morning protein.",
    consumer_needs: ["Convenience", "Sustainability", "Sports Performance"],
    competitors: [
      { name: "MuscleBlaze", claims: "High protein, gym-focused, mass brand" },
      { name: "Oziva", claims: "Plant-based, clean label, premium pricing" },
      { name: "Yoga Bar", claims: "Natural ingredients, indulgent taste" },
    ],
  },
  step2: {
    persona_name: "Priya M.",
    age_range: [28, 38],
    gender: ["Female"],
    location_type: "Metro",
    income_level: "Upper-Mid",
    occupation: ["Working Professional"],
    lifestyle_tags: ["Fitness Conscious", "Time-Starved", "Wellness-Driven"],
    purchase_behavior: "Research-heavy online buyer",
    media_channels: ["Instagram", "YouTube", "Podcasts"],
  },
};

export default function Wizard({ onExit, initialProject }) {
  const [step, setStep] = useState(initialProject ? 4 : 1);
  const [data, setData] = useState(INITIAL_DATA);

  const goTo = (s) => setStep(s);

  const setStep1 = (patch) => setData((d) => ({ ...d, step1: { ...d.step1, ...patch } }));
  const setStep2 = (patch) => setData((d) => ({ ...d, step2: { ...d.step2, ...patch } }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-text-secondary">
            {initialProject ? "Project" : "New Analysis"}
          </div>
          <h1 className="text-xl font-bold text-text-primary">
            {data.step1.product_name || "Untitled Concept"}
          </h1>
        </div>
        <button
          onClick={onExit}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          ← Exit to Dashboard
        </button>
      </div>

      <div className="bg-bg-surface border border-border-color rounded-xl p-4 mb-6">
        <Stepper steps={STEP_LABELS} current={step} onJump={goTo} />
      </div>

      <div key={step} className="animate-slide-right">
        {step === 1 && (
          <Step1Product data={data.step1} setData={setStep1} onNext={() => goTo(2)} />
        )}
        {step === 2 && (
          <Step2Persona data={data.step2} setData={setStep2} onNext={() => goTo(3)} />
        )}
        {step === 3 && <Step3Whitespace onNext={() => goTo(4)} />}
        {step === 4 && (
          <Step4Output
            onSave={() => {
              onExit();
            }}
            onNew={() => {
              setData(INITIAL_DATA);
              goTo(1);
            }}
            onBackToDashboard={onExit}
          />
        )}
      </div>
    </div>
  );
}
