import { API_URL } from "@/config/url";

/**
 * Make an authenticated API request with automatic token refresh capability
 * @param {string} endpoint - API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {Function} refreshTokenFn - Function to refresh the access token
 * @returns {Promise<Object>} - API response data
 */
export const apiRequest = async (endpoint, options = {}, refreshTokenFn) => {
    // Get the current access token
    const accessToken = localStorage.getItem("accessToken");

    // Set up headers with authentication if token exists
    let headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Make the API request
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 Unauthorized errors (expired token)
        if (response.status === 401 && refreshTokenFn) {
            try {
                // Try to refresh the token
                const newToken = await refreshTokenFn();

                // Update headers with new token
                headers["Authorization"] = `Bearer ${newToken}`;

                // Retry the request with the new token
                const retryResponse = await fetch(`${API_URL}${endpoint}`, {
                    ...options,
                    headers,
                });

                return processResponse(retryResponse);
            } catch (refreshError) {
                // If token refresh fails, propagate the error
                throw new Error("Session expired. Please login again.");
            }
        }

        return processResponse(response);
    } catch (error) {
        console.error("API request error:", error);
        throw error;
    }
};

/**
 * Process the API response
 * @param {Response} response - Fetch Response object
 * @returns {Promise<Object>} - Processed response data
 */
const processResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @param {Function} refreshTokenFn - Function to refresh the token
 * @returns {Promise<Object>} - API response
 */
export const get = (endpoint, options = {}, refreshTokenFn) => {
    return apiRequest(endpoint, { ...options, method: "GET" }, refreshTokenFn);
};

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @param {Function} refreshTokenFn - Function to refresh the token
 * @returns {Promise<Object>} - API response
 */
export const post = (endpoint, data, options = {}, refreshTokenFn) => {
    return apiRequest(
        endpoint,
        {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        },
        refreshTokenFn
    );
};

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @param {Function} refreshTokenFn - Function to refresh the token
 * @returns {Promise<Object>} - API response
 */
export const put = (endpoint, data, options = {}, refreshTokenFn) => {
    return apiRequest(
        endpoint,
        {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        },
        refreshTokenFn
    );
};

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @param {Function} refreshTokenFn - Function to refresh the token
 * @returns {Promise<Object>} - API response
 */
export const del = (endpoint, options = {}, refreshTokenFn) => {
    return apiRequest(
        endpoint,
        { ...options, method: "DELETE" },
        refreshTokenFn
    );
};
