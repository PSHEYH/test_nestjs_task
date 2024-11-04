Test NEST JS task readme

Description of the solution:
In order to create solution for this tasks I am doing next:
Firstly, I modeled the tables that will display my entities.

Table
staff 
  - id
  - name
  - position
  - joining_date

Table 
staff_subordinates
  - supervisor_id
  - subordinate_id

Supervisor_id and subordinate_id are foreign keys which referrences on id in staff table. I did this to create one-to-many relationship, 
because in the future i need to have access to subordinates throught staff. Also I set postion field Enum type in order to avoid setting invalid data to position. 

Secondly, for application I use MVC pattern which default for Nest JS. 
I have folders staff which is responsible for working with staff. There I have controller, module, service, entity and folders: dto, responses and guards.
Folder dto stores dto models, this models I need to use for transfering data throughth controller.  
In responses I store custom response class to specify documentation with swagger.
In the guards folder I store guard decorator to check before creating staffSubordinate if it is not Employee. If it's not throw exception
For working with database I am using ORM - TypeORM, because it's easy and popular library.

Finally, for realisation algorithm of calcualting salary of staff I create controller which have getStaffSalaryById - GET request with id parameter.
This method run getStaffSalaryById in my service which work with recursion. I used recursion for this algorithm because in this task we have tree of nested objects 
and recursion solve this problem very well.

Also for work with my entities I create base CRUD opearation for staff and staff_subordinats.

Advantages of this realisation:
Readability and simplicity of code because it is simple calling function inside function with exit condition.

Disadvantages:
Loops are little bit more efficient than recursion but writing this with loop will be more complex and I even don't how to do it).

I think to improve this solution better to store actual salary into staff table and use triggers on INSERT and DELETE to chaning the actual salary so user will not have to wait
of calculating salary with recursion but it's create additional load on datatbase.


To deploy projects you need next steps:

1. Write command in the root project:

  "npm install"

4. Create ".env" file in the root of project with content:

POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432

3. Writ command in the root of project:

   "docker-compose up -d"

to create docker container of postgres database.

4. Run command to start project:

  "npm run start:dev"

For running tests, run command:

  "npm run test"
