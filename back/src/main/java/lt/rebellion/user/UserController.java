package lt.rebellion.user;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@PreAuthorize("hasRole('ROLE_MODERATOR') or hasRole('ROLE_ADMIN')")
public class UserController {

	private final UserService userService;

	@ResponseStatus(HttpStatus.OK)
	@GetMapping
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/page")
	public Page<UserResponseDTO> getAllPaginatedUsers(Pageable pageable) {
		return userService.getAllPaginatedUsers(pageable);
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/pageFilter")
	public Page<UserResponseDTO> getPaginatedUsersByKeyword(Pageable pageable, @RequestParam String keyword) {
		return userService.getPaginatedUsersByKeyword(pageable, keyword);
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/{id}")
	public User getUserById(@PathVariable @Valid @NotBlank Long id) {
		return userService.getUserById(id);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.OK)
	@PutMapping("/{id}")
	public ResponseEntity<?> createUpdateUserById(@PathVariable @Valid @NotBlank Long id, @RequestBody UserRequestDTO userRequestDTO) {
		return userService.createUpdateUserById(id, userRequestDTO);
	}
	
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping("/{id}")
	public void deleteUserById(@PathVariable Long id) {
		userService.deleteUserById(id);
	}
	
}
