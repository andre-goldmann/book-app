import { Client, Account} from 'appwrite';
import { environment } from '../environments/environment';

const client = new Client();

client
  .setEndpoint(environment.apiUrl)
  .setProject(environment.projectId);

export const account = new Account(client);
export { ID } from 'appwrite';
