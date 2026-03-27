import {api} from '@/api/axiosConfig';
import type { LoginRequest } from './type';

export const authApi={
    login:(data:LoginRequest)=> api.post("/auth/login",data),
}