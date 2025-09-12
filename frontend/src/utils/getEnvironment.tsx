export const getEnvironment  = (): string => {
    if(import.meta.env.VITE_ENVIRONMENT == "Production")
        return import.meta.env.VITE_APP_BASE_URL
    return ""
};
