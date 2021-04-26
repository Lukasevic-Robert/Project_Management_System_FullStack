package lt.rebellion.project;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.role.ERole;
import lt.rebellion.role.Role;
import lt.rebellion.role.RoleRepository;
import lt.rebellion.user.User;
import lt.rebellion.user.UserRepository;

@Component
@Order(2)
@AllArgsConstructor
public class CommandLineRunnerProject implements CommandLineRunner {

	ProjectRepository projectRepository;
	UserRepository userRepository;
	RoleRepository roleRepository;

	@Override
	public void run(String... args) throws Exception {
		projectRepository.deleteAll();
		Role role = roleRepository.findByName(ERole.ROLE_USER).get();
		List<User> adminAndModerator = userRepository.findAll().stream()
				.filter(u -> !u.getRoles().contains(role))
				.collect(Collectors.toList());
		

		// Creating projects for Admin and Moderator
		for (int i = 1; i < 6; i++) {
			projectRepository.save(new Project("Project" + i, "Project " + i + " description", new HashSet<User>(Arrays.asList(adminAndModerator.get(0)))));
		}
		for (int i = 6; i < 11; i++) {
			projectRepository.save(new Project("Project" + i, "Project " + i + " description", new HashSet<User>(Arrays.asList(adminAndModerator.get(1)))));
		}
	}
}
