package lt.rebellion.user;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lt.rebellion.DTO.LoginRequest;
import lt.rebellion.DTO.MessageResponse;
import lt.rebellion.DTO.SignupRequest;
import lt.rebellion.exception.ApiError;
import lt.rebellion.exception.NotFoundException;
import lt.rebellion.role.ERole;
import lt.rebellion.role.Role;
import lt.rebellion.role.RoleRepository;
import lt.rebellion.security.JwtTokenProvider;
import lt.rebellion.service.UserDetailsImpl;


@Service
@AllArgsConstructor
public class UserService {
	
	
	private final AuthenticationManager authenticationManager;
	private JwtTokenProvider jwtTokenProvider;
	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private PasswordEncoder encoder;
	
	
	// Handles authenticate request

	public ResponseEntity<?> authenticate(LoginRequest request){
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));		
	
			String token = jwtTokenProvider.createToken(request.getEmail());
			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
			
			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());
			
			Map<String, Object> response = new HashMap<>();
			response.put("email", request.getEmail());
			response.put("token", token);
			response.put("roles", roles);
			return ResponseEntity.ok(response);
			
		} catch (AuthenticationException e) {
			return new ResponseEntity<>("Invalid email/password combination", HttpStatus.FORBIDDEN);
		}
	}
	
	
	
	// Handles register request

	public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new ApiError("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getEmail(), encoder.encode(signUpRequest.getPassword()));

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
				case "admin":
					Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
							.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
					roles.add(adminRole);

					break;
				case "mod":
					Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
							.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
					roles.add(modRole);

					break;
				default:
					Role userRole = roleRepository.findByName(ERole.ROLE_USER)
							.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
					roles.add(userRole);
				}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

	}
}
