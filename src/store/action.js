import { LOGIN, SIGNOUT } from "./constants";

export const login = data => ({
    type: LOGIN,
    payload: {
        userId: data.userId
    }
});

export const signout = () => ({
    type: SIGNOUT,
    payload: {}
});
