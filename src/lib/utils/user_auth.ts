import { goto } from "$app/navigation";

export function userAuth() {
    try {
        // check Auth
        const token = localStorage.getItem("token");
        if (!token || token === 'null') {
            localStorage.removeItem('token');
            goto("/seamless");
            return;
        }

        // decode token
        const base64Url = token?.split(".")[1];
        const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64 || "")
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        const payloadToken = JSON.parse(jsonPayload);
        const tokenExp = payloadToken.exp;

        // check token expired
        const now = new Date();
        const exp = new Date(tokenExp * 1000);
        if (now > exp) {
            localStorage.removeItem("username");
            localStorage.removeItem("agent_name");
            localStorage.removeItem("token");
            goto("/seamless");
        }
    } catch (error) {
        console.error(error);
        goto("/seamless");
    }
}

export function userLogout() {
    localStorage.removeItem("username");
    localStorage.removeItem("agent_name");
    localStorage.removeItem("token");
    location.reload();
}