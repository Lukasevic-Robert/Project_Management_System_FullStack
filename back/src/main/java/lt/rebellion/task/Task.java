package lt.rebellion.task;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task extends BaseEntity {

	@Column(name = "name")
	private String name;
	
	@Column(name = "description")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "priority")
	private EPriority priority = EPriority.LOW;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private EStatus status = EStatus.BACKLOG;

	@ManyToOne
	@JoinColumn(name = "project_id")
	@JsonBackReference
	private Project project;

	public Task(String name, Project project) {
		super();
		this.name = name;
		this.project = project;
	}

	public Task(String name, String description, EPriority priority, Project project) {
		super();
		this.name = name;
		this.description = description;
		this.priority = priority;
		this.project = project;
	}
}
