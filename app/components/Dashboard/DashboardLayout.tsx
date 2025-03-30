import { useState } from "react";
import { Button } from "../Shared/Button";

const Dashboard = () => {
  const [inputActive, setInputActive] = useState(false);
  const [postText, setPostText] = useState("");

  const handleSubmit = () => {
    if (!postText.trim()) return;
    console.log("Submitted Post:", postText);
    setPostText("");
    setInputActive(false);
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="max-w-2xl mx-auto p-4 bg-lightBg dark:bg-darkBg rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-lightBg text-darkBg">
          Dashboard
        </h1>
        <div className="border p-4 rounded-lg bg-[#d8e194] hover:bg-[#97d8c9] transition">
          {!inputActive ? (
            <p
              className="text-lightBg text-darkBg cursor-text"
              role="button"
              tabIndex={0}
              onClick={() => setInputActive(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setInputActive(true);
                }
              }}
            >
              What&apos;s on your mind?
            </p>
          ) : (
            <textarea
              className="w-full border p-2 rounded-md focus:outline-none bg-white text-black"
              rows={3}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind"
            />
          )}
        </div>
        {inputActive && (
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmit} disabled={!postText.trim()}>
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
