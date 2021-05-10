package lt.rebellion.task;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.model.EStatus;
import lt.rebellion.project.Project;
import lt.rebellion.project.ProjectRepository;

@Component
@Order(3)
@AllArgsConstructor
public class CommandLineRunnerTask implements CommandLineRunner {

	ProjectRepository projectRepository;
	TaskRepository taskRepository;

	@Override
	public void run(String... args) throws Exception {
		List<Project> projects = projectRepository.findAll();

		for (int i = 0; i < projects.size(); i++) {
			for (int j = 0; j < projects.size(); j++) {
				taskRepository.save(new Task("Task" + j, projects.get(i)));
			}
		}
		List<Task> tasks = taskRepository.findAll();
		for (int i = 0; i < tasks.size(); i++) {
			
			if (i % 3 == 0) {
				tasks.get(i).setStatus(EStatus.TODO);
			}

			tasks.get(i).setDescription(
					"description 1" + " of task: " + tasks.get(i).getName() + "\n" + 
							"description 2" + " of task: " + tasks.get(i).getName() + "\n" +
							"description 3" + " of task: " + tasks.get(i).getName());
			taskRepository.save(tasks.get(i));
		}
	}
}
