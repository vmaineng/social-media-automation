import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../Shared/Button";

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

const PostForm = () => {
  const [inputActive, setInputActive] = useState(false);
  const [postText, setPostText] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);

    const formData = new FormData();
    formData.append("statusText", postText); // Changed to statusText
    if (image) {
      formData.append("image", image);
    }
    if (scheduledTime) {
      formData.append("scheduledTime", scheduledTime);
    }

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const data: CreatePostResponse = await response.json();
      if (data.success && data.postId) {
        setSubmissionSuccess(true);
        setPostText("");
        setImage(null);
        setScheduledTime("");
        setInputActive(false);
      } else {
        console.error("Failed to create post:", data.error);
        setSubmissionError(data.error || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Error submitting post:", error);
      setSubmissionError("Failed to submit post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-lightBg">
        <div className="max-w-2xl mx-auto p-4 bg-lightBg dark:bg-darkBg rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-lightBg text-darkBg">
            Dashboard
          </h1>
          <div className="border p-4 rounded-lg bg-light hover:bg-[#97d8c9] transition">
            <div
              className="text-lightBg text-darkBg cursor-text"
              tabIndex={0}
              onClick={() => setInputActive(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setInputActive(true);
                }
              }}
            >
              {!inputActive ? (
                <p className="text-lightBg text-darkBg cursor-text">
                  What&apos;s on your mind?
                </p>
              ) : (
                <textarea
                  className="w-full border p-2 rounded-md focus:outline-none bg-[#d8e194] text-lightBg text-darkBg"
                  rows={3}
                  value={postText}
                  onChange={handleTextChange}
                  placeholder="What's on your mind"
                  autoFocus
                />
              )}
            </div>
            {inputActive && (
              <div className="flex justify-end mt-2">
                <div>
                  <label
                    htmlFor="scheduledTime"
                    className="block text-sm font-medium text-lightBg text-darkBg"
                  >
                    Schedule:
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledTime"
                    value={scheduledTime}
                    onChange={handleScheduledTimeChange}
                  />
                </div>
                <Button type="submit" disabled={!postText.trim()}>
                  Submit
                </Button>
              </div>
            )}

            {submissionError && (
              <p className="text-red-500 mt-2">{submissionError}</p>
            )}
            {submissionSuccess && (
              <p className="text-green-500 mt-2">
                Post submitted successfully!
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
