const auth0Client = require('../../../utils/auth0Client');

const createPasswordChangeTicket = async (
  resultUrl = '',
  userId = '',
  newPassword = '',
  email = '',
) => {
  try {
    const createPasswordChangeTicketBody = {
      result_url: resultUrl,
      user_id: userId,
      email,
      new_password: newPassword,
      ttl_sec: 0,
    };
    const response = await auth0Client.post(
      '/tickets/password-change',
      createPasswordChangeTicketBody,
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

module.exports = createPasswordChangeTicket;
