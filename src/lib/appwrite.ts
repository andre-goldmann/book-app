import { Client, Account} from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66f822a90035ffda3208');

export const account = new Account(client);
export { ID } from 'appwrite';
