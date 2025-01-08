import conf from "../conf/conf";
import { Client,ID,Databases,Query,Storage } from "appwrite";

export class Service{
  
    client = new Client();
    databases;
    storage;

    constructor(){
        this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
      this.databases=new Databases(this.client)
      this.storage=new Storage(this.client)
    }

    async createPost({title,slug, content,featuredImage,status,userId}){
          try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {title,
                 content,
                 featuredImage,
                 status,
                 userId
                 }
            );
          } catch (error) {
            console.error("Appwrite/config.js :: createPost :: error ", error);
          }
    }

     async updatePost(slug,{title, content,featuredImage,status}){
        try {
           return await this.databases.updateDocument(
                conf.appwriteDatabaseId, // databaseId
                conf.appwriteCollectionId, // collectionId
                slug, // documentId
                {
                    title,
                    content,
                    featuredImage,
                    status
                }, // data (optional)
                // ["read("any")"] // permissions (optional)
            );
        } catch (error) {
            console.error("Appwrite/config.js :: updatePost :: error ", error);
          }
    }
     
    async deletePost(slug){
            try {
                 await this.databases.deleteDocument(
                    conf.appwriteDatabaseId, // databaseId
                    conf.appwriteCollectionId, // collectionId
                    slug // documentId
                );
                return true
            } catch (error) {
                console.error("Appwrite/config.js :: deletePost :: error ", error);
                return false
            }
    }

    async getPost(slug){
        try {
          return await this.databases.getDocument(
            conf.appwriteDatabaseId, // databaseId
            conf.appwriteCollectionId, // collectionId
            slug, // documentId
            // [] // queries (optional)
        );
        
        } catch (error) {
            console.error("Appwrite/config.js :: getPost :: error ", error);
                return false
        }
    }

    async getPosts(queries){
          try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
          } catch (error) {
            console.error("Appwrite/config.js :: getPosts :: error ", error);
                return false
          }
    }

    async uploadFile(file){
      try {
       return await this.storage.createFile(
            conf.appwriteBucketId,
            ID.unique(),
            file
        );
      } catch (error) {
        console.error("Appwrite/config.js :: uploadFile :: error ", error);
                return false
      }
    }

    async deleteFile(fileId){
        try {
          await this.storage.deleteFile(
            conf.appwriteBucketId, // bucketId
            fileId // fileId
        )
           return true

        } catch (error) {
          console.error("Appwrite/config.js :: deleteFile :: error ", error);
                  return false
        }
      }

      async getFilePreview(fileId){
        try {
         const url= await this.storage.getFileView(
            conf.appwriteBucketId, // bucketId
            fileId // fileId
         );
         return url
        } catch (error) {
          console.error("Appwrite/config.js :: getFilePreview :: error ", error);
                  return false
        }
      }

}

const service = new Service();

export default service