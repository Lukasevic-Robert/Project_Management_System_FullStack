INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Retaining Wall and Brick Pavers', 'Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Epoxy Flooring', 'Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Rebar and Wire Mesh Install', 'Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Soft Flooring and Base', 'In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Electrical and Fire Alarm', 'In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Framing Wood', 'Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Elevator', 'Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Plumbing and Medical Gas', 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Fire Protection', 'Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.', 'ACTIVE');
INSERT INTO projects (created_at, updated_at, name, description, status) values (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Glass and Glazing', 'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.', 'ACTIVE');

INSERT INTO tasks (created_at, updated_at, name, description, status, priority, project_id) values
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Painting and Vinyl Wall Covering','Proin at turpis a pede posuere nonummy.
 Integer non velit.
 Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.','BACKLOG','LOW', 1),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Doors, Frames and Hardware','Morbi porttitor lorem id ligula.
 Suspendisse ornare consequat lectus. 
 In est risus, auctor sed, tristique in, tempus sit amet, sem.','TODO','LOW', 1),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Temp Fencing, Decorative Fencing and Gates','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
Proin interdum mauris non ligula pellentesque ultrices.','IN_PROGRESS','MEDIUM', 1),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Ornamental Railings','Integer a nibh. In quis justo. 
Maecenas rhoncus aliquam lacus. 
Morbi quis tortor id nulla ultrices aliquet.','IN_PROGRESS','HIGH', 1),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Asphalt Paving','Integer non velit. 
Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.','BACKLOG','LOW', 2),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Electrical and Fire Alarm','Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.','TODO','LOW', 2),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Granite Surfaces','Nulla nisl. Nunc nisl. 
Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.','IN_PROGRESS','MEDIUM', 2),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Wall Protection','Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. 
Donec pharetra, magna vestibulum aliquet ultrices.','IN_PROGRESS','HIGH', 2),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Drilled Shafts','Duis ac nibh. 
Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. 
Suspendisse potenti.','TODO','LOW', 3),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Masonry and Precast','Cras pellentesque volutpat dui. 
Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.','BACKLOG','LOW', 3),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Epoxy Flooring','Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. 
Nulla dapibus dolor vel est.','IN_PROGRESS','MEDIUM', 3),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Exterior Signage','Vestibulum sed magna at nunc commodo placerat. 
Praesent blandit. Nam nulla. 
Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.','IN_PROGRESS','HIGH', 3),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'HVAC','Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.','TODO','LOW', 4),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Construction Clean and Final Clean','Aliquam sit amet diam in magna bibendum imperdiet. 
Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.','BACKLOG','LOW', 4),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Curb and Gutter','Integer ac neque. Duis bibendum. 
Morbi non quam nec dui luctus rutrum. Nulla tellus. 
In sagittis dui vel nisl. Duis ac nibh.','IN_PROGRESS','MEDIUM', 4),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Fire Sprinkler System','Etiam justo. 
Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. 
Ut tellus.','IN_PROGRESS','HIGH', 4),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Painting and Vinyl Wall Covering','Proin at turpis a pede posuere nonummy. 
Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.','BACKLOG','LOW', 5),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Doors, Frames and Hardware','Morbi porttitor lorem id ligula. 
Suspendisse ornare consequat lectus. 
In est risus, auctor sed, tristique in, tempus sit amet, sem.','TODO','LOW', 5),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Temp Fencing, Decorative Fencing and Gates','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
Proin interdum mauris non ligula pellentesque ultrices.','IN_PROGRESS','MEDIUM', 5),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Ornamental Railings','Integer a nibh. In quis justo. 
Maecenas rhoncus aliquam lacus. 
Morbi quis tortor id nulla ultrices aliquet.','IN_PROGRESS','HIGH', 5),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Asphalt Paving','Integer non velit. 
Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.','BACKLOG','LOW', 6),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Electrical and Fire Alarm','Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.','TODO','LOW', 6),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Granite Surfaces','Nulla nisl. Nunc nisl. 
Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa.','IN_PROGRESS','MEDIUM', 6),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Wall Protection','Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. 
Donec pharetra, magna vestibulum aliquet ultrices.','IN_PROGRESS','HIGH', 6),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Drilled Shafts','Duis ac nibh. 
Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. 
Suspendisse potenti.','TODO','LOW', 7),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Masonry and Precast','Cras pellentesque volutpat dui. 
Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.','BACKLOG','LOW', 7),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Epoxy Flooring','Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. 
Nulla dapibus dolor vel est.','IN_PROGRESS','MEDIUM', 7),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Exterior Signage','Vestibulum sed magna at nunc commodo placerat. 
Praesent blandit. Nam nulla. 
Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.','IN_PROGRESS','HIGH', 7),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'HVAC','Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.','TODO','LOW', 8),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Construction Clean and Final Clean','Aliquam sit amet diam in magna bibendum imperdiet. 
Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.','BACKLOG','LOW', 8),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Curb and Gutter','Integer ac neque. 
Duis bibendum. Morbi non quam nec dui luctus rutrum. 
Nulla tellus. 
In sagittis dui vel nisl. 
Duis ac nibh.','IN_PROGRESS','MEDIUM', 8),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Fire Sprinkler System','Etiam justo. 
Etiam pretium iaculis justo. In hac habitasse platea dictumst. 
Etiam faucibus cursus urna. Ut tellus.','IN_PROGRESS','HIGH', 8),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Drilled Shafts','Duis ac nibh. 
Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. 
Suspendisse potenti.','BACKLOG','LOW', 9),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Masonry and Precast','Cras pellentesque volutpat dui. 
Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.','TODO','LOW', 9),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Epoxy Flooring','Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae. Nulla dapibus dolor vel est.','IN_PROGRESS','MEDIUM', 9),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Exterior Signage','Vestibulum sed magna at nunc commodo placerat. 
Praesent blandit. Nam nulla. 
Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.','IN_PROGRESS','HIGH', 9),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Painting and Vinyl Wall Covering','Proin at turpis a pede posuere nonummy. 
Integer non velit. 
Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.','BACKLOG','LOW', 10),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Doors, Frames and Hardware','Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. 
In est risus, auctor sed, tristique in, tempus sit amet, sem.','TODO','LOW', 10),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Temp Fencing, Decorative Fencing and Gates','Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
Proin interdum mauris non ligula pellentesque ultrices.','IN_PROGRESS','MEDIUM', 10),
(CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'Ornamental Railings','Integer a nibh. In quis justo. 
Maecenas rhoncus aliquam lacus. 
Morbi quis tortor id nulla ultrices aliquet.','IN_PROGRESS','HIGH', 10);