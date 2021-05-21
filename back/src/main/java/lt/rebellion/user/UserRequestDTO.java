package lt.rebellion.user;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String status;
	private Set<String> roles;
}
