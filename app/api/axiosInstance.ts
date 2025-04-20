import instance from "axios"
import { NextRequest } from "next/server";

export const axios = instance.create({
    baseURL: "http://localhost:3000/api",
    transformResponse: [(data) => {
        if (!data) return data; 
        try {
            return JSON.parse(data, (key, value) => {
                if (key.endsWith("At")) {
                    return new Date(value);
                }
                return value;
            });
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return data; 
        }
    }],
    headers:{
        "Content-Type": "application/json"
    }
})

