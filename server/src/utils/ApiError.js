class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.message = statusCode;
    this.success = false;
  }
}

export default ApiError;
