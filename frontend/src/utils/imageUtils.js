/**
 * Utility function to get the full image URL correctly.
 * @param {string} imagePath - The image path from the database (e.g., "/images/iphone15.jpg")
 * @returns {string} The full image URL.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.png";
  
  // If the path is already an absolute URL, return it as is.
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Use the environment variable, or fallback to localhost
  let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Remove any trailing slashes from the base URL
  baseUrl = baseUrl.replace(/\/+$/, "");

  // Remove any leading slashes from the image path
  let path = imagePath.replace(/^\/+/, "");

  // Check if the baseUrl unexpectedly includes /api. If so, remove it for images since images are typically served from the root.
  if (baseUrl.endsWith("/api")) {
    baseUrl = baseUrl.slice(0, -4);
  }

  return `${baseUrl}/${path}`;
};
