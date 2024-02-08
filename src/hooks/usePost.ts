import axios from "axios";


export function usePost<T>(url: string, body: T) {
    return axios.post(url, body)
}