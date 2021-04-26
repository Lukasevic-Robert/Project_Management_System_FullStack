package lt.rebellion.task;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lt.rebellion.baseEntity.BaseEntity;
import lt.rebellion.model.EPriority;
import lt.rebellion.model.EStatus;
import lt.rebellion.project.Project;
import lt.rebellion.task.subtask.Subtask;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task extends BaseEntity {

	private String name;

	@Enumerated(EnumType.STRING)
	@Column(name = "priority")
	private EPriority priority = EPriority.MEDIUM;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private EStatus status = EStatus.TODO;

	@ManyToOne
	@JoinColumn(name = "project_id")
	@JsonBackReference
	private Project project;

	@OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Subtask> subtasks = new ArrayList<>();

	public Task(String name, Project project) {
		super();
		this.name = name;
		this.project = project;
	}
}
