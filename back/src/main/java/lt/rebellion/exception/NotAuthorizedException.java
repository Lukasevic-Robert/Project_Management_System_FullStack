package lt.rebellion.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

public class NotAuthorizedException extends HttpClientErrorException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6373192216295778634L;

	public NotAuthorizedException(HttpStatus statusCode, String statusText) {
		super(statusCode, statusText);


	}

}
