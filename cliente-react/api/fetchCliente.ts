const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL);

export async function fetchCliente<T>(
    endpoint:string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
        ...options
    });

    if(!response.ok){
        throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return await response.json();
}