import { useState, useEffect } from "react";
import QRAuthFlow from "./QRAuthFlow";
import packageInfo from "../../package.json";

const AuthMethodSelector = ({ onSelect }) => {
  const [showQRFlow, setShowQRFlow] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [defaultButtonVisible, setDefaultButtonVisible] = useState(false);
  const [showDefaultButton, setShowDefaultButton] = useState(false);
  const [escapeKeyTimer, setEscapeKeyTimer] = useState(null);

  useEffect(() => {
    if (showDefaultButton) {
      setTimeout(() => setDefaultButtonVisible(true), 50);
    }
  }, [showDefaultButton]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !escapeKeyTimer) {
        const timer = setTimeout(() => {
          setShowDefaultButton(true);
        }, 2000);
        setEscapeKeyTimer(timer);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Escape" && escapeKeyTimer) {
        clearTimeout(escapeKeyTimer);
        setEscapeKeyTimer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (escapeKeyTimer) {
        clearTimeout(escapeKeyTimer);
      }
    };
  }, [escapeKeyTimer]);

  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("spotifyAuthType", "default");
    onSelect({ type: "default" });
  };

  const NocturneIcon = ({ className }) => (
    <svg
      width="457"
      height="452"
      viewBox="0 0 457 452"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        opacity="0.8"
        d="M337.506 24.9087C368.254 85.1957 385.594 153.463 385.594 225.78C385.594 298.098 368.254 366.366 337.506 426.654C408.686 387.945 457 312.505 457 225.781C457 139.057 408.686 63.6173 337.506 24.9087Z"
        fill="#CBCBCB"
      />
      <path
        d="M234.757 20.1171C224.421 5.47596 206.815 -2.40914 189.157 0.65516C81.708 19.3019 0 112.999 0 225.781C0 338.562 81.7075 432.259 189.156 450.906C206.814 453.97 224.42 446.085 234.756 431.444C275.797 373.304 299.906 302.358 299.906 225.78C299.906 149.203 275.797 78.2567 234.757 20.1171Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div className="bg-black h-screen flex items-center justify-center overflow-hidden fixed inset-0">
      <div className="w-full flex flex-col items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <NocturneIcon className="mx-auto h-14 w-auto" />
          <div
            className={`transition-all duration-250 ${
              buttonsVisible ? "h-[70px] opacity-100" : "h-0 opacity-0"
            }`}
          >
            <h2 className="mt-4 text-center text-[46px] font-[580] text-white tracking-tight">
              Welcome to Nocturne
            </h2>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <div
            className={`relative transition-all duration-250 ${
              showDefaultButton ? "h-[260px]" : "h-[150px]"
            }`}
          >
            <div
              className={`absolute top-0 left-0 w-full transition-opacity duration-250 ${
                buttonsVisible ? "opacity-100" : "opacity-0"
              } ${showDefaultButton ? "space-y-6 mt-2" : "mt-6"}`}
              style={{ pointerEvents: buttonsVisible ? "auto" : "none" }}
            >
              <div>
                <button
                  onClick={() => setShowQRFlow(true)}
                  className="flex w-full justify-center rounded-full bg-white/10 px-6 py-4 text-[32px] font-[560] text-white tracking-tight shadow-sm"
                >
                  Login with Phone
                </button>
              </div>
              <div
                className={`transition-all duration-250 overflow-hidden ${
                  showDefaultButton
                    ? defaultButtonVisible
                      ? "h-[80px] opacity-100"
                      : "h-0 opacity-0"
                    : "h-0 opacity-0"
                }`}
              >
                <button
                  onClick={handleDefaultSubmit}
                  className="flex w-full justify-center rounded-full ring-white/10 ring-2 ring-inset px-6 py-4 text-[32px] font-[560] text-white tracking-tight shadow-sm hover:bg-white/10 transition-colors"
                >
                  Use Developer Credentials
                </button>
              </div>
              <p className="mt-6 text-center text-white/30 text-[16px]">
                {packageInfo.version}
              </p>
            </div>
          </div>
          {showQRFlow && (
            <QRAuthFlow
              onBack={() => setShowQRFlow(false)}
              onComplete={onSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthMethodSelector;
