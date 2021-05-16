package lt.rebellion.task;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
=======
import org.springframework.http.HttpStatus;
>>>>>>> 4b980378fc7ceb36eea4abfd39a9f4f9fb5b4ea9
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lt.rebellion.journal.Activity;
import lt.rebellion.journal.Category;
import lt.rebellion.journal.JournalService;
import lt.rebellion.journal.Type;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/projects")
public class TaskController {

	private final TaskService taskService;
	
	@Autowired
	private JournalService journalService;

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/tasks")
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("/tasks/{id}")
	public Task getTaskById(@NotBlank @PathVariable Long id) {
		return taskService.getTaskById(id);
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("{id}/tasks/backlog")
	public List<Task> getBacklogTasks(@NotBlank @PathVariable Long id) {
		return taskService.getBacklogTasks(id);
	}

	@ResponseStatus(HttpStatus.OK)
	@GetMapping("{id}/tasks/active")
	public List<Task> getActiveTasks(@NotBlank @PathVariable Long id) {
		return taskService.getActiveTasks(id);
	}

	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping("/tasks/{id}")
<<<<<<< HEAD
	public ResponseEntity<String> deleteTaskById(@PathVariable Long id) {
		String message="Task with id: "+id+" was deleted";
		journalService.newJournalEntry(Type.INFO, Category.TASK, Activity.DELETED,
				message);
		return taskService.deleteTaskById(id);
=======
	public void deleteTaskById(@PathVariable Long id) {
>>>>>>> 4b980378fc7ceb36eea4abfd39a9f4f9fb5b4ea9
	}

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping("/tasks")
<<<<<<< HEAD
	public ResponseEntity<Task> createTaskByProjectId(@RequestBody @Valid @NotBlank TaskCreateRequestDTO taskRequestDTO) {
		String message="Task: "+taskRequestDTO.getName()+" was created";
		journalService.newJournalEntry(Type.INFO, Category.TASK, Activity.CREATED,
				message);
=======
	public Task createTaskByProjectId(@RequestBody @Valid @NotBlank TaskCreateRequestDTO taskRequestDTO) {
>>>>>>> 4b980378fc7ceb36eea4abfd39a9f4f9fb5b4ea9
		return taskService.createTask(taskRequestDTO);
	}

	@ResponseStatus(HttpStatus.OK)
	@PutMapping("/tasks/{id}")
<<<<<<< HEAD
	public ResponseEntity<Task> updateTaskById(@PathVariable Long id, @RequestBody @Valid @NotBlank TaskUpdateRequestDTO TaskUpdateRequestDTO) {
		String message="Task with id: "+id+" was updated";
		journalService.newJournalEntry(Type.INFO, Category.TASK, Activity.UPDATED,
				message);
=======
	public Task updateTaskById(@PathVariable Long id,
			@RequestBody @Valid @NotBlank TaskUpdateRequestDTO TaskUpdateRequestDTO) {
>>>>>>> 4b980378fc7ceb36eea4abfd39a9f4f9fb5b4ea9
		return taskService.updateTaskById(id, TaskUpdateRequestDTO);
	}
	
	@GetMapping("{id}/tasks/export")
	public void exportToCSV(@PathVariable Long id,  HttpServletResponse response) throws IOException {
        taskService.exportToCSV(id, response);
    }

}
