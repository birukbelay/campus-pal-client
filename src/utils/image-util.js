import {message, Upload} from "antd";

export const isJpgOrPng = (file) => {
    return (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
    );
};
export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export function beforeUpload(file) {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng(file)) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
        message.error('Image must smaller than 5MB!');
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
}


// const beforeUpload = (file) => {
//   if (!isJpgOrPng(file)) {
//     message.error("Book cover can only be JPG/PNG file!");
//   }
//   return false;
// };

