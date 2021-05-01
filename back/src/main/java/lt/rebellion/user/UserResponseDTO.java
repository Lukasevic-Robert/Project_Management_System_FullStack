package lt.rebellion.user;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lt.rebellion.role.Role;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private Set<Role> roles;
}
