package lt.rebellion.user;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lt.rebellion.DTO.LoginRequest;
import lt.rebellion.DTO.MessageResponse;
import lt.rebellion.DTO.SignupRequest;
import lt.rebellion.exception.ApiError;
import lt.rebellion.exception.NotFoundException;
import lt.rebellion.model.EStatus;
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

	public ResponseEntity<?> authenticate(LoginRequest request) {
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

			String token = jwtTokenProvider.createToken(request.getEmail());
			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

			List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
					.collect(Collectors.toList());

			Map<String, Object> response = new HashMap<>();
			response.put("id", userDetails.getId());
			response.put("email", request.getEmail());
			response.put("token", token);
			response.put("roles", roles);
			return ResponseEntity.ok(response);

		} catch (BadCredentialsException e) {
			return new ResponseEntity<>("Invalid email/password combination", HttpStatus.FORBIDDEN);
		} catch (LockedException e) {
			return new ResponseEntity<>("User account is locked", HttpStatus.LOCKED);
		} catch (AuthenticationException e) {
			e.printStackTrace();
			return new ResponseEntity<>("Bad Request. Try again or contact Administrator", HttpStatus.FORBIDDEN);
		}
	}

	// Handles register request

	public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new ApiError("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getFirstName(), signUpRequest.getLastName(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()));

		Set<Role> roles = new HashSet<>();
		Role userRole = roleRepository.findByName(ERole.ROLE_USER)
				.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
		roles.add(userRole);
		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

	}

	public User getCurrentUser() {

		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = "";
		if (principal instanceof UserDetails) {
			username = ((UserDetails) principal).getUsername();
		}
		if (username.isBlank()) {
			throw new NotFoundException("Current User Not Found");
		}
		return userRepository.findByEmail(username).get();
	}

	public String getCurrentUserEmail() {
		return getCurrentUser().getEmail();
	}

	public Long getCurrentUserId() {
		return getCurrentUser().getId();
	}

	public List<User> getAllUsers() {
		List<User> users = userRepository.findAll();
		return users;
	}

	public Page<UserResponseDTO> getAllPaginatedUsers(Pageable pageable) {

		Page<User> allUsers = userRepository.findAll(pageable);
		List<UserResponseDTO> allUsersDTOs = allUsers.stream().map(u -> toUserResponseDTO(u))
				.collect(Collectors.toList());
		Page<UserResponseDTO> backToPage = new PageImpl<UserResponseDTO>(allUsersDTOs, pageable,
				allUsers.getTotalElements());

		return backToPage;
	}

	public Page<UserResponseDTO> getPaginatedUsersByKeyword(Pageable pageable, String keyword) {

		Page<User> allUsers = userRepository.findPaginatedUsersByKeyword(pageable, keyword);
		List<UserResponseDTO> allUsersDTOs = allUsers.stream().map(u -> toUserResponseDTO(u))
				.collect(Collectors.toList());
		Page<UserResponseDTO> backToPage = new PageImpl<UserResponseDTO>(allUsersDTOs, pageable,
				allUsers.getTotalElements());

		return backToPage;
	}

	public ResponseEntity<?> createUpdateUserById(Long id, UserRequestDTO userRequestDTO) {
		Set<Role> roles = new HashSet<>();
		Set<String> strRoles = userRequestDTO.getRoles();
		strRoles.forEach(role -> {
			switch (role) {
			case "ADMIN":
				Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
						.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
				roles.add(adminRole);

				break;
			case "MODERATOR":
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

		if (!userRepository.existsById(id)) {
			if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
				return ResponseEntity.badRequest().body(new ApiError("Error: Email is already in use!"));
			} else {
				EStatus status = EStatus.valueOf(userRequestDTO.getStatus());
				User user = new User(userRequestDTO.getFirstName(),
						userRequestDTO.getLastName(),
						userRequestDTO.getEmail(),
						encoder.encode(userRequestDTO.getPassword()));
				user.setStatus(status);
				user.setRoles(roles);
				userRepository.save(user);
				return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
			}
		} else {
			
			User user = userRepository.findById(id).get();
			if(!user.equals(userRepository.findByEmail(userRequestDTO.getEmail()).get())) {
				return ResponseEntity.badRequest().body(new ApiError("Error: Email is already in use!"));
			}
			user.setFirstName(userRequestDTO.getFirstName());
			user.setLastName(userRequestDTO.getLastName());
			user.setEmail(userRequestDTO.getEmail());
//			user.setPassword(encoder.encode(userRequestDTO.getPassword()));
			user.setStatus(EStatus.valueOf(userRequestDTO.getStatus()));
			user.setRoles(roles);
			userRepository.save(user);
			return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
		}
	}
	
	public void deleteUserById(Long id) {
		validateUserId(id);
		userRepository.deleteById(id);
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User Not Found"));
	}

	public UserDTO userToDTO(User user) {
		return new UserDTO(user.getId(), user.getEmail());
	}

	public UserResponseDTO toUserResponseDTO(User user) {
		UserResponseDTO userResponseDTO = new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(),
				user.getEmail(), user.getStatus().name(), user.getRoles());
		return userResponseDTO;
	}
	
	public boolean validateUserId(Long id) {
		userRepository.findById(id).orElseThrow(() -> new NotFoundException("User Not Found"));
		return true;
	}
}
