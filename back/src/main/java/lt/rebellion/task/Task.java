package lt.rebellion.task;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.vladmihalcea.hibernate.type.json.JsonStringType;

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
@TypeDef(
	    name = "json",
	    typeClass = JsonStringType.class
	)
@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task extends BaseEntity {

	@Column(name = "name")
	private String name;
	
	@Type(type = "json")
	@Column(name = "description", columnDefinition = "NVARCHAR")
	private List<String> description = new ArrayList<String>();

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

	public Task(String name, List<String> description, EPriority priority, Project project) {
		super();
		this.name = name;
		this.description = description;
		this.priority = priority;
		this.project = project;
	}
}
