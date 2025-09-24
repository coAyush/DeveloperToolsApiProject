# DeveloperToolsApiProject
All Frontend related codes should be kept in Frontend folder
pom.xml contains the depemdency configuration
and the rest of files should be placed according to the structure given below
DevToolBox/
│── pom.xml
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/devtoolbox/
│   │   │       ├── config/
│   │   │       │   ├── AppConfig.java            <-- Core Spring beans (DataSource, Mail, PDF)
│   │   │       │   ├── WebConfig.java            <-- Spring MVC config (ViewResolver, static resources)
│   │   │       │   └── WebInitializer.java       <-- Replaces web.xml (Servlet initializer)
│   │   │       │
│   │   │       ├── controller/                   <-- REST + Servlet endpoints
│   │   │       ├── dao/                          <-- DAO layer (JDBC / Hibernate)
│   │   │       ├── model/                        <-- Entities (User, APIUsage, etc.)
│   │   │       ├── service/                      <-- Business logic (PDF, Mail, API Wrappers)
│   │   │       └── util/                         <-- Utility classes (validators, helpers)
│   │   │
│   │   └── resources/                            <-- Non-XML resource files
│   │       ├── db.properties                     <-- DB configs
│   │       ├── mail.properties                   <-- Mail configs
│   │       └── log4j2.xml                        <-- Logging
│   │
│   │   └── webapp/                               <-- Web resources
│   │       ├── index.html                        <-- React entry
│   │       └── static/                           <-- React build output (JS/CSS/images)
│   │
│   └── test/                                     <-- JUnit/Mockito tests
│       └── java/com/devtoolbox/
│           ├── service/
│           └── dao/
│
└── frontend/                                     <-- React project
