package lt.rebellion.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class UserDTO {

	private Long id;
	private String email;

	public String toString() {
		return String.format("ID: " + id + ", E-mail: " + email);
	}
}
