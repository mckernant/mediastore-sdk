import { getData } from 'util/appConfigHelper';
import fetchWithJWT from 'util/fetchHelper';

const getCustomerSubscriptions = async () => {
  const customerId = getData('CLEENG_CUSTOMER_ID') || '';

  const url = `${ENVIRONMENT_CONFIGURATION.API_URL}/customers/${customerId}/subscriptions`;
  return fetchWithJWT(url, {
    method: 'GET'
  }).then(res => {
    return res.json();
  });
};

export default getCustomerSubscriptions;
