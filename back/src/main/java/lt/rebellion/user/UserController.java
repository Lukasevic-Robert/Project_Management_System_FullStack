package lt.rebellion.user;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;

	// GET all users =======================================================>
	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		return userService.getAllUsers();
	}

	// GET Paginated Users==================================================>
	@GetMapping("/page")
	public ResponseEntity<Page<UserResponseDTO>> getAllPaginatedUsers(Pageable pageable) {
		return userService.getAllPaginatedUsers(pageable);
	}

	// GET Paginated Users By Keyword ======================================>
	@GetMapping("/pageFilter")
	public ResponseEntity<Page<UserResponseDTO>> getPaginatedUsersByKeyword(Pageable pageable, @RequestParam String keyword) {
		return userService.getPaginatedUsersByKeyword(pageable, keyword);
	}

	// GET User By Id ======================================================>
	@GetMapping("/{id}")
	public ResponseEntity<User> getResponseUserById(@PathVariable Long id) {
		return userService.getResponseUserById(id);
	}

}
