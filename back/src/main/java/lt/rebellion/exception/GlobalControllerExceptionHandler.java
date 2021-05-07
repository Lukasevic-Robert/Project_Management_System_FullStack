package lt.rebellion.exception;

import javax.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.extern.slf4j.Slf4j;


@ControllerAdvice
@Slf4j
public class GlobalControllerExceptionHandler {

	@ResponseStatus(HttpStatus.NOT_FOUND) // 404
	@ExceptionHandler(NotFoundException.class)
	public @ResponseBody ApiError handleNotFoundException(HttpServletRequest request, NotFoundException e) {
		return new ApiError(e.getMessage());
	}
	
	@ResponseStatus(HttpStatus.CONFLICT) // 409
	@ExceptionHandler(AlreadyExistsException.class)
	public @ResponseBody ApiError handleAlreadyExistsException(HttpServletRequest request, AlreadyExistsException e) {
		return new ApiError(e.getMessage());
	}
	
	@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) // 422
	@ExceptionHandler(UnprocessableEntityException.class)
	public @ResponseBody ApiError handleUnprocessableEntityException(HttpServletRequest request, UnprocessableEntityException e) {
		return new ApiError(e.getMessage());
	}
	
	@ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
	@ExceptionHandler(JwtAuthenticationException.class)
	public @ResponseBody ApiError handleJwtAuthenticationException(HttpServletRequest request, JwtAuthenticationException e) {
		return new ApiError(e.getMessage());
	}
	
	@ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
	@ExceptionHandler(NotAuthorizedException.class)
	public @ResponseBody ApiError handleNotAuthorizedException(HttpServletRequest request, NotAuthorizedException e) {
		return new ApiError(e.getMessage());
	}
	
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 500
	@ExceptionHandler(Exception.class)
	public @ResponseBody ApiError handleAllException(HttpServletRequest request, Exception e) {
		log.debug(e.getClass().getName());
		return new ApiError(e.getMessage());		
	}
}
