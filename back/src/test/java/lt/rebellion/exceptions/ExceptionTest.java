package lt.rebellion.exceptions;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import lt.rebellion.exception.AlreadyExistsException;

public class ExceptionTest {
	AlreadyExistsException alreadyExistsException = new AlreadyExistsException();

	@Disabled
	@Test
	void throwsAlreadyExistsException() throws AlreadyExistsException {

	}

	@Test
	void bandom() {
		Assertions.assertThrows(AlreadyExistsException.class, () -> {
			Integer.parseInt("One");
		});
	}

}
