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
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      Social Media Bot
      <h1 className="text-2xl font-bold mb-4"> Dashboard</h1>
      <div className="border p-4 rounded-lg hover:bg-gray-100 transition">
        {!inputActive ? (
          <p
            className="text-gray-500 cursor-text"
            onClick={() => setInputActive(true)}
          >
            Whwat's on your mind?
          </p>
        ) : (
          <textarea
            className="w-full border p-2 rounded-md focus:outline-none"
            rows={3}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Write something..."
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
  );
};

export default Dashboard;
