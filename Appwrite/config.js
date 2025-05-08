import { Client, Databases, ID, Storage  , Query} from 'appwrite';
const appWriteConfig = {
    endPoint: 'https://fra.cloud.appwrite.io/v1',
    projectId: '67ff36e3001477f0a816',
    dataBaseId: '6802119e003e3150b2b2',
    bucketId: '680211c3002250e26e2c',
    userCollectionId : '680211e300199d051949',
    salaryCollectionId : '680218950012d2ee5078',
    expenseCollectionId : '68037ddb001c475006a1',
    basicCollectionId : '68038731002307da9d06',
    messagingTokenCollectionId: '680507280030a9772dd8'

};

class Service {
    constructor() {
        this.client = new Client()
            .setEndpoint(appWriteConfig.endPoint)
            .setProject(appWriteConfig.projectId);
        this.database = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    async createUser(name, email, user_id) {
        const data = {
            user_name: name,
            email: email,
            user_id: user_id
        };

        try {
            const response = await this.database.createDocument(
                appWriteConfig.dataBaseId, 
                appWriteConfig.userCollectionId,
                ID.unique(),
                data
            );
            return response;
        } catch (error) {
            throw error;
        }
    }


   async getUser(user_id) {
    try {
        const response = await this.database.listDocuments( 
            appWriteConfig.dataBaseId, 
            appWriteConfig.userCollectionId,
            [Query.equal('user_id', user_id)] 
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async StoreUserSalary (user_id, salary) {
    const data = {
        user_id: user_id,
        salary: salary
    };

    try {
        const response = await this.database.createDocument(
            appWriteConfig.dataBaseId, 
            appWriteConfig.salaryCollectionId,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async GetSalary (user_id) { 
    try {
        const response = await this.database.listDocuments( 
            appWriteConfig.dataBaseId, 
            appWriteConfig.salaryCollectionId,
            [Query.equal('user_id', user_id)] 
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async PostTodaysExpense(user_id, electricity, food, fuel, Miscellaneous, Recharge, Rent, reason) {
    const data = {
        user_id: user_id,
        fuel_expense: fuel,
        food_expense: food,
        miscellaneous_expense: Miscellaneous,
        electricity_expense: electricity,
        mobile_expense: Recharge,
        rent_expense: Rent,
        miscellaneous_reason: reason,
        rent_status: 'Paid',
        total : electricity + food + fuel + Miscellaneous + Recharge + Rent,
        date: new Date()
    };

    try {
        const response = await this.database.createDocument(
            appWriteConfig.dataBaseId, 
            appWriteConfig.expenseCollectionId,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async GetTodaysExpense(user_id) {
    try {
        const response = await this.database.listDocuments( 
            appWriteConfig.dataBaseId, 
            appWriteConfig.expenseCollectionId,
            [Query.equal('user_id', user_id)] 
        );
        return response;
    } catch (error) {
        throw error;
    }
}


async Post_basic(user_id, vehicle, vehicle_type, vehicle_milage, electricity_unit_rate) {
    const data = {
        user_id: user_id,
        vehicle: vehicle,
        vehicle_type: vehicle_type,
        vehicle_milage: vehicle_milage,
        electricity_unit_rate: electricity_unit_rate
    };

    try {
        const response = await this.database.createDocument(
            appWriteConfig.dataBaseId, 
            appWriteConfig.basicCollectionId,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        throw error;
    }
}


async GetBasic(user_id) {
    try {
        const response = await this.database.listDocuments( 
            appWriteConfig.dataBaseId, 
            appWriteConfig.basicCollectionId,
            [Query.equal('user_id', user_id)] 
        );
        return response;
    } catch (error) {
        throw error;
    }
}

async PostFCMToken(user_id, token) {
    const data = {
        user_id: user_id,
        fcm_token : token
    };

    try {
        const response = await this.database.createDocument(
            appWriteConfig.dataBaseId, 
            appWriteConfig.messagingTokenCollectionId,
            ID.unique(),
            data
        );
        return response;
    } catch (error) {
        throw error;
    }
}


async GetFCMToken(user_id) {
    try {
        const response = await this.database.listDocuments( 
            appWriteConfig.dataBaseId, 
            appWriteConfig.messagingTokenCollectionId,
            [Query.equal('user_id', user_id)] 
        );
        return response;
    } catch (error) {
        throw error;
    }
}


 async UpdateFCMToken(user_id, token, documentId) {
  const data = {
    user_id: user_id,
    fcm_token: token,
  };

  try {
    const response = await this.database.updateDocument(
      appWriteConfig.dataBaseId,
      appWriteConfig.messagingTokenCollectionId, // ⚠️ You had this in the wrong position too
      documentId,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
}






   
}

const service = new Service();

export default service;
