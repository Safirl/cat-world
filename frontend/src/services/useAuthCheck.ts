// useAuthCheck.ts
import { useNavigate } from 'react-router-dom';
/**
 * Redirect the user to the given route.
 */
const useAuthCheck = (redirectRoute: string, redirectMessage: string) => {
    const navigate = useNavigate();

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/status", {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                navigate(redirectRoute, { state: { message: redirectMessage } });
            }
        } catch (error) {
            console.error("Unexpected error: ", error)
        }
    };

    return checkAuthStatus;
};

const isUserAuth = async (): Promise<boolean> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/auth/status", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Unexpected error: ", error)
        return false;
    }
}

export { useAuthCheck, isUserAuth };
