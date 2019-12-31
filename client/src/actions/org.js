import { CREATE_ORG } from './types';
import axios from 'axios';

export const createOrg = orgName => {
    try {
        const res = await axios.post('/api/org', { orgName });
    } catch (error) {

    }
};