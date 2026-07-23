class ResponseFormatter {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }

  static error(message, code = 500) {
    return {
      success: false,
      error: message,
      code
    };
  }

  static paginate(data, page, limit, total) {
    return {
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = ResponseFormatter;