// frontend/app/utils/api.ts

const API_BASE_URL = '/api'; // Or your specific API Gateway URL

interface CreatePostResponse {
  success: boolean;
  postId?: string;
  error?: string;
}

export async function createPost(postData: FormData): Promise<CreatePostResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: postData,
    });
    return await response.json();
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}

interface PostStatusResponse {
  success: boolean;
  status?: string;
  imageUrl?: string | null;
  error?: string;
}

export async function getPostStatus(postId: string): Promise<PostStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/status`);
    return await response.json();
  } catch (error: any) {
    console.error('Error fetching post status:', error);
    return { success: false, error: error.message };
  }
}