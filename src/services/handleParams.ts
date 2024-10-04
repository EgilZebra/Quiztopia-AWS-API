export const handleParams = async <T>( input: Object, requiredFields: (keyof T)[] ): Promise<T | string> => {

    try {
        
        const parsedBody = input as Object;
        for (const field of requiredFields) {
            if (!(field in parsedBody)) {
                return `Missing field: ${String(field)}`;
            }
        }
        return parsedBody as T;
    } catch (error) {
        return 'Failed to handle input';
    }
}