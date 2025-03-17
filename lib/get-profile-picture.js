import { BASE_URL } from "@/config/url";

// Function to get profile picture URL with cache busting
const getProfilePictureUrl = (url) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith("http")) return url;

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const baseUrl = `${BASE_URL}${url}`;
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}t=${timestamp}`;
};
export default getProfilePictureUrl;
