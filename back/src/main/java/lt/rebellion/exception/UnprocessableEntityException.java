package lt.rebellion.exception;

public class UnprocessableEntityException extends RuntimeException {
	
	private static final long serialVersionUID = 2527266068667622074L;

	public UnprocessableEntityException() {

	}
	
	public UnprocessableEntityException(String message) {
		super(message);
	}
	
	public UnprocessableEntityException(Throwable cause) {
		super(cause);
	}

	public UnprocessableEntityException(String message, Throwable cause) {
		super(message, cause);
	}
}
