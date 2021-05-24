package lt.rebellion.user;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Page;
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
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import lombok.AllArgsConstructor;
import lt.rebellion.DTO.LoginRequest;
import lt.rebellion.DTO.MessageResponse;
import lt.rebellion.DTO.SignupRequest;
import lt.rebellion.exception.ApiError;
import lt.rebellion.exception.NotFoundException;

import lt.rebellion.journal.Activity;
import lt.rebellion.journal.Category;
import lt.rebellion.journal.JournalService;
import lt.rebellion.journal.Type;

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
	
	@Autowired
	private JournalService journalService;

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
	journalService.newJournalEntry(request.getEmail(), Type.ERROR, Category.USER, Activity.UNSUCCESSFUL_LOGIN,
					"User log in unsuccessful: invalid email/password combination");
			return new ResponseEntity<>("Invalid email/password combination", HttpStatus.FORBIDDEN);
		} catch (LockedException e) {
      	journalService.newJournalEntry(request.getEmail(), Type.ERROR, Category.USER, Activity.UNSUCCESSFUL_LOGIN,
					"User log in unsuccessful: user account is locked");
			return new ResponseEntity<>("User account is locked", HttpStatus.LOCKED);
		} catch (AuthenticationException e) {
      	journalService.newJournalEntry(request.getEmail(), Type.ERROR, Category.USER, Activity.UNSUCCESSFUL_LOGIN,
					"User log in unsuccessful: bad request");
			e.printStackTrace();
			return new ResponseEntity<>("Bad Request. Try again or contact Administrator", HttpStatus.FORBIDDEN);
		}
	}

	// Handles register request

	public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			journalService.newJournalEntry(signUpRequest.getEmail(), Type.ERROR, Category.USER, Activity.UNSUCCESSFUL_SIGNUP,
					"User sign up unsuccessful: email is already in use");
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
		journalService.newJournalEntry(signUpRequest.getEmail(), Type.INFO, Category.USER, Activity.SUCCESSFUL_SIGNUP,
				"User sign up successful");
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
		List<User> users = userRepository.findAllActivated();
		return users;
	}

	public Page<UserResponseDTO> getAllPaginatedUsers(Pageable pageable) {
		Page<UserResponseDTO> allUsers = userRepository.findAll(pageable).map(this::toUserResponseDTO);
		return allUsers;
	}

	public Page<UserResponseDTO> getPaginatedUsersByKeyword(Pageable pageable, String keyword) {
		Page<UserResponseDTO> allUsers = userRepository.findPaginatedUsersByKeyword(pageable, keyword.toUpperCase())
				.map(this::toUserResponseDTO);
		return allUsers;
	}

	public ResponseEntity<?> createUpdateUserById(Long id, UserRequestDTO userRequestDTO) {
		Set<Role> roles = new HashSet<>();
		Set<String> strRoles = userRequestDTO.getRoles();
		strRoles.forEach(role -> {
			switch (role) {
			case "ROLE_ADMIN":
				Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
						.orElseThrow(() -> new NotFoundException("Error: Role is not found."));
				roles.add(adminRole);

				break;
			case "ROLE_MODERATOR":
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
				User user = new User(userRequestDTO.getFirstName(), userRequestDTO.getLastName(),
						userRequestDTO.getEmail(), encoder.encode(userRequestDTO.getPassword()));
				user.setStatus(status);
				user.setRoles(roles);
				userRepository.save(user);
				return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
			}
		} else {

			User user = userRepository.findById(id).get();
			if (!user.equals(userRepository.findByEmail(userRequestDTO.getEmail()).get())) {
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
	
	public HttpServletResponse exportToCSV(HttpServletResponse response) throws IOException {

		response.setContentType("text/csv");
		
		List<User> users = userRepository.findAll();
		List<UserResponseDTO> usersDTO = users.stream().map(this::toUserResponseDTO)
				.collect(Collectors.toList());

		ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
		String[] csvHeader = { "User ID", "First Name", "Last Name", "Email", "Status", "Roles"};
		String[] nameMapping = { "id", "firstName", "lastName", "email", "status", "roles" };
		csvWriter.writeHeader(csvHeader);

		for (UserResponseDTO user : usersDTO) {
			csvWriter.write(user, nameMapping);
		}
		csvWriter.close();
		return response;
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
