package lt.rebellion.task;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

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

	public List<Task> getAllTasks() {
		List<Task> tasks = taskRepository.findAll();
		return tasks;
	}

	public Task getTaskById(Long id) {
		validateTaskId(id);
		Task task = taskRepository.findById(id).get();
		return task;
	}

	public List<Task> getBacklogTasks(Long id) {
		Project project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project Not Found"));
		checkAuthorization(project);
		List<Task> tasks = taskRepository.findBacklogTasks(id);
		return tasks;
	}

	public List<Task> getActiveTasks(Long id) {
		Project project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project Not Found"));
		checkAuthorization(project);
		List<Task> tasks = taskRepository.findActiveTasks(id);
		return tasks;
	}

	public void deleteTaskById(Long id) {
		validateTaskId(id);
		checkAuthorization(taskRepository.findById(id).get().getProject());
		taskRepository.deleteById(id);
	}

	public Task createTask(TaskCreateRequestDTO taskRequestDTO) {
		Project project = projectRepository.findById(taskRequestDTO.getProjectId()).get();
		checkAuthorization(project);
		Task task = new Task(taskRequestDTO.getName(), taskRequestDTO.getDescription(),
				EPriority.valueOf(taskRequestDTO.getPriority()), EStatus.valueOf(taskRequestDTO.getStatus()), project);
		taskRepository.save(task);
		return task;
	}

	public Task updateTaskById(Long id, TaskUpdateRequestDTO taskUpdateRequestDTO) {
		validateTaskId(id);
		checkAuthorization(taskRepository.findById(id).get().getProject());
    
		Task task = taskRepository.findById(id).get();
		task.setName(taskUpdateRequestDTO.getName());
		task.setDescription(taskUpdateRequestDTO.getDescription());
		task.setPriority(EPriority.valueOf(taskUpdateRequestDTO.getPriority()));
		task.setStatus(EStatus.valueOf(taskUpdateRequestDTO.getStatus()));
		taskRepository.save(task);
		return task;
	}


	public void exportToCSV(Long id, HttpServletResponse response) throws IOException {
		DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
		String currentDateTime = dateFormatter.format(new Date());

		String headerKey = "Content-Disposition";
		String headerValue = "attachment; filename=tasks_" + currentDateTime + ".csv";
		response.setHeader(headerKey, headerValue);

		Project project = projectRepository.findById(id).get();
		checkAuthorization(project);
	
		List<Task> tasks = project.getTasks();

		ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);
		String[] csvHeader = { "Task ID", "Name", "Description", "Status", "Priority" };
		String[] nameMapping = { "id", "name", "description", "status", "priority" };

		csvWriter.writeHeader(csvHeader);

		for (Task task : tasks) {
			csvWriter.write(task, nameMapping);
		}
		csvWriter.close();
	}

	public boolean checkAuthorization(Project project) {

		if (project == null) {
			throw new NullPointerException();
		}
		User user = userService.getCurrentUser();
		Set<User> users = project.getUsers();
		Role admin = roleRepository.findByName(ERole.ROLE_ADMIN).get();
		Role moderator = roleRepository.findByName(ERole.ROLE_MODERATOR).get();

		if (user.getRoles().contains(admin) || user.getRoles().contains(moderator)) {
			return true;
		} else if ((!project.getStatus().equals(EStatus.DONE))
				&& users.stream().anyMatch(u -> u.getId().equals(user.getId()))) {
			return true;
		}
		throw new NotAuthorizedException(HttpStatus.UNAUTHORIZED, "Unauthorized request");
	}

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
