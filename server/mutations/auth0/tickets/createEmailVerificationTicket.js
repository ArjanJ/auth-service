const auth0Client = require('../../../utils/auth0Client');

const createEmailVerificationTicket = async (resultUrl = '', userId = '') => {
  try {
    const createEmailVerificationTicketBody = {
      result_url: resultUrl,
      user_id: userId,
      ttl_sec: 0,
    };
    const response = await auth0Client.post(
      '/tickets/email-verification',
      createEmailVerificationTicketBody,
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = createEmailVerificationTicket;
