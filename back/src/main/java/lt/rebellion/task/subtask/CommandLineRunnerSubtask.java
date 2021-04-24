package lt.rebellion.task.subtask;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lt.rebellion.task.Task;
import lt.rebellion.task.TaskRepository;

@Component
@Order(4)
@AllArgsConstructor 
public class CommandLineRunnerSubtask implements CommandLineRunner{

	TaskRepository taskRepository;
	SubtaskRepository subtaskRepository;
	@Override
	public void run(String... args) throws Exception {
		List<Task> tasks = taskRepository.findAll();
		
		for (int i = 0; i < tasks.size(); i++) {
			for (int j = 0; j < 3; j++) {
				subtaskRepository.save(new Subtask("Subtask" + j + " description", tasks.get(i)));
			}
		}
	}
}
