import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../Shared/Button";
import { useNavigate } from "@remix-run/react";

interface CreatePostResponse {
  success: boolean;
  postId?: string;
  error?: string;
}

interface PostFormData {
  statusText: string;
  image: File | null;
  scheduledTime: string;
}

const Dashboard = () => {
  const [inputActive, setInputActive] = useState(false);
  const [postText, setPostText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!postText.trim()) return;
    console.log("Submitted Post:", postText);
    setPostText("");
    setInputActive(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleScheduledTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setScheduledTime(event.target.value);
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="max-w-2xl mx-auto p-4 bg-lightBg dark:bg-darkBg rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-lightBg text-darkBg">
          Dashboard
        </h1>
        <div className="border p-4 rounded-lg bg-light hover:bg-[#97d8c9] transition">
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
              className="w-full border p-2 rounded-md focus:outline-none bg-[#d8e194] text-lightBg text-darkBg"
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
