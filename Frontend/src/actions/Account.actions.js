import axios from "axios";

const backend_URI = "http://localhost:5000"

const baseApiResponse = (data, isSuccess) => {
  return {
    success: isSuccess,
    data: data || null,
  };
};


// login
export const loginAccount = async (input) => {
  try {
    const response = await axios.post(
      `${backend_URI}/login`, input
    );

    console.log("Response from Backend");
    console.log(response.data);
    return baseApiResponse(response.data, true);
  } catch (error) {
    console.error(error);
    return baseApiResponse(null, false);
  }
};


// register
export const registerAccount = async (input) => {
  try {
    const response = await axios.post(
      `${backend_URI}/register`, input
    );

    console.log("Response from Backend");
    console.log(response.data);
    return baseApiResponse(response.data.results, true);
  } catch (error) {
    console.error(error);
    return baseApiResponse(null, false);
  }
};