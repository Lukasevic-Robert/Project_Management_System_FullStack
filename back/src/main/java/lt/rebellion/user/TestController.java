package lt.rebellion.user;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {

	@GetMapping("/all")
	public String getPublicContent() {
		return "Public Content";
	}

	@GetMapping("/api/v1/test/admin")
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public String getAdminContent() {
		return "Admin Content";
	}

	@GetMapping("/api/v1/test/user")
	@PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
	public String getUserContent() {
		return "User Content";
	}
}
