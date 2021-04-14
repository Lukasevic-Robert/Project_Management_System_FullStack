package lt.rebellion.exception;

public class NotFoundException extends RuntimeException {

	private static final long serialVersionUID = -1900132001211608515L;

	public NotFoundException() {
		
	}

	public NotFoundException(String message) {
		super(message);
	}

	public NotFoundException(Throwable cause) {
		super(cause);
	}

	public NotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
