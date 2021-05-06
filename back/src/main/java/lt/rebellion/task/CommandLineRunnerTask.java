package lt.rebellion.task;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.model.EPriority;
import lt.rebellion.model.EStatus;
import lt.rebellion.project.Project;
import lt.rebellion.project.ProjectRepository;
import lt.rebellion.project.ProjectService;

@Component
@Order(3)
@AllArgsConstructor
public class CommandLineRunnerTask implements CommandLineRunner {

	ProjectRepository projectRepository;
	TaskRepository taskRepository;
	private final ProjectService projectService;

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

//			if (i % 3 == 0) {
//				tasks.get(i).setStatus(EStatus.TODO);
//			}
			
			// changed code
			tasks.get(i).setProject(projectService.getProjectById((long)((i+10)/10)));
			if (i == 0 || i < tasks.size()/4) {
				tasks.get(i).setStatus(EStatus.TODO);
				
				if (i % 2 == 0) {
					tasks.get(i).setPriority(EPriority.HIGH);					
				}

			} else if (i >= tasks.size()/4 && i < tasks.size()/4*2) {
				tasks.get(i).setStatus(EStatus.IN_PROGRESS);
				if (i % 2 == 0) {
					tasks.get(i).setPriority(EPriority.LOW);
				}

			} else if (i >= tasks.size()/4*2 && i < tasks.size()/4*3) {
				tasks.get(i).setStatus(EStatus.DONE);
				if (i % 2 == 0) {
					tasks.get(i).setPriority(EPriority.MEDIUM);
				}
			}
			
			// end changed code

			tasks.get(i).setDescription(
					new ArrayList<String>(Arrays.asList("description 1" + " of task: " + tasks.get(i).getName(),
							"description 2" + " of task: " + tasks.get(i).getName(),
							"description 3" + " of task: " + tasks.get(i).getName())));
			taskRepository.save(tasks.get(i));
		}
	}
}
