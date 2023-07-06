USE employee_db;

INSERT INTO departments (department_name)
    VALUES  
        ("Cinematography"), 
        ("Editing"), 
        ("Animation"), 
        ("Production Design"), 
        ("Sound"), 
        ("Wardrobe"), 
        ("Props"), 
        ("Set Design"), 
        ("Casting"), 
        ("Management");
    
INSERT INTO roles (role_title, salary, department_id)
	VALUES  ("Director", 1000000, 1), 
		("Producer", 1000000, 10), 
		("Animator", 200000, 3), 
        ("Director of Photography", 750000, 1), 
        ("Key Grip", 100000, 5), 
        ("Costume Designer", 100000, 6), 
        ("Prop Master", 180000, 7), 
        ("Set Designer", 200000, 8), 
        ("Editor", 500000, 2), 
        ("Casting Director", 240000, 9),
        ("Cast Member", 800000, 9);
        
INSERT INTO employees (first_name, last_name, role_id, manager_id)
	VALUES 
        ("Lana", "Wachowski", 1, NULL),
        ("Lilly", "Wachowski", 1, null),
        ("Bill", "Pope", 10, 1),
        ("Keanu", "Reeves", 11, 3),
        ("Zach", "Staenberg", 9, 2);