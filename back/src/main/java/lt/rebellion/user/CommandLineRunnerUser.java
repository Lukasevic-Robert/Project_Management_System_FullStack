package lt.rebellion.user;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.role.ERole;
import lt.rebellion.role.Role;
import lt.rebellion.role.RoleRepository;

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

		// CREATE ADMIN ===============================>
		Set<Role> rolesForAdmin = new HashSet<>();
		rolesForAdmin.add(roleRepository.findByName(ERole.ROLE_ADMIN).get());

		User admin = new User();
		admin.setFirstName("Admin");
		admin.setLastName("Adminovich");
		admin.setEmail("admin@mail.com");
		admin.setPassword(encoder.encode("Admin1"));
		admin.setRoles(rolesForAdmin);

		userRepository.save(admin);
		// =============================================/

		// CREATE USER ================================>
		Set<Role> rolesForUser = new HashSet<>();
		rolesForUser.add(roleRepository.findByName(ERole.ROLE_USER).get());

		User user = new User();
		user.setFirstName("User");
		user.setLastName("Userovich");
		user.setEmail("user@mail.com");
		user.setPassword(encoder.encode("User1"));
		user.setRoles(rolesForUser);

		userRepository.save(user);
		// =============================================/

		// CREATE MODERATOR ===========================>
		Set<Role> rolesForModerator = new HashSet<>();
		rolesForModerator.add(roleRepository.findByName(ERole.ROLE_MODERATOR).get());

		User moderator = new User();
		moderator.setFirstName("Moderator");
		moderator.setLastName("Moderatovich");
		moderator.setEmail("moderator@mail.com");
		moderator.setPassword(encoder.encode("Moderator1"));
		moderator.setRoles(rolesForModerator);

		userRepository.save(moderator);
		// =============================================/

		
		// CREATE MORE USERS ==========================>
		Map<String, String> userNames = Stream.of(new String[][] { { "Dedrick", "Kiehn" }, { "Toney", "Hessel" },
				{ "Isobel", "Veum" }, { "Margot", "Baumbach" }, { "Jettie", "Yost" }, { "Chanel", "Schumm" },
				{ "Audreanne", "Wisozk" }, { "Magali", "Zemlak" }, { "Nyah", "McKenzie" },
				{ "Rossie", "Heathcote" } }).collect(Collectors.toMap(data -> data[0], data -> data[1]));

		int i = 0;
		for (Map.Entry<String, String> entry : userNames.entrySet()) {
			i++;
			User dummy = new User();
			dummy.setFirstName(entry.getKey());
			dummy.setLastName(entry.getValue());
			dummy.setEmail("user" + i + "@mail.com");
			dummy.setPassword(encoder.encode("User1"));
			dummy.setRoles(rolesForUser);

			userRepository.save(dummy);
		}

	}
}
