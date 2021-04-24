package lt.rebellion.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.role.ERole;
import lt.rebellion.role.Role;
import lt.rebellion.role.RoleRepository;
import lt.rebellion.user.User;
import lt.rebellion.user.UserRepository;

@Component
@Order(1)
@AllArgsConstructor
public class CommandLineRunnerUser implements CommandLineRunner {

	UserRepository userRepository;
	BCryptPasswordEncoder encoder;
	RoleRepository roleRepository;

	@Override
	public void run(String... args) throws Exception {
		userRepository.deleteAll();
		roleRepository.deleteAll();
		roleRepository.save(new Role(ERole.ROLE_MODERATOR));
		roleRepository.save(new Role(ERole.ROLE_ADMIN));
		roleRepository.save(new Role(ERole.ROLE_USER));

		// CREATE ADMIN
		Set<Role> rolesForAdmin = new HashSet<>();
		rolesForAdmin.add(roleRepository.findByName(ERole.ROLE_ADMIN).get());

		User admin = new User();
		admin.setEmail("admin@mail.com");
		admin.setPassword(encoder.encode("Admin1"));
		admin.setRoles(rolesForAdmin);

		userRepository.save(admin);

		// CREATE USER
		Set<Role> rolesForUser = new HashSet<>();
		rolesForUser.add(roleRepository.findByName(ERole.ROLE_USER).get());

		User user = new User();
		user.setEmail("user@mail.com");
		user.setPassword(encoder.encode("User1"));
		user.setRoles(rolesForUser);

		userRepository.save(user);
	}
}
