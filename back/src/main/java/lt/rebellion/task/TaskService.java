package lt.rebellion.task;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lt.rebellion.exception.NotAuthorizedException;
import lt.rebellion.exception.NotFoundException;
import lt.rebellion.exception.UnprocessableEntityException;
import lt.rebellion.model.EPriority;
import lt.rebellion.model.EStatus;
import lt.rebellion.project.Project;
import lt.rebellion.project.ProjectRepository;
import lt.rebellion.role.ERole;
import lt.rebellion.role.Role;
import lt.rebellion.role.RoleRepository;
import lt.rebellion.user.User;
import lt.rebellion.user.UserService;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

	private final TaskRepository taskRepository;
	private final ProjectRepository projectRepository;
	private final UserService userService;
	private final RoleRepository roleRepository;

	
	// GET all tasks ====================================================>
	public ResponseEntity<List<Task>> getAllTasks() {
		List<Task> tasks = taskRepository.findAll();
		return new ResponseEntity<>(tasks, HttpStatus.OK);
	}

	// GET task by id ===================================================>
	public ResponseEntity<Task> getTaskById(Long id) {

		validateTaskId(id);
		Task task = taskRepository.findById(id).get();
		return new ResponseEntity<Task>(task, HttpStatus.OK);
	}
	
	// GET backlog tasks ================================================>
	public ResponseEntity<List<Task>> getBacklogTasks(Long id) {
		
		Project project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project Not Found"));
		if(!checkAuthorization(project)) {
			throw new NotAuthorizedException(HttpStatus.UNAUTHORIZED, "Unauthorized request");
		}
		List<Task> tasks = taskRepository.findBacklogTasks(id);
		return new ResponseEntity<>(tasks, HttpStatus.OK);
	}
	
	// GET active-board tasks ===========================================>
	public ResponseEntity<List<Task>> getActiveTasks(Long id) {
		Project project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project Not Found"));
		if(!checkAuthorization(project)) {
			throw new NotAuthorizedException(HttpStatus.UNAUTHORIZED, "Unauthorized request");
		}
		List<Task> tasks = taskRepository.findActiveTasks(id);
		return new ResponseEntity<>(tasks, HttpStatus.OK);
	}

	// DELETE task by id ================================================>
	public ResponseEntity<String> deleteTaskById(Long id) {

		validateTaskId(id);
		Project project = taskRepository.findById(id).get().getProject();
		
		if (!checkAuthorization(project)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		taskRepository.deleteById(id);
		return new ResponseEntity<>("Task deleted", HttpStatus.OK);
	}

	// CREATE task ======================================================>
	public ResponseEntity<Task> createTask(TaskCreateRequestDTO taskRequestDTO) {

		Project project = projectRepository.findById(taskRequestDTO.getProjectId()).get();
		if (!checkAuthorization(project)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Task task = new Task(taskRequestDTO.getName(), taskRequestDTO.getDescription(), EPriority.valueOf(taskRequestDTO.getPriority()), project);
		taskRepository.save(task);

		return new ResponseEntity<Task>(task, HttpStatus.CREATED);
	}

	// UPDATE task by id ================================================>
	public ResponseEntity<Task> updateTaskById(Long id, TaskUpdateRequestDTO taskUpdateRequestDTO) {

		validateTaskId(id);

		Project project = taskRepository.findById(id).get().getProject();

		if (!checkAuthorization(project)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Task task = taskRepository.findById(id).get();

		task.setName(taskUpdateRequestDTO.getName());
		task.setDescription(taskUpdateRequestDTO.getDescription());
		task.setPriority(EPriority.valueOf(taskUpdateRequestDTO.getPriority()));
		task.setStatus(EStatus.valueOf(taskUpdateRequestDTO.getStatus()));
		taskRepository.save(task);

		return new ResponseEntity<Task>(task, HttpStatus.OK);
	}

	// CHECK Authorization ==============================================>
	public boolean checkAuthorization(Project project) {

		if (project == null) {
			throw new NullPointerException();
		}
		if(project.getStatus().equals(EStatus.DONE)) {
			return false;
		}
		User user = userService.getCurrentUser();

		Set<User> users = project.getUsers();
		Role admin = roleRepository.findByName(ERole.ROLE_ADMIN).get();
		Role moderator = roleRepository.findByName(ERole.ROLE_MODERATOR).get();

		if (user.getRoles().contains(admin) || user.getRoles().contains(moderator)) {
			return true;
		} else if (users.stream().anyMatch(u -> u.getId().equals(user.getId()))) {
			return true;
		}
		return false;
	}

	// VALIDATE Task by id ==============================================>
	public boolean validateTaskId(Long id) {
		if (id == null) {
			throw new NullPointerException();
		}
		if (!taskRepository.existsById(id)) {
			throw new NotFoundException("Task not found with id: " + id);
		}

		return true;
	}

	public void validateTask(Task task) {
		if (task.getProject() == null)
			throw new UnprocessableEntityException("Project is required");
		if (task.getName() == null || task.getName().trim().isEmpty()) {
			throw new UnprocessableEntityException("Task name is required");
		}
	}

}
