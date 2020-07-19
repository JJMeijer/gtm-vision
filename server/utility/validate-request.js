// Validate Request Query
export const validateRequest = (req, element, values) => {
  values.forEach((key) => {
    if (!(req[element][key] && typeof req[element][key] === 'string')) {
      const err = new Error('Invalid request');
      err.status = 400;
      throw err;
    }
  });
};

export default validateRequest;
