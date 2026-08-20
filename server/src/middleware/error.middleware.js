const errorHandler = (err, req, res, next) => {
  console.error("========== SERVER ERROR ==========");
  console.error("Message:", err.message);
  console.error("Name:", err.name);
  console.error("Code:", err.code);
  console.error("Stack:", err.stack);
  console.error("==================================");

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;