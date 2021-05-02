package lt.rebellion.task;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tasks")
public class TaskController {

	private final TaskService taskService;

	// GET all tasks ====================================================>
	@GetMapping
	public ResponseEntity<List<Task>> getAllTasks() {
		return taskService.getAllTasks();
	}

	// GET task by id ===================================================>
	@GetMapping("/{id}")
	public ResponseEntity<Task> getTaskById(Long id) {
		return taskService.getTaskById(id);
	}

	// DELETE task by id ================================================>
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteTaskById(@PathVariable Long id) {
		return taskService.deleteTaskById(id);
	}

	// CREATE task ======================================================>
	@PostMapping
	public ResponseEntity<Task> createTaskByProjectId(@RequestBody TaskCreateRequestDTO taskRequestDTO) {
		return taskService.createTask(taskRequestDTO);
	}

	// UPDATE task by id ================================================>
	@PutMapping("/{id}")
	public ResponseEntity<Task> updateTaskById(@PathVariable Long id, @RequestBody TaskUpdateRequestDTO TaskUpdateRequestDTO) {
		return taskService.updateTaskById(id, TaskUpdateRequestDTO);
	}

}
