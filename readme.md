# Project management system
The system is designed to manage projects and track their status. Projects can be registered in the system where their implementation is monitored. Each project can contain specific tasks. Task status is tracked in backlog and active board.

___

## Getting started
1. Clone the [repository](https://github.com/Lukasevic-Robert/Project_Management_System_FullStack)
2. Open _Spring Tools Suite_ 
3. Import project: File -> Import... -> Maven -> Existing Maven Projects -> Next -> Browse... ->
_select folder the project was saved in f. ex.:_ G:\Programs \Project_Management_System\ **back** -> Finish
3. Right Mouse Click on the project -> Run As -> Spring Boot App
4. Open _Visual Studio Code_
5. Open project File -> Open Folder... -> _select folder the project was saved in f.ex.:_ G:\Programs \ Project_Management_System\ **front** -> Select Folder
3. Open terminal: Terminal -> New Terminal
4. Command in the opened terminal to install required packages:  **npm i**  
5. Command in the opened terminal to start the project: **npm start**
6. System will open on port [3000](http://localhost:3000/)

## System roles:

| Role  | Permissions |
| ------------- | ------------- |
| ADMIN  | confirm new user account, create, update, delete users, review system logs, create, update, view, delete projects and tasks, assign projects to users  |
| MODERATOR  | create, view, update, delete projects and tasks, assign projects to users  |
| USER  | create, view, update, delete tasks of projects user is assigned to, view project status of projects user is not assigned to  |


## Register/ login
One can log in with precreated accounts:
* User: _user@mail.com_ Password: _User1_
* Administrator: _admin@mail.com_ Password: _Admin1_

or setup a new account by using signup option

## Projects
Users with roles _admin_ and _moderator_ have permission to create, update and delete a project and assign users to it.

Projects are listed in the table and can be selected for more details. 

On selection project status can be viewed. However, only users assigned to a project have permission to view the specific tasks of the project.

Projects can be saved to _csv_ file.

## Tasks
Users assinged to specific projects can view, delete, update tasks by selecting a project one is assigned to.

Users can view tasks in backlog and change their status to active when task is to be implemented. Status of active tasks can be viewed in active board where their status can be changed to _TODO_, _IN PROGRESS_, _DONE_ 

Tasks can be saved to _csv_ file




