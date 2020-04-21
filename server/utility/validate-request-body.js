// Validate Request Function
const validateRequestBody = (req, values) => {
  values.forEach((key) => {
    if (!(req.body[key] && typeof req.body[key] === 'string')) {
      const err = new Error('Invalid request body');
      err.status = 400;
      throw err;
    }
  });
};

export default validateRequestBody;
