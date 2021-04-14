package lt.rebellion.exception;

public class AlreadyExistsException extends RuntimeException{
	
	private static final long serialVersionUID = -4103529100742948707L;

	public AlreadyExistsException() {
	}

	public AlreadyExistsException(String message) {
		super(message);
	}
	
	public AlreadyExistsException(Throwable cause) {
		super(cause);
	}

	public AlreadyExistsException(String message, Throwable cause) {
		super(message, cause);
	}
}
