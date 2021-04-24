package lt.rebellion.project;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
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

	@OneToMany(mappedBy = "project")
	private Set<Task> tasks = new HashSet<>();
	
	@ManyToOne
	@JoinColumn(name="user_id")
	@JsonBackReference
	private User user;
	
	
}
