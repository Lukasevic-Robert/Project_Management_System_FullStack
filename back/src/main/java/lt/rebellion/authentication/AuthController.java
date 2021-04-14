package lt.rebellion.authentication;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lt.rebellion.DTO.LoginRequest;
import lt.rebellion.DTO.SignupRequest;
import lt.rebellion.user.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

	private UserService userService;
	
	public AuthController(lt.rebellion.user.UserService userService) {
		super();
		this.userService = userService;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@Valid @RequestBody LoginRequest request) {
		return userService.authenticate(request);
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		return userService.registerUser(signUpRequest);
	}
}
