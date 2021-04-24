package lt.rebellion.project;

import java.util.HashSet;
import java.util.Set;

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
import lt.rebellion.model.EStatus;
import lt.rebellion.task.Task;
import lt.rebellion.user.User;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "projects")
public class Project extends BaseEntity {

	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private EStatus status = EStatus.IN_PROGRESS;

	@OneToMany(mappedBy = "project", cascade = CascadeType.REMOVE, orphanRemoval = true)
	private Set<Task> tasks = new HashSet<>();
	
	@ManyToOne
	@JoinColumn(name="user_id")
	@JsonBackReference
	private User user;

	public Project(String name, String description, User user) {
		super();
		this.name = name;
		this.description = description;
		this.user = user;
	}
}
