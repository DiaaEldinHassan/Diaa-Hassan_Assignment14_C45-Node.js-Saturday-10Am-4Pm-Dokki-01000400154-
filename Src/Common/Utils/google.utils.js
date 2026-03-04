import { UnauthorizedError } from '../../index.js';
import axios from 'axios';

export async function googleAuth(token) {
  try {
  
    const res = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    
    const { email, given_name, family_name, picture } = res.data;

    return { 
      email, 
      firstName: given_name, 
      lastName: family_name, 
      picture 
    };
  } catch (error) {
    console.error("Token verification failed:", error.response?.data || error.message);
    throw new UnauthorizedError("Google Authentication Error");
  }
}