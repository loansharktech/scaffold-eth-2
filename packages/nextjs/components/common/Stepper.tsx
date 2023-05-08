import { FunctionComponent } from "react";

const Stepper: FunctionComponent<{
  steps: {
    label: string;
    className: string;
  }[];
  active: number;
}> = ({ steps, active = 1 }) => {
  const currentIndex = Math.min(Math.max(1, active), steps.length);

  const total = steps.length;

  return (
    <div className="">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isLast = index === total - 1;
          const isActive = currentIndex > index;
          return [
            <div key={`dot-${index}`} className="relative">
              <div
                className={`w-4 h-4 rounded-full border-[3px]  flex-shrink-0 ${
                  isActive ? "border-[#039DED]" : "border-[#868A8D]"
                }`}
              ></div>
              <div className={`absolute top-6 whitespace-nowrap text-white ${step.className}`}>{step.label}</div>
            </div>,
            !isLast && (
              <div
                key={`line-${index}`}
                className={`h-[2px] bg-white flex-1 ${currentIndex > index + 1 ? "bg-[#039DED]" : ""}`}
              ></div>
            ),
          ];
        })}
      </div>
    </div>
  );
};

export default Stepper;
