package lt.rebellion.project;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lt.rebellion.baseEntity.BaseEntity;
import lt.rebellion.model.EStatus;
import lt.rebellion.task.Task;
import lt.rebellion.user.User;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
public class Project extends BaseEntity {


	@Column(name = "name")
	private String name;

	@Column(name = "description")
	private String description;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private EStatus status = EStatus.ACTIVE;

	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Task> tasks = new ArrayList<>();
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "user_projects",
	joinColumns = @JoinColumn(name = "project_id"),
		inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> users = new HashSet<>();

	
	
	public Project(String name, String description, Set<User> users) {
		super();
		this.name = name;
		this.description = description;
		this.users = users;
	}

	public Project(String name, String description) {
		super();
		this.name = name;
		this.description = description;
	}	
}
