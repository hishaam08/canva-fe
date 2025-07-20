import { useMutation, useQueryClient } from '@tanstack/react-query';

// Types
interface IdeogramInput {
  prompt: string;
  resolution?: string;
  style_type?: string;
  aspect_ratio?: string;
  magic_prompt_option?: string;
}

interface GenerateImageParams {
  input: IdeogramInput;
}

interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// API function that calls your .NET backend
const generateImage = async ({ input }: GenerateImageParams): Promise<GenerateImageResponse> => {
  const response = await fetch('http://localhost:5287/api/image/generate', { // Update with your .NET API URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate image');
  }

  return response.json();
};

// Custom hook
export const useGenerateImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: generateImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: (error) => {
      console.error('Error generating image:', error);
    },
  });
};