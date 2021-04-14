package lt.rebellion.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

import lombok.Getter;


@Getter
public class JwtAuthenticationException extends AuthenticationException{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1010399077050591879L;
	
	private HttpStatus httpstatus;

	public JwtAuthenticationException(String msg) {
		super(msg);
	}

	public JwtAuthenticationException(String msg, HttpStatus httpstatus) {
		super(msg);
		this.httpstatus = httpstatus;
	}	
}
