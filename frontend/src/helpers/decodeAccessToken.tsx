import jwt_decode from "jwt-decode";

export const decodeAccessToken = (accessToken: string): any => {
    try {
        const decodedToken: any = jwt_decode(accessToken);
        return decodedToken;
    } catch (error) {
        return null;
    }
};
