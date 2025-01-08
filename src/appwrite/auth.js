import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({email, password, name}) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password,name);
      if (userAccount) {
        return this.login(email, password);
      } else {
        return userAccount ;
      }
    } catch (error) {
      console.error("Appwrite/auth.js :: createAccount :: error ", error);
      throw error; 
    }
  }

  async login({email, password}) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Appwrite/auth.js :: login :: error ", error);
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
      // Logged in
    } catch (error) {
      // Not logged in
      console.error("Appwrite/auth.js:: getCurrentUser :: error ", error);
      throw error;
    }
    // return null
  }

  async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite/auth.js :: logout :: error ", error);
        }
  }

}

const authService = new AuthService();

export default authService;
