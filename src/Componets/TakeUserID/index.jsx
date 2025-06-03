import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

export const TakeUserID = () => {
    const user = useSelector((state) => state.user);


    const user_id = jwtDecode(user.token).id;
    const userName = user.fullName;

    const data = {
        user_id: user_id,
        userName: userName,
    };
    return data;
};
