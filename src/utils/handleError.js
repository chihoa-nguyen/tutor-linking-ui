import { toast } from "react-toastify";

const handleError = (error) => {
  if (error.response) {
    if (typeof error.response.data.message === "object") {
      for (const [key, value] of Object.entries(error.response.data.message)) {
        toast.error(`${value}`);
      }
    } else {
      toast.error(error.response.data.message);
    }
  } else if (error.request) {
    toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
  } else {
    toast.error(`Error message: ${error.message}`);
  }
};
export default handleError;
