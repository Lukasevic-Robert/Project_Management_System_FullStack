package lt.rebellion.task;

import java.util.List;

import javax.validation.constraints.NotBlank;

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
@RequestMapping("/api/v1/projects")
public class TaskController {

	private final TaskService taskService;

	// GET all tasks ====================================================>
	@GetMapping("/tasks")
	public ResponseEntity<List<Task>> getAllTasks() {
		return taskService.getAllTasks();
	}

	// GET task by id ===================================================>
	@GetMapping("/tasks/{id}")
	public ResponseEntity<Task> getTaskById(Long id) {
		return taskService.getTaskById(id);
	}
	
	// GET backlog tasks by project id ==================================>
	@GetMapping("{id}/tasks/backlog")
	public ResponseEntity<List<Task>> getBacklogTasks(@NotBlank @PathVariable Long id){
		return taskService.getBacklogTasks(id);
	}
	
	// GET active-board tasks by project id =============================>
	@GetMapping("{id}/tasks/active")
	public ResponseEntity<List<Task>> getActiveTasks(@NotBlank @PathVariable Long id){
		return taskService.getActiveTasks(id);
	}

	// DELETE task by id ================================================>
	@DeleteMapping("/tasks/{id}")
	public ResponseEntity<String> deleteTaskById(@PathVariable Long id) {
		return taskService.deleteTaskById(id);
	}

	// CREATE task ======================================================>
	@PostMapping("/tasks")
	public ResponseEntity<Task> createTaskByProjectId(@RequestBody TaskCreateRequestDTO taskRequestDTO) {
		return taskService.createTask(taskRequestDTO);
	}

	// UPDATE task by id ================================================>
	@PutMapping("/tasks/{id}")
	public ResponseEntity<Task> updateTaskById(@PathVariable Long id, @RequestBody TaskUpdateRequestDTO TaskUpdateRequestDTO) {
		return taskService.updateTaskById(id, TaskUpdateRequestDTO);
	}

}
