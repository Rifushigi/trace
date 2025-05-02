class MLServiceError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ValidationError(MLServiceError):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class NotFoundError(MLServiceError):
    def __init__(self, message: str):
        super().__init__(message, status_code=404)


class ConflictError(MLServiceError):
    def __init__(self, message: str):
        super().__init__(message, status_code=409)


class DatabaseError(MLServiceError):
    def __init__(self, message: str):
        super().__init__(message, status_code=500)
