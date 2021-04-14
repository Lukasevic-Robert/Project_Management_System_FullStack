package lt.rebellion.DTO;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {

	private String email;
	private String password;
	private Set<String> role;
}
